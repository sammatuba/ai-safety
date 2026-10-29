"""Build local study-page content from canonical guides, idea records, and form answers."""
from __future__ import annotations

import html
import json
import os
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "explainer" / "assets" / "research-data.js"
BANK = "literature/landscape/brainstorming/"
GUIDE = BANK + "investigation-study-guide.md"
CONCEPT = BANK + "README.md"
BRIEFS = BANK + "candidate-briefs.md"


def section(path: str, heading: str) -> str:
    """Extract a heading and its children, stopping at the next peer or parent."""
    lines = (ROOT / path).read_text().splitlines()
    start = next(i for i, line in enumerate(lines) if line == heading)
    level = len(heading) - len(heading.lstrip("#"))
    end = next((i for i in range(start + 1, len(lines))
                if re.match(r"^#{1," + str(level) + r"} ", lines[i])), len(lines))
    return "\n".join(lines[start + 1:end]).strip()


def reference_urls() -> dict[str, str]:
    """Read verified reference destinations from the repository bibliography."""
    refs = {}
    for line in (ROOT / "literature/INDEX.md").read_text().splitlines():
        match = re.match(r"\| \[([RSTW]\d+)\] \|", line)
        if not match:
            continue
        cells = line.split("|")
        url = re.search(r"https?://[^\s)]+", cells[4])
        if url:
            refs[match[1]] = url[0]
    return refs


REFS = reference_urls()


def inline(text: str, source: str) -> str:
    """Render the small, escaped Markdown subset used by the canonical guides."""
    links = []

    def link(match: re.Match) -> str:
        label, target = match.groups()
        if not re.match(r"^(https?://|mailto:|#)", target):
            path, marker, anchor = target.partition("#")
            resolved = ((ROOT / source).parent / path).resolve()
            resolved.relative_to(ROOT)
            target = os.path.relpath(resolved, ROOT / "explainer") + (marker + anchor if marker else "")
        links.append('<a href="' + html.escape(target, quote=True) + '">' + html.escape(label) + '</a>')
        return f"STUDYLINKTOKEN{len(links)-1}END"

    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link, text)
    text = html.escape(text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"\[([RSTW]\d+)\]", lambda m: '<a class="reference" href="' +
                  html.escape(REFS.get(m[1], "../literature/INDEX.md"), quote=True) + '">[' + m[1] + ']</a>', text)
    for index, rendered in enumerate(links):
        text = text.replace(f"STUDYLINKTOKEN{index}END", rendered)
    return text


def markdown(text: str, source: str) -> str:
    """Render authored paragraphs, headings, lists, tables, and code without dependencies."""
    lines = text.splitlines()
    blocks = []
    index = 0
    while index < len(lines):
        line = lines[index].strip()
        if not line:
            index += 1
            continue
        if line.startswith("```"):
            language = line[3:]
            code = []
            index += 1
            while index < len(lines) and not lines[index].startswith("```"):
                code.append(lines[index]); index += 1
            if language != "mermaid":
                blocks.append("<pre><code>" + html.escape("\n".join(code)) + "</code></pre>")
            index += 1
            continue
        if line.startswith("|"):
            rows = []
            while index < len(lines) and lines[index].strip().startswith("|"):
                cells = lines[index].strip().strip("|").split("|")
                if not all(re.fullmatch(r"[ :\-]+", cell) for cell in cells):
                    rows.append([inline(cell.strip(), source) for cell in cells])
                index += 1
            head = "".join("<th scope=\"col\">" + cell + "</th>" for cell in rows[0])
            body = "".join("<tr>" + "".join("<td>" + cell + "</td>" for cell in row) + "</tr>" for row in rows[1:])
            blocks.append('<div class="table-scroll" tabindex="0" aria-label="Scrollable comparison table"><table><thead><tr>' + head + "</tr></thead><tbody>" + body + "</tbody></table></div>")
            continue
        heading = re.match(r"^(#{1,6}) (.*)", line)
        if heading:
            level = min(len(heading[1]), 4)
            blocks.append(f"<h{level}>" + inline(heading[2], source) + f"</h{level}>")
            index += 1
            continue
        bullet = re.match(r"^([-*]|\d+\.) (.*)", line)
        if bullet:
            ordered = bullet[1][0].isdigit()
            items = []
            while index < len(lines):
                match = re.match(r"^([-*]|\d+\.) (.*)", lines[index].strip())
                if not match or match[1][0].isdigit() != ordered:
                    break
                items.append("<li>" + inline(match[2], source) + "</li>")
                index += 1
            tag = "ol" if ordered else "ul"
            blocks.append(f"<{tag}>" + "".join(items) + f"</{tag}>")
            continue
        if line.startswith("    ") or lines[index].startswith("    "):
            code = []
            while index < len(lines) and lines[index].startswith("    "):
                code.append(lines[index][4:]); index += 1
            blocks.append("<pre><code>" + html.escape("\n".join(code)) + "</code></pre>")
            continue
        paragraph = [line]
        index += 1
        while index < len(lines) and lines[index].strip() and not re.match(r"^(#{1,6} |\||```|[-*] |\d+\. )", lines[index].strip()):
            paragraph.append(lines[index].strip()); index += 1
        blocks.append("<p>" + inline(" ".join(paragraph), source) + "</p>")
    return "\n".join(blocks)


