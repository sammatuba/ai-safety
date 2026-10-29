"""The only module that touches the network. OpenAI-compatible chat completions over urllib,
configured by environment variables (or lab/.env), with a disk cache keyed by the request.

Decision D-005: one adapter for OpenRouter, Nebius, DeepSeek, local servers.

Environment:
  LLM_BASE_URL   e.g. https://openrouter.ai/api/v1
  LLM_API_KEY
  LLM_MODEL      provider model id
  LLM_TEMPERATURE_AGENT (default 0.2), LLM_TEMPERATURE_JUDGE (default 0.0)
  LLM_TIMEOUT_S  (default 60)
"""
from __future__ import annotations

import hashlib
import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path
from datetime import datetime, timezone
from typing import Callable

LAB_DIR = Path(__file__).resolve().parents[2]
CACHE_DIR = LAB_DIR / "data" / "cache"


class LLMError(RuntimeError):
    pass


def load_env(path: Path = LAB_DIR / ".env") -> None:
    """Minimal .env loader: KEY=VALUE lines, no quotes handling beyond stripping."""
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


class Client:
    def __init__(self, model: str | None = None, base_url: str | None = None, api_key: str | None = None,
                 cache: bool = True):
        # LLM_ENV_FILE selects another git-ignored key file, e.g. lab/.env.openrouter.
        load_env(Path(os.environ.get("LLM_ENV_FILE", str(LAB_DIR / ".env"))))
        self.base_url = (base_url or os.environ.get("LLM_BASE_URL", "")).rstrip("/")
        self.api_key = api_key or os.environ.get("LLM_API_KEY", "")
        self.model = model or os.environ.get("LLM_MODEL", "")
        self.t_agent = float(os.environ.get("LLM_TEMPERATURE_AGENT", "0.2"))
        self.t_judge = float(os.environ.get("LLM_TEMPERATURE_JUDGE", "0.0"))
        self.timeout = float(os.environ.get("LLM_TIMEOUT_S", "60"))
        self.cache = cache
        self.calls = 0
        self.cache_hits = 0
        self.prompt_tokens = 0
        self.completion_tokens = 0
        if not (self.base_url and self.api_key and self.model):
            raise LLMError("LLM not configured: set LLM_BASE_URL, LLM_API_KEY, LLM_MODEL in lab/.env "
                           "(see lab/.env.example). Scripted regimes run without an LLM.")

    def _cache_path(self, payload: dict) -> Path:
        key = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()
        return CACHE_DIR / f"{key}.json"

    def chat(self, messages: list[dict], temperature: float, max_tokens: int | None = None) -> str:
        # LLM_MAX_TOKENS (default 600) lets verbose models finish their JSON; the prompts do not change.
        max_tokens = max_tokens or int(os.environ.get("LLM_MAX_TOKENS", "600"))
        payload = {"model": self.model, "messages": messages, "temperature": temperature, "max_tokens": max_tokens}
        # LLM_EXTRA_JSON adds provider fields, e.g. '{"thinking": {"type": "disabled"}}' for DeepSeek V4.
        # It is part of the cache key, so runs with different settings never share cached replies.
        extra = os.environ.get("LLM_EXTRA_JSON", "")
        if extra:
            payload.update(json.loads(extra))
        cp = self._cache_path(payload)
        if self.cache and cp.exists():
            self.cache_hits += 1
            return json.loads(cp.read_text(encoding="utf-8"))["content"]
        req = urllib.request.Request(
            f"{self.base_url}/chat/completions", data=json.dumps(payload).encode(),
            headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json",
                     "HTTP-Referer": "https://github.com/sammatuba/ai-safety", "X-Title": "epistemic-lab"},
            method="POST")
        last_err: Exception | None = None
        for attempt in range(3):
            try:
                with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                    body = json.loads(resp.read().decode())
                content = body["choices"][0]["message"]["content"]
                usage = body.get("usage", {})
                self.prompt_tokens += int(usage.get("prompt_tokens", 0))
                self.completion_tokens += int(usage.get("completion_tokens", 0))
                self.calls += 1
                if self.cache:
                    CACHE_DIR.mkdir(parents=True, exist_ok=True)
                    cp.write_text(json.dumps({"payload": payload, "content": content, "usage": usage}), encoding="utf-8")
                return content
            except (urllib.error.URLError, urllib.error.HTTPError, KeyError, json.JSONDecodeError) as e:
                last_err = e
                time.sleep(1.5 * (attempt + 1))
        raise LLMError(f"LLM request failed after 3 attempts: {last_err}")

    def chat_agent(self, prompt: str) -> str:
        return self.chat([{"role": "user", "content": prompt}], self.t_agent)

    def chat_judge(self, prompt: str) -> str:
        return self.chat([{"role": "user", "content": prompt}], self.t_judge)

    def usage(self) -> dict:
        return {"model": self.model, "calls": self.calls, "cache_hits": self.cache_hits,
                "prompt_tokens": self.prompt_tokens, "completion_tokens": self.completion_tokens}


PROMO_END = datetime(2026, 10, 31, 16, 0, tzinfo=timezone.utc)


class ResearchToolError(LLMError):
    """A search or retrieval failed; the message never includes credentials."""


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ResearchToolError("Unexpected redirect from the DeepSeek tools endpoint")


