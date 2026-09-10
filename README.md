# ForgeScope

ForgeScope is a reusable engineering review and optimization skill for Codex and other Agent-Skills-compatible tools, with a portable CLI.

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

## Quick start

ForgeScope follows the same GitHub-first CLI model as ForgeGuard.

Run ForgeScope directly from GitHub with `npx`:

```bash
npx --yes github:GendByteMaster/ForgeScope install
```

Install for Codex at user level:

```bash
npx --yes github:GendByteMaster/ForgeScope install --client codex --global
```

Check installation:

```bash
npx --yes github:GendByteMaster/ForgeScope status --client codex --global
```

Initialize a review workspace in the current repository:

```bash
npx --yes github:GendByteMaster/ForgeScope init
```

Upgrade or replace an existing ForgeScope installation:

```bash
npx --yes github:GendByteMaster/ForgeScope install --client codex --global --force
```

Uninstall:

```bash
npx --yes github:GendByteMaster/ForgeScope uninstall --client codex --global
```

These commands run directly from GitHub and do not require the package to exist in the npm Registry.

## Pinning a release

For reproducible installation, pin the GitHub release tag:

```bash
npx --yes github:GendByteMaster/ForgeScope#v0.1.0 install --client codex --global
```

This runs the exact ForgeScope `v0.1.0` source instead of the latest default branch.

## `npx` vs a permanent `forgescope` command

`npx --yes github:GendByteMaster/ForgeScope ...` is a one-shot invocation. It runs ForgeScope for that command but does not permanently install the `forgescope` command in your shell.

If you want to type `forgescope` directly, install the CLI globally from GitHub:

```bash
npm install --global github:GendByteMaster/ForgeScope
forgescope --version
```

On Windows, reopen the terminal if the npm global `bin` directory was added to `PATH` after the current shell started.

### Important: two meanings of global

These are separate concepts:

```text
npm install --global ...  -> installs the ForgeScope CLI as a shell command
forgescope ... --global   -> targets user-level Agent Skill directories
```

ForgeScope's `--global` flag does not install the CLI itself.

## Supported clients

ForgeScope supports:

- Codex
- Claude Code
- Cursor

Project-level Codex install:

```bash
npx --yes github:GendByteMaster/ForgeScope install --client codex
```

User-level Codex install:

```bash
npx --yes github:GendByteMaster/ForgeScope install --client codex --global
```

Project installs are placed in client-compatible Skill directories. Codex and Cursor share `.agents/skills/forgescope` at project scope, so the CLI deduplicates that target instead of copying it twice.

## Review workspace

Initialize the persistent review workspace in the current repository:

```bash
npx --yes github:GendByteMaster/ForgeScope init
```

This creates:

```text
.forgescope/
└── REVIEW.md
```

ForgeScope uses this file as resumable engineering state for larger reviews. It stores scope, baseline, findings, hypotheses, execution progress, decisions, verification, remaining risks, and deferred work.

Existing workspace content is preserved by default. Reset it only explicitly:

```bash
npx --yes github:GendByteMaster/ForgeScope init --force
```

The workspace is not source-of-truth evidence. ForgeScope must revalidate it against current code, configuration, branch state, tests, and runtime behavior before continuing previous work.

## CLI commands

```text
forgescope install [options]
forgescope status [options]
forgescope uninstall [options]
forgescope init [options]
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

## Alternative installation methods

The community `skills` CLI can also install the Agent Skill directly:

```bash
npx skills add GendByteMaster/ForgeScope --skill forgescope -a codex -g -y
```

Inside Codex, the built-in `$skill-installer` can install ForgeScope from:

```text
https://github.com/GendByteMaster/ForgeScope/tree/master/skills/forgescope
```

ForgeScope can also be published to the npm Registry as `@gendbytemaster/forgescope`, but Registry publication is not required for the GitHub-first `npx` workflow above.

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

ForgeScope uses the same npm publishing workflow as ForgeGuard.

The package version in `package.json` must match the GitHub release tag:

```text
package.json: 0.1.0
GitHub tag:   v0.1.0
```

A published GitHub Release triggers `.github/workflows/publish-npm.yml`, which validates the package and publishes `@gendbytemaster/forgescope` using the repository `NPM_TOKEN` secret.

This npm publication is optional for users who run ForgeScope directly from GitHub with `npx --yes github:GendByteMaster/ForgeScope ...`.

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