def build() -> None:
    """Write a classic-script dataset that also works when opened as a local file."""
    specs = [
        ("start", "Start with the decision", "Separate diagnosis, repair, and permission.", "start",
         [(GUIDE, "## 1. Purpose")],
         "What would count as a successful repair if the correct evaluation reports a failure?",
         ["The evaluation must report a pass.", "The evaluation must accurately report what happened.", "The model must become safe in every setting."], 1,
         "A repair restores the specified evaluation property. It can reveal that the tested model still fails."),
        ("expenses", "The missing expense", "One reassuring summary can hide different failures.", "expenses",
         [(GUIDE, "## 2. Intuition")],
         "The repaired total rises from 2,000 to 5,000 pesos. What did the repair change?",
         ["It reduced expenses.", "It restored the accuracy of the report.", "It proved the original formula was correct."], 1,
         "The underlying expenses stay fixed. The repaired report now represents them accurately."),
        ("claims", "What does the claim mean", "Keep completed tests, required tests, and approval distinct.", None,
         [(GUIDE, "### Start from a specific claim"), (GUIDE, "### Required checks and completed checks"), (GUIDE, "### A familiar power-market version")],
         "Two completed checks pass, but the rule requires three. Does this establish approval?",
         ["Yes, the observed pass rate is 100 percent.", "No, a required check remains missing.", "Yes, if two reviewers agree."], 1,
         "The approval rule requires completion as well as passing results. Agreement cannot supply the missing observation."),
        ("evidence", "What can the evidence establish", "Understand testimony, dependence, and competing causes.", None,
         [(GUIDE, "### Ask what the evidence warrants"), (GUIDE, "### Use the three Rashomon meanings carefully"), (CONCEPT, "### Testimony and evidence independence"), (GUIDE, "### A record may have several generating causes")],
         "Three reviewers read only the same incomplete summary. What does their agreement establish?",
         ["The missing records must be correct.", "Their agreement alone does not reveal the missing records.", "The reviewers must have colluded."], 1,
         "Agreement is an observation. It does not identify a cause or establish independent access to evidence."),
        ("investigation", "Investigate before you repair", "Spend a limited evidence budget, then test your repair.", "investigation",
         [(GUIDE, "### Investigate in a useful order"), (GUIDE, "### Specify what the investigator can trust"), (GUIDE, "### Keep the evaluation scores separate"), (GUIDE, "### The evaluation task"), (GUIDE, "### Three mechanisms produce the same report"), (GUIDE, "### Walk through the reporting-omission case")],
         "You established that a required test failed, but its omission has two possible causes. Must you approve while investigating?",
         ["Yes, because the cause is unknown.", "No, the failed approval condition can justify deferral.", "Yes, unless malicious intent is proven."], 1,
         "Evidence for action and evidence for a unique diagnosis can differ. The stated approval rule still applies."),
        ("coordination", "Shared cues and control rules", "Explore focal points without confusing agreement with collusion.", "coordination",
         [(CONCEPT, "### Focal points and power-market rules"), (CONCEPT, "### Incentives and mechanism design"), (BRIEFS, "## 2. Which coordination cues survive artifact sanitization")],
         "Private messages are blocked, but the monitor reads the policy's program. Is all information transfer absent?",
         ["Yes, because the agents cannot chat.", "No, the program remains an information carrier.", "Yes, if the models have different names."], 1,
         "A communication restriction must name the paths it removes. An inspected artifact can still carry a cue."),
        ("risk", "Why this can matter for catastrophic risk", "Trace the conditional pathway from evidence to permission.", "risk",
         [(GUIDE, "## 6. Significance")],
         "What would a small investigation experiment directly establish?",
         ["The probability of a global catastrophe.", "How a specified oversight method performs on the tested failures.", "That deployed models independently want to sabotage research."], 1,
         "The experiment tests a local mechanism. Transfer to catastrophic risk depends on capabilities, access, deployment, and other safeguards."),
        ("proposal", "Your project and ideas form", "Read the proposal, compare alternatives, and copy each answer.", "form",
         [(BRIEFS, "## 3. Can investigators distinguish unresolved causes from actionable defects"), (BRIEFS, "## Choosing among the candidates")],
         "Which result would weaken the proposed research contribution?",
         ["The simple checklist matches the more complex method.", "An investigator sounds confident.", "The report has a longer explanation."], 0,
         "A strong baseline matching the proposed method would weaken the claim that the extra structure helps. That is still an informative result."),
    ]
    pages = []
    for index, (slug, title, summary, lab, sources, prompt, options, answer, explanation) in enumerate(specs):
        parts = [markdown(section(path, heading), path) for path, heading in sources]
        content = "\n".join(parts)
        pages.append({"id": slug, "number": index + 1, "title": title, "summary": summary,
                      "html": content, "text": re.sub(r"<[^>]*>", " ", content), "lab": lab,
                      "sources": sorted(set(os.path.relpath(ROOT / path, ROOT / "explainer") for path, _ in sources)),
                      "quiz": {"prompt": prompt, "options": options, "answer": answer, "explanation": explanation}})
    data = {"updated": "2026-10-28", "pages": pages, "references": REFS,
            "ideas": json.loads((ROOT / BANK / "ideas.json").read_text())["ideas"],
            "form": json.loads((ROOT / "projects/2026-11-tara-project/form-answers.json").read_text())}
    payload = json.dumps(data, ensure_ascii=False, indent=2).replace("<", "\\u003c").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")
    OUT.write_text("/* Generated by tools/build-study-pages.py. Edit canonical sources. */\nwindow.STUDY_DATA = " + payload + ";\n")
    form = data["form"]
    lines = ["---", 'title: "TARA ideas form answers"', "status: draft", "updated: 2026-10-28",
             'depends_on: ["projects/2026-11-tara-project/form-answers.json", "DECISIONS.md"]', "---", "",
             "# TARA ideas form answers", "", "Generated from `form-answers.json`. Edit that file and regenerate.", "",
             "Draft status: " + form["status"] + ". The owner will submit the form manually.", "",
             "## Personal fields", "", f"Name: {form['person']['name']}", "", f"Email: {form['person']['email']}", "",
             "Slack handle, city, group members, and collaborator preference: fill these in the actual form.", "",
             "All three ideas are provided for the owner to choose and submit once.", "",
             "Feasibility scores below are suggestions for the owner to choose.", ""]
    for index, idea in enumerate(form["ideas"]):
        lines += [f"## Idea {index+1}: {idea['title']}", "",
                  "Role: " + ("recommended first idea" if index == 0 else "recommended second idea" if index == 1 else "optional third idea") + ".", ""]
        for key, label in (("title", "Project title"), ("problem", "PROBLEM"), ("goal", "GOAL"), ("plan", "PROJECT PLAN")):
            lines += [f"**{label}:** {idea[key]}", ""]
        lines += [f"**Suggested feasibility:** {idea['feasibility']}/5.", "", f"**Suggested area:** {idea['area']}.", "",
                  "**Open to collaborators:** pending owner preference.", ""]
    lines += ["## Prior work and scope", "", "The proposal makes no novelty claim. Review the linked candidate briefs before final project selection.", "",
              "[Candidate briefs](../../literature/landscape/brainstorming/candidate-briefs.md).", "",
              "[Interactive reading pages](../../explainer/research.html).", "",
              "The earlier probe proposal is preserved in `topic-submission-2026-10-23.md`.", ""]
    (ROOT / "projects/2026-11-tara-project/TOPIC-SUBMISSION.md").write_text("\n".join(lines))
    print(f"Built {len(pages)} reading pages and {len(form['ideas'])} form drafts.")


if __name__ == "__main__":
    build()