class DeepSeekResearchTools:
    """Retrieve evidence items and provenance without calling a language model.

    The caller must confirm that its account and route receive promotional coverage.
    This client never infers that coverage from a valid API key. Every attempt checks
    the promotional cutoff. Paid model inference is deliberately absent.
    """

    def __init__(self, *, free_confirmed: bool = False, api_key: str | None = None,
                 timeout: float = 35, clock: Callable | None = None,
                 on_attempt: Callable | None = None, paid_authorized: bool = False):
        if not free_confirmed and not paid_authorized:
            raise ResearchToolError("Confirm free coverage for this route before collection")
        self.paid_authorized = paid_authorized
        load_env()
        self.api_key = api_key or os.environ.get("DEEPSEEK_API_KEY") or os.environ.get("LLM_API_KEY", "")
        if not self.api_key:
            raise ResearchToolError("DeepSeek API credential missing from lab/.env")
        self.timeout = timeout
        self.clock = clock or (lambda: datetime.now(timezone.utc))
        self.on_attempt = on_attempt or (lambda **kwargs: None)
        self.opener = urllib.request.build_opener(_NoRedirect())

    def check_cutoff(self) -> None:
        if not self.paid_authorized and self.clock() >= PROMO_END:
            raise ResearchToolError("Promotional window ended; paid usage is not authorized")

    def balance(self) -> dict:
        """Read account balance without invoking search or model inference."""
        request = urllib.request.Request("https://api.deepseek.com/user/balance",
            headers={"Authorization": f"Bearer {self.api_key}"}, method="GET")
        try:
            with self.opener.open(request, timeout=self.timeout) as response:
                return json.loads(response.read())
        except urllib.error.HTTPError as exc:
            raise ResearchToolError(f"Balance endpoint returned HTTP {exc.code}") from None
        except (urllib.error.URLError, TimeoutError, OSError):
            raise ResearchToolError("Balance endpoint transport failed") from None

    def native_search(self, query: str) -> bytes:
        """Use Flash's native server-side search, matching the Harness provider.

        The promotional search fee and model tokens are distinct. The caller must
        reserve a model-validation allowance before calling this method.
        """
        self.check_cutoff()
        if not query.strip() or len(query)>128:
            raise ValueError("Native search query must contain 1 to 128 characters")
        payload={"model":"deepseek-flash","max_tokens":512,
                 "messages":[{"role":"user","content":[{"type":"text",
                    "text":"Perform a web search for the query: "+query}]}],
                 "tools":[{"type":"web_search_20250305","name":"web_search","max_uses":1}],
                 "thinking":{"type":"disabled"}}
        request=urllib.request.Request("https://api.deepseek.com/anthropic/v1/messages",
            data=json.dumps(payload).encode(),method="POST",
            headers={"Authorization":f"Bearer {self.api_key}","x-api-key":self.api_key,
                     "anthropic-version":"2023-06-01","Content-Type":"application/json"})
        self.on_attempt(operation="native-search",outcome="started",status=None)
        try:
            with self.opener.open(request,timeout=self.timeout) as response:
                raw=response.read(12_000_001)
            if len(raw)>12_000_000:
                raise ResearchToolError("Native search response exceeded snapshot limit")
            self.on_attempt(operation="native-search",outcome="success",status=200)
            return raw
        except urllib.error.HTTPError as exc:
            self.on_attempt(operation="native-search",outcome="failed",status=exc.code)
            raise ResearchToolError(f"DeepSeek native search returned HTTP {exc.code}") from None
        except (urllib.error.URLError,TimeoutError,OSError):
            self.on_attempt(operation="native-search",outcome="failed",status=None)
            raise ResearchToolError("DeepSeek native search transport failed") from None

    def request(self, operation: str, payload: dict) -> bytes:
        """Return original JSON response bytes; retry only transient transport errors."""
        self.check_cutoff()
        if not self.paid_authorized:
            raise ResearchToolError("Standalone Search/Fetch requires paid authorization; the server-side promotion uses native_search")
        if operation not in {"search", "fetch"}:
            raise ValueError("Only search and fetch are permitted")
        if operation == "search":
            query = payload.get("query", "")
            if not isinstance(query, str) or not query.strip() or len(query) > 128:
                raise ValueError("Search query must contain 1 to 128 characters")
            if not 1 <= payload.get("count", 10) <= 50:
                raise ValueError("Search count must be between 1 and 50")
        request = urllib.request.Request(
            f"https://api.deepseek.com/v1/tools/{operation}",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Authorization": f"Bearer {self.api_key}",
                     "Content-Type": "application/json"}, method="POST")
        for attempt in range(3):
            self.check_cutoff()
            # The callback can enforce account-independent collection limits.
            self.on_attempt(operation=operation, outcome="started", status=None)
            try:
                with self.opener.open(request, timeout=self.timeout) as response:
                    raw = response.read(12_000_001)
                if len(raw) > 12_000_000:
                    raise ResearchToolError("Response exceeded the 12 MB snapshot limit")
                self.on_attempt(operation=operation, outcome="success", status=200)
                return raw
            except urllib.error.HTTPError as exc:
                code = exc.code
                self.on_attempt(operation=operation, outcome="failed", status=code)
                if code not in {408, 429, 500, 502, 503, 504} or attempt == 2:
                    raise ResearchToolError(f"DeepSeek {operation} returned HTTP {code}") from None
            except (urllib.error.URLError, TimeoutError, OSError):
                self.on_attempt(operation=operation, outcome="failed", status=None)
                if attempt == 2:
                    raise ResearchToolError(f"DeepSeek {operation} transport failed after 3 attempts") from None
            time.sleep(1 + attempt)
        raise ResearchToolError("Request did not complete")
