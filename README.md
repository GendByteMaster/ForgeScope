# ForgeScope

ForgeScope is a reusable engineering review and optimization skill for Codex and other Agent-Skills-compatible tools, with a portable npm CLI.

It is designed for repository-wide engineering work where a normal code review is too narrow: architecture, correctness, security, performance, reliability, tests, dependencies, infrastructure, APIs, databases, frontend behavior, documentation, and safe optimization.

## Philosophy

ForgeScope follows a conservative engineering loop:

**Understand → Inspect → Prioritize → Fix → Verify**

For substantial work it can maintain a persistent Markdown review workspace so an audit can be resumed without losing validated context.

It does not refactor code merely to produce a larger diff. Confirmed correctness, security, reliability, and data-integrity problems come before style cleanup or speculative optimization.

## Repository structure

```text
ForgeScope/
├── bin/
│   └── forgescope.js
├── lib/
│   └── cli.js
├── test/
│   └── cli.test.js
├── skills/
│   └── forgescope/
│       ├── SKILL.md
│       ├── agents/
│       │   └── openai.yaml
│       ├── assets/
│       │   └── REVIEW.md
│       └── references/
│           ├── review-domains.md
│           ├── prioritization-and-fixes.md
│           ├── verification.md
│           ├── subagents.md
│           └── workspace.md
└── package.json
```

`SKILL.md` contains the core workflow. Detailed guidance lives in `references/` and the canonical workspace seed lives in `assets/REVIEW.md`.

## CLI

ForgeScope follows the same portable CLI model as ForgeGuard.

Package:

```text
@gendbytemaster/forgescope
```

Binary:

```text
forgescope
```

Requires Node.js 18 or newer.

### Install globally for Codex

```bash
npx @gendbytemaster/forgescope install --client codex --global
```

### Install in the current project

```bash
npx @gendbytemaster/forgescope install --client codex
```

### Install for all supported clients

```bash
npx @gendbytemaster/forgescope install
```

Supported clients:

- Codex
- Claude Code
- Cursor

Project installs are placed in the client-compatible skills directories. Codex and Cursor share `.agents/skills/forgescope` at project scope, so the CLI deduplicates that target instead of copying it twice.

## Review workspace

Initialize the persistent review workspace in the current repository:

```bash
npx @gendbytemaster/forgescope init
```

This creates:

```text
.forgescope/
└── REVIEW.md
```

ForgeScope uses this file as resumable engineering state for larger reviews. It stores scope, baseline, findings, hypotheses, execution progress, decisions, verification, remaining risks, and deferred work.

Existing workspace content is preserved by default. Reset it only explicitly:

```bash
npx @gendbytemaster/forgescope init --force
```

The workspace is not source-of-truth evidence. ForgeScope must revalidate it against current code, configuration, branch state, tests, and runtime behavior before continuing previous work.

## CLI commands

```bash
npx @gendbytemaster/forgescope install [options]
npx @gendbytemaster/forgescope status [options]
npx @gendbytemaster/forgescope uninstall [options]
npx @gendbytemaster/forgescope init [options]
```

Common options:

```text
--client <all|codex|claude|cursor>
--global
--force
--dry-run
-h, --help
-v, --version
```

Examples:

```bash
npx @gendbytemaster/forgescope status --client codex --global
npx @gendbytemaster/forgescope install --client all --dry-run
npx @gendbytemaster/forgescope uninstall --client codex --global
```

`uninstall` removes only directories that are recognized as ForgeScope installations. It does not delete `.forgescope/REVIEW.md`, so review history is preserved.

## Alternative skill installation

The community `skills` CLI can also install the Agent Skill directly:

```bash
npx skills add GendByteMaster/ForgeScope --skill forgescope -a codex -g -y
```

Or install only for the current project:

```bash
npx skills add GendByteMaster/ForgeScope --skill forgescope -a codex -y
```

Inside Codex, the built-in `$skill-installer` can install ForgeScope from:

```text
https://github.com/GendByteMaster/ForgeScope/tree/master/skills/forgescope
```

## Using ForgeScope

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

## Development

Run syntax checks:

```bash
npm run check
```

Run tests:

```bash
npm test
```

Validate the npm artifact:

```bash
npm pack --dry-run
```

CI runs the CLI suite on Node.js 18, 20, and 22 and verifies install, status, workspace initialization, uninstall safety, and npm packaging.

## npm publishing

The package version in `package.json` must match the GitHub release tag.

For example:

```text
package.json: 0.1.0
GitHub tag:   v0.1.0
```

Publishing is triggered by a published GitHub Release and uses the `NPM_TOKEN` repository secret.

## Design goals

- Evidence over assumptions.
- Small, justified diffs over broad rewrites.
- Persistent but revalidated review state for substantial tasks.
- No weakened tests or suppressed errors just to make CI green.
- No invented benchmark gains.
- No unnecessary architecture migrations.
- Safe, idempotent-style installation behavior.
- Never delete unrelated client configuration or review history.

## Compatibility

ForgeScope follows the Agent Skills structure used by OpenAI Skills: a required `SKILL.md`, optional `agents/openai.yaml`, directly linked reference resources, and optional assets.

The CLI intentionally does not manage `AGENTS.md`. Unlike ForgeGuard, ForgeScope is a task-specific review capability rather than an always-on guardrail, so installing it should not alter normal agent behavior.
