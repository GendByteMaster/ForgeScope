# ForgeScope

ForgeScope is a reusable engineering review skill for Codex and other tools that support the Agent Skills format.

It is designed for repository-wide engineering work where a normal code review is too narrow: architecture, correctness, security, performance, reliability, tests, dependencies, infrastructure, APIs, databases, frontend behavior, documentation, and safe optimization.

## Philosophy

ForgeScope follows a conservative engineering loop:

**Understand → Inspect → Prioritize → Fix → Verify**

For substantial work it can also maintain a persistent Markdown review workspace so an audit can be resumed without losing validated context.

It does not refactor code merely to produce a larger diff. Confirmed correctness, security, reliability, and data-integrity problems come before style cleanup or speculative optimization.

## Structure

```text
skills/forgescope/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── review-domains.md
    ├── prioritization-and-fixes.md
    ├── verification.md
    ├── subagents.md
    └── workspace.md
```

`SKILL.md` contains the core workflow. Detailed guidance lives in `references/` so it is loaded only when relevant.

## Persistent review workspace

For full reviews, review + fix tasks, optimization passes, release-readiness work, and other substantial multi-step tasks, ForgeScope can create and maintain:

```text
.forgescope/
└── REVIEW.md
```

The workspace acts as a resumable engineering ledger. It can track:

- review scope and objectives;
- repository map and baseline;
- confirmed findings and hypotheses;
- stable finding IDs and severity;
- execution plan and progress;
- engineering decisions;
- changes made;
- verification commands and results;
- remaining risks and deferred work.

If `.forgescope/REVIEW.md` already exists, ForgeScope reads it first, reconciles it against the current branch and repository state, rejects stale assumptions, and continues valid unresolved work instead of starting from zero.

The workspace is not treated as source-of-truth evidence. Current code, configuration, tests, and runtime behavior always win.

ForgeScope does not create or modify the workspace in analysis-only mode, when the user requests no file changes, or when the task is too small to benefit from persistent state.

The generated `.forgescope/REVIEW.md` belongs to the target project, not to the ForgeScope skill repository. Whether it should be committed is a project decision: keep it local when it is temporary working state, or commit it when the team wants a durable review/audit trail.

## Install

### npx (recommended for a quick install)

ForgeScope can be installed with the community `skills` CLI.

Install globally for Codex:

```bash
npx skills add GendByteMaster/ForgeScope --skill forgescope -a codex -g -y
```

Install only for the current project:

```bash
npx skills add GendByteMaster/ForgeScope --skill forgescope -a codex -y
```

Preview the skills detected in the repository without installing:

```bash
npx skills add GendByteMaster/ForgeScope --list
```

The `skills` CLI supports Agent-Skills-compatible repositories and Codex. It is a community installer, not the built-in OpenAI Codex skill installer.

### Built-in Codex skill installer

Inside Codex you can ask the built-in `$skill-installer` to install ForgeScope from:

```text
https://github.com/GendByteMaster/ForgeScope/tree/master/skills/forgescope
```

Or use the OpenAI installer script directly:

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo GendByteMaster/ForgeScope \
  --path skills/forgescope
```

You can also copy `skills/forgescope` into your Codex skills directory manually.

## Usage

Examples:

```text
Use ForgeScope to review this repository and fix confirmed high-impact issues.
```

```text
Run a full ForgeScope review. Maintain .forgescope/REVIEW.md so the work can be resumed later. You may use up to 6 subagents when useful. Preserve public behavior and verify the final diff.
```

```text
Continue the existing ForgeScope review from .forgescope/REVIEW.md. Revalidate previous findings against the current branch before making changes.
```

```text
Use ForgeScope in analysis-only mode. Do not modify files; return prioritized findings and a remediation plan.
```

The user's explicit task always overrides the defaults in the skill.

## Scope modes

ForgeScope adapts to the request:

- **Analysis only** — inspect and report without code changes.
- **Targeted review** — focus on a subsystem, risk area, or changed code.
- **Full review** — inspect the repository broadly and prioritize findings.
- **Review + optimization** — implement justified improvements and verify them.
- **Release readiness** — emphasize correctness, security, reliability, tests, deployment, and operational risk.

## Design goals

- Evidence over assumptions.
- Small, justified diffs over broad rewrites.
- Persistent but revalidated review state for substantial tasks.
- No weakened tests or suppressed errors just to make CI green.
- No invented benchmark gains.
- No unnecessary architecture migrations.
- Explicit reporting of checks that could not be run.

## Compatibility

ForgeScope follows the Agent Skills structure used by OpenAI Skills: a required `SKILL.md`, optional `agents/openai.yaml`, and directly linked reference resources.
