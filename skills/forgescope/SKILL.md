---
name: forgescope
description: Deeply review, audit, optimize, and safely improve a software repository. Use when Codex needs to inspect project architecture, correctness, code quality, security, performance, reliability, tests, APIs, databases, frontend behavior, dependencies, infrastructure, technical debt, production readiness, or repository-wide engineering risks; use for analysis-only reviews, targeted audits, full-project reviews, optimization passes, review-plus-fix tasks, and resumable multi-step engineering reviews.
---

# ForgeScope

Review software as a senior engineer responsible for the resulting system, not as a stylistic linter.

Prioritize evidence, correctness, safety, and maintainability. Do not refactor working code merely to make it different.

## Core workflow

Follow this sequence unless the user's task clearly requires a narrower path:

1. Understand the repository and requested scope.
2. Establish current behavior, architecture, conventions, and verification commands.
3. Create or resume the ForgeScope Markdown workspace when appropriate.
4. Inspect relevant engineering domains.
5. Separate confirmed findings from hypotheses.
6. Prioritize findings by severity and practical impact.
7. Implement only justified changes when modification is requested.
8. Update the workspace as meaningful state changes occur.
9. Review the resulting diff for regressions and unrelated changes.
10. Run the strongest applicable verification available.
11. Reconcile the workspace with the final repository state.
12. Report findings, changes, evidence, remaining risks, and unexecuted checks.

The user's explicit instructions override this workflow.

## 1. Understand before changing

Inspect enough repository context to understand intent before proposing structural changes.

At minimum, when available:

- inspect the repository tree and major modules;
- read `README`, `AGENTS.md`, contribution guidance, architecture docs, and relevant ADRs;
- identify languages, frameworks, runtime versions, package managers, build systems, and deployment model;
- inspect formatter, linter, type-checker, test, CI, container, and environment configuration;
- identify public APIs, persistence boundaries, authentication boundaries, background workers, queues, caches, external integrations, and critical data flows;
- inspect surrounding code before changing a local implementation so existing conventions are preserved intentionally rather than accidentally.

Do not infer architectural intent when it can be discovered from the repository.

If the repository is large, map the system first and then inspect high-risk or user-relevant areas instead of reading files indiscriminately.

## 2. Select review depth

Infer the narrowest mode that satisfies the request:

- **Analysis only**: inspect and report. Do not modify files.
- **Targeted review**: inspect a component, subsystem, risk domain, issue, or changed area.
- **Full review**: inspect the repository broadly enough to identify cross-cutting risks.
- **Review + fix**: inspect, prioritize, implement justified improvements, and verify.
- **Optimization pass**: require a credible bottleneck, cost, complexity, or maintenance reason before optimizing.
- **Release readiness**: emphasize correctness, security, reliability, migrations, configuration, observability, deployment, rollback, and critical-path tests.

Do not silently expand a narrow request into a repository rewrite.

## 3. Maintain a review workspace

Read `references/workspace.md` for substantial, multi-step, or resumable reviews.

When file modifications are allowed and persistent tracking would materially help, create or reuse:

` .forgescope/REVIEW.md `

Use it as the active review ledger for:

- scope and objectives;
- repository map and baseline;
- confirmed findings and hypotheses;
- severity and stable finding IDs;
- execution plan and status;
- engineering decisions and rejected alternatives;
- changes made;
- verification results;
- remaining risks and deferred work.

If the file already exists, read it before continuing. Reconcile recorded state against the current branch, code, configuration, and tests. Do not trust stale findings blindly.

Update the workspace only when meaningful state changes occur. Keep it concise and resumable.

Do not create or modify the workspace in analysis-only mode, when the user requested no file changes, or when the task is too small to benefit from persistent state.

Never write secrets, credentials, production customer data, or other sensitive values into the workspace.

## 4. Review by engineering domain

Read `references/review-domains.md` when the task requires a broad review or when one of those domains is materially relevant.

Focus first on risks that can affect:

1. correctness;
2. security;
3. data integrity;
4. reliability;
5. user-visible behavior;
6. performance or resource cost;
7. maintainability;
8. cosmetic consistency.

Do not manufacture findings to fill every category. A clean domain may simply have no material issue.

## 5. Distinguish evidence from suspicion

For every material finding, establish at least one credible basis such as:

- a concrete code path;
- an invalid state transition;
- a failing or missing invariant;
- an unsafe trust boundary;
- an observable N+1 or repeated operation;
- inconsistent API or persistence behavior;
- a failing test, build, lint, type, or runtime check;
- a configuration mismatch;
- a documented contract violated by implementation;
- a reproduction or logically complete execution path.

Label uncertain concerns as hypotheses and state what would confirm them.

Do not present speculative performance, security, or concurrency concerns as confirmed defects.

