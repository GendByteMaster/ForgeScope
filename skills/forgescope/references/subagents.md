# Subagents

Use subagents only when parallel investigation materially improves coverage or speed. Do not delegate merely because subagents are available.

## Good delegation cases

Subagents are useful when:

- the repository contains clearly separable frontend, backend, database, infrastructure, or worker areas;
- security, performance, architecture, and test analysis can proceed independently;
- a monorepo has multiple packages with bounded responsibilities;
- a large diff benefits from independent verification;
- competing architectural explanations need separate investigation;
- the user explicitly allows multiple subagents and the task is large enough to justify them.

## Poor delegation cases

Avoid subagents when:

- the task is small or local;
- all work depends on the same narrow code path;
- coordination overhead exceeds investigation cost;
- the repository is too small to partition meaningfully;
- agents would duplicate the same file reading;
- the primary problem is an implementation task that requires tight sequential reasoning.

## Bounded worker contract

Give each subagent a narrow contract containing:

- objective;
- exact scope or directories;
- questions to answer;
- relevant constraints;
- whether modification is forbidden or allowed;
- expected evidence;
- expected output format.

Example:

```text
Review authentication and authorization only.
Scope: services/identity and gateway auth middleware.
Do not modify files.
Return confirmed findings with severity, evidence, affected paths, and suggested fixes.
Do not review formatting or unrelated architecture.
```

## Suggested partitions

Depending on the repository, useful partitions include:

- architecture and dependency boundaries;
- security and trust boundaries;
- performance and resource usage;
- backend/API correctness;
- frontend/client behavior;
- database and migrations;
- tests and verification gaps;
- Docker/CI/deployment/observability.

Do not create one worker per checklist item. Partition by meaningful ownership or risk domain.

## Primary-agent ownership

The primary agent must:

1. map the repository before delegation;
2. avoid overlapping worker scopes unless independent review is intentional;
3. provide workers enough context to avoid false assumptions;
4. compare findings against source code personally before accepting high-impact claims;
5. resolve contradictory recommendations;
6. decide which findings deserve changes;
7. integrate changes coherently;
8. review the combined diff;
9. run final verification;
10. own the final report.

Subagents advise; they do not transfer accountability.

## Evidence requirements

Ask workers to return concrete evidence such as:

- file paths and relevant symbols;
- execution/data-flow explanation;
- violated invariant or contract;
- reproduction steps when practical;
- test/build output when executed;
- reason a performance or security issue is realistically reachable.

Reject vague findings such as "this might be slow" or "consider improving security" without a credible basis.

## Change ownership

For broad reviews, prefer analysis-only workers and centralized integration by the primary agent. This reduces conflicting edits and makes final verification easier.

Allow workers to modify code only when scopes are strongly isolated and the environment supports safe parallel edits.

Never let multiple workers edit the same files concurrently without an explicit merge strategy.

## Number of subagents

Treat the user's `N` as a maximum, not a target.

Use fewer than `N` when additional workers would duplicate work. A repository that needs three meaningful workstreams should use three agents even if six are allowed.

## Independent verification

For high-risk findings, consider a separate verification worker that receives the claim but not the original worker's reasoning. Ask it to confirm or falsify the issue from source and tests.

Use this sparingly for security, data-integrity, concurrency, or architectural findings where a false positive would cause a large change.

## Synthesis

When workers finish:

- deduplicate findings;
- downgrade unsupported severity claims;
- separate confirmed issues from hypotheses;
- identify cross-domain interactions;
- choose the smallest coherent change set;
- defer unrelated improvements to follow-up work.

Do not copy subagent output directly into the final report without synthesis.
