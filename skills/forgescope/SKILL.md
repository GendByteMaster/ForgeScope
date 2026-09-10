---
name: forgescope
description: Deeply review, audit, optimize, and safely improve a software repository. Use when Codex needs to inspect project architecture, correctness, code quality, security, performance, reliability, tests, APIs, databases, frontend behavior, dependencies, infrastructure, technical debt, production readiness, or repository-wide engineering risks; use for analysis-only reviews, targeted audits, full-project reviews, optimization passes, and review-plus-fix tasks.
---

# ForgeScope

Review software as a senior engineer responsible for the resulting system, not as a stylistic linter.

Prioritize evidence, correctness, safety, and maintainability. Do not refactor working code merely to make it different.

## Core workflow

Follow this sequence unless the user's task clearly requires a narrower path:

1. Understand the repository and the requested scope.
2. Establish current behavior, architecture, conventions, and verification commands.
3. Inspect relevant engineering domains.
4. Separate confirmed findings from hypotheses.
5. Prioritize findings by severity and practical impact.
6. Implement only justified changes when modification is requested.
7. Review the resulting diff for regressions and unrelated changes.
8. Run the strongest applicable verification available.
9. Report findings, changes, evidence, remaining risks, and unexecuted checks.

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

## 3. Review by engineering domain

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

## 4. Distinguish evidence from suspicion

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

## 5. Prioritize before editing

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

## 6. Implement conservatively

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

After editing, inspect the final diff and remove accidental churn.

## 7. Use subagents deliberately

Read `references/subagents.md` when subagents are available and the task is large enough to benefit from parallel investigation.

Delegate bounded investigative scopes, not final ownership.

The primary agent remains responsible for:

- decomposition and priorities;
- resolving contradictory findings;
- deciding which recommendations are valid;
- integrating code changes;
- reviewing the final diff;
- verification;
- the final engineering judgment.

Never merge subagent recommendations blindly.

## 8. Verify proportionally to risk

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

If environment limitations prevent a check, state exactly what could not be verified and why.

## 9. Report the result

Keep the final report proportional to the task. For a substantial review, include:

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
- A smaller correct diff is better than a large impressive diff.
