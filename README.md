# ForgeScope

ForgeScope is a reusable engineering review skill for Codex and other tools that support the Agent Skills format.

It is designed for repository-wide engineering work where a normal code review is too narrow: architecture, correctness, security, performance, reliability, tests, dependencies, infrastructure, APIs, databases, frontend behavior, documentation, and safe optimization.

## Philosophy

ForgeScope follows a conservative engineering loop:

**Understand → Inspect → Prioritize → Fix → Verify**

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
    └── subagents.md
```

`SKILL.md` contains the core workflow. Detailed checklists live in `references/` so they are loaded only when relevant.

## Install with Codex

Using the OpenAI skill installer:

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo GendByteMaster/ForgeScope \
  --path skills/forgescope
```

Or copy `skills/forgescope` into your Codex skills directory.

## Usage

Examples:

```text
Use ForgeScope to review this repository and fix confirmed high-impact issues.
```

```text
Run a full ForgeScope review. You may use up to 6 subagents when useful. Preserve public behavior and verify the final diff.
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
- No weakened tests or suppressed errors just to make CI green.
- No invented benchmark gains.
- No unnecessary architecture migrations.
- Explicit reporting of checks that could not be run.

## Compatibility

ForgeScope follows the Agent Skills structure used by OpenAI Skills: a required `SKILL.md`, optional `agents/openai.yaml`, and directly linked reference resources.
