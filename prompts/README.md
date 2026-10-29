# prompts/

How to start a research session in any tool so that it loads the same context an agent in
this repository would load.

## Tools that read the filesystem (Claude Code, Codex, Cursor, DeepSeek Harness with a repo)

Open the repository root. The tool reads `AGENTS.md` (or `CLAUDE.md`, which points to it).
Say what you want to do. The routing table in `AGENTS.md` section 4 tells the agent what to
load.

## Tools that do not (ChatGPT web, DeepSeek web, any chat UI)

1. Build a bundle for the task:
   ```
   python3 tools/pack.py sprint -o /tmp/bundle-sprint.md
   python3 tools/pack.py --list        # task names
   ```
2. Attach or paste the bundle as the first message.
3. Paste `prompts/bootstrap.md` as the second message, with the task line filled in.
4. At the end of the session, ask the tool for a `STATUS.md` entry in the format of
   `templates/session-log.md`, and paste it into `STATUS.md` yourself.

The bundle header already tells the model which rules apply. The ChatGPT project
instructions you already use (tutor, Simplified Technical English, six-step teaching order,
modes) are compatible; `prompts/modes.md` restates the modes so any tool can use them.

## Where results go

Anything the tool produces that should persist goes into the owning file in this
repository, by you. The repository is the shared state; the tools are interchangeable.

For a portable prospecting, competitor-intelligence, or knowledge-map assignment,
see [the overnight DeepSeek research brief](deepseek-overnight-research.md).
Copy it to the repository that owns the work and fill in the parameters before starting.