Record material findings in the workspace when one is active. Keep stable finding IDs as their severity or status changes.

## 6. Prioritize before editing

Read `references/prioritization-and-fixes.md` before broad refactors, multi-file changes, architectural changes, or when many findings compete for attention.

Classify confirmed findings as:

- **Critical** — immediate compromise, corruption, catastrophic outage, or equivalent severe failure.
- **High** — likely serious production failure, security weakness, broken critical path, or major reliability risk.
- **Medium** — meaningful defect, performance problem, maintainability hazard, or non-critical operational risk.
- **Low** — limited-impact cleanup, consistency issue, or optional hardening.

For substantial changes, weigh:

- impact;
- confidence;
- regression risk;
- implementation complexity;
- verification strength;
- long-term benefit.

Prefer high-confidence, high-impact, low-regression-risk work.

When a workspace is active, keep the execution plan ordered by current priority rather than by discovery order.

## 7. Implement conservatively

When the user asks for fixes or optimization:

- preserve public behavior unless a behavior change is explicitly required or a bug is being corrected;
- keep diffs focused;
- follow existing project conventions unless those conventions are themselves the problem;
- preserve backward compatibility where practical;
- add or update tests for behavior that changed;
- prefer existing dependencies and standard-library capabilities over unnecessary new packages;
- avoid architecture migrations without a concrete problem and migration justification;
- avoid speculative caching, concurrency, batching, memoization, or abstraction;
- do not suppress diagnostics, weaken types, remove assertions, disable checks, or relax tests merely to obtain a green result;
- do not hide existing failures by changing unrelated code.

Move workspace items through explicit states such as `CONFIRMED`, `PLANNED`, `IN_PROGRESS`, `FIXED`, and `VERIFIED`. A fix is not verified merely because code was edited.

After editing, inspect the final diff and remove accidental churn.

## 8. Use subagents deliberately

Read `references/subagents.md` when subagents are available and the task is large enough to benefit from parallel investigation.

Delegate bounded investigative scopes, not final ownership.

The primary agent remains responsible for:

- decomposition and priorities;
- resolving contradictory findings;
- deciding which recommendations are valid;
- integrating code changes;
- maintaining coherent workspace state;
- reviewing the final diff;
- verification;
- the final engineering judgment.

Subagents may return evidence or proposed workspace updates, but the primary agent must validate them before recording findings as confirmed.

Never merge subagent recommendations blindly.

## 9. Verify proportionally to risk

Read `references/verification.md` before finalizing code changes or a release-readiness review.

Prefer repository-defined commands over invented commands.

Run applicable checks such as:

- formatter;
- linter;
- type checker;
- unit tests;
- integration tests;
- end-to-end tests;
- build;
- package or workspace checks;
- migration validation;
- security tooling already configured by the repository;
- targeted reproductions for fixed bugs.

Start with focused checks when iteration speed matters, then run broader checks before finalizing when feasible.

Never claim a command passed unless it was actually executed successfully.

If a workspace is active, record commands and results accurately. Do not convert `FIXED` to `VERIFIED` until the required check has actually succeeded.

If environment limitations prevent a check, state exactly what could not be verified and why and record the item as blocked or not run.

## 10. Reconcile and report

Before final reporting, reconcile any active `.forgescope/REVIEW.md` with:

- the final diff;
- current repository state;
- actual verification results;
- unresolved findings;
- intentionally deferred work.

Remove or mark disproved hypotheses as rejected. Do not leave stale `TODO` or `FIXED` states that contradict the actual result.

Keep the final user-facing report proportional to the task. For a substantial review, include:

### Findings

List confirmed findings in severity order. Explain impact and evidence. Keep hypotheses separate.

### Changes

Describe concrete modifications and the important modules or files affected.

### Optimizations

Explain justified performance, reliability, architecture, or maintainability improvements. Do not invent benchmark numbers.

### Verification

List checks actually executed and their results.

### Remaining Risks

State unresolved risks, blocked verification, or intentionally deferred problems.

### Further Improvements

List useful follow-up work only when it should not be mixed into the current change because it requires a separate decision, benchmark, migration, dependency, or higher-risk refactor.

For analysis-only requests, replace `Changes` with a remediation plan.

## Engineering rules

- Prefer evidence over assumptions.
- Prefer simple designs over unnecessary abstraction.
- Prefer measured optimization over speculative optimization.
- Prefer small safe changes over broad rewrites.
- Treat existing code and proposed code with equal skepticism.
- Preserve working behavior unless there is a clear reason to change it.
- Do not optimize solely for smaller code or fewer files.
- Do not treat every TODO, dependency, long function, or abstraction as a defect.
- Treat the workspace as resumable state, not as source-of-truth evidence.
- A smaller correct diff is better than a large impressive diff.
