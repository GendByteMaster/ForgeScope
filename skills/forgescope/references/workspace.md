# ForgeScope review workspace

ForgeScope may maintain a repository-local Markdown workspace at `.forgescope/REVIEW.md` for substantial reviews.

The workspace is an execution aid and audit trail, not an authority over the repository. Always reconcile it with the current code, configuration, branch, and verification results before trusting previous state.

## When to create it

Create or reuse `.forgescope/REVIEW.md` when all of the following are true:

- the task is a full review, review + fix, optimization pass, release-readiness review, or another multi-step engineering task;
- file modifications are allowed by the user's request;
- persistent progress tracking would materially help the work.

Do not create it for trivial or narrowly scoped reviews unless it is useful.

Do not create or update repository files in analysis-only mode or when the user explicitly requested no modifications.

If the user specifies another path or filename, use that instead.

## Lifecycle

### 1. Discover

Before creating a workspace, check whether `.forgescope/REVIEW.md` already exists.

If it exists:

1. read it;
2. inspect the current branch and repository state;
3. determine whether the recorded scope and findings are still applicable;
4. mark stale or invalidated items explicitly;
5. continue from valid unresolved work instead of duplicating it.

Never assume an old finding is still valid merely because it is recorded in the workspace.

### 2. Initialize

If no workspace exists and one is useful, create `.forgescope/REVIEW.md` using the template below.

Record facts, not guesses. Use `Unknown` or `Not checked` when information has not yet been established.

### 3. Work from the file

Use the workspace as the active review ledger during the task.

Update it when meaningful state changes occur, for example when:

- repository scope has been mapped;
- a finding becomes confirmed or is disproved;
- severity changes;
- a fix is selected, deferred, or rejected;
- code has been modified;
- a verification command passes or fails;
- an environmental blocker appears;
- remaining risk changes.

Do not rewrite the whole file after every minor action. Keep updates meaningful and reviewable.

### 4. Finalize

Before final reporting:

- reconcile the workspace with the final diff;
- remove or clearly mark disproved hypotheses;
- ensure completed items are actually completed;
- record verification that was truly executed;
- record blocked or skipped checks explicitly;
- leave unresolved findings with a clear next action where possible.

The final user-facing report should be derived from the current repository state plus verified workspace information, not copied mechanically from the workspace.

## Status model

Use these statuses consistently:

- `TODO` — identified but not yet investigated or acted on.
- `INVESTIGATING` — currently being validated.
- `CONFIRMED` — supported by concrete evidence.
- `PLANNED` — approved for implementation in the current task.
- `IN_PROGRESS` — implementation has started.
- `FIXED` — implementation is complete but may still require broader verification.
- `VERIFIED` — fix or condition has passed the required verification.
- `DEFERRED` — valid work intentionally left for later with a reason.
- `REJECTED` — proposed finding or change was investigated and found invalid or unjustified.
- `BLOCKED` — cannot progress because of a concrete dependency or environment limitation.

Do not use `FIXED` as a substitute for `VERIFIED`.

## Finding identity

Give material findings stable IDs such as:

- `FS-COR-001` for correctness;
- `FS-SEC-001` for security;
- `FS-PERF-001` for performance;
- `FS-REL-001` for reliability;
- `FS-ARCH-001` for architecture;
- `FS-TEST-001` for testing;
- `FS-INFRA-001` for infrastructure;
- `FS-MAINT-001` for maintainability.

Keep an existing ID when a finding evolves. Do not create a new ID merely because its severity or status changed.

## Workspace template

```markdown
# ForgeScope Review

## Session

- Repository: `<owner/repo or local project>`
- Branch / revision: `<branch or commit>`
- Mode: `<full-review | targeted | review-fix | optimization | release-readiness>`
- Scope: `<what is included>`
- Exclusions: `<what is intentionally out of scope>`
- Started: `<timestamp if useful>`
- Last updated: `<timestamp if useful>`

## Objectives

- [ ] `<objective>`

## Repository map

### Stack

- Languages: `Unknown`
- Frameworks: `Unknown`
- Runtime/toolchain: `Unknown`
- Package/build system: `Unknown`

### Important boundaries

- Public APIs: `Not checked`
- Persistence: `Not checked`
- Auth/security boundaries: `Not checked`
- Background processing: `Not checked`
- External integrations: `Not checked`
- Deployment/runtime: `Not checked`

## Baseline

| Check | Command / evidence | Result |
| --- | --- | --- |
| Build | `Not run` | `Unknown` |
| Tests | `Not run` | `Unknown` |
| Lint | `Not run` | `Unknown` |
| Type check | `Not run` | `Unknown` |

## Findings

| ID | Severity | Domain | Status | Evidence | Action |
| --- | --- | --- | --- | --- | --- |
| `FS-...` | `High` | `correctness` | `CONFIRMED` | `<file/path or reproduction>` | `<fix / defer>` |

## Hypotheses to validate

- [ ] `<hypothesis and what would confirm or disprove it>`

## Execution plan

- [ ] `<highest-value safe action>`
- [ ] `<next action>`

## Decisions

### `<decision>`

- Decision: `<what was chosen>`
- Reason: `<evidence and trade-off>`
- Alternatives rejected: `<if relevant>`

## Changes made

- `<file/module>` — `<what changed and why>`

## Verification

| Check | Command | Result | Notes |
| --- | --- | --- | --- |
| Targeted tests | `<command>` | `<pass/fail/not run>` | `<details>` |

## Remaining risks

- `<risk, severity, and next action>`

## Deferred work

- `<item>` — `<reason for deferral>`
```

## Safety rules

- Never put secrets, tokens, credentials, private keys, production customer data, or other sensitive values in the workspace.
- Do not record speculative vulnerabilities as confirmed findings.
- Do not use the workspace to justify a change that the code or tests do not support.
- Do not mark checks as passed unless they actually ran successfully.
- Do not let a stale workspace override current repository evidence.
- Keep the workspace concise enough that another engineer or agent can resume from it quickly.
