# Prioritization and safe fixes

Use this reference when a review produces multiple findings, when changes span several files, or when architectural work is being considered.

## Severity model

### Critical

Use only for issues with credible immediate severe impact, such as:

- straightforward compromise of privileged access or sensitive data;
- destructive data corruption with no practical recovery path;
- a critical service path that is predictably unusable in production;
- a defect capable of causing catastrophic financial, safety, or integrity impact in the system's actual context.

Critical should be rare.

### High

Use for serious production risks such as:

- broken authentication or authorization boundaries;
- data-loss or corruption paths with realistic triggers;
- critical workflows that fail under normal or likely conditions;
- severe reliability defects;
- concurrency bugs with plausible production execution;
- major security weaknesses with a realistic attack path;
- incompatible migrations or protocol changes likely to break deployed clients.

### Medium

Use for meaningful but non-catastrophic issues such as:

- correctness bugs outside the most critical path;
- recurring performance waste with material cost or latency;
- fragile code that makes likely changes unsafe;
- incomplete failure handling;
- important missing tests;
- operational gaps that slow detection or recovery;
- API inconsistencies with bounded impact.

### Low

Use for bounded improvements such as:

- localized cleanup;
- small consistency problems;
- optional hardening;
- minor developer-experience friction;
- low-impact documentation drift.

Do not inflate severity to make the review look important.

## Decision matrix

Before a substantial change, assess:

- **Impact**: What concrete problem does this fix?
- **Confidence**: Is the diagnosis confirmed or inferred?
- **Regression risk**: How much existing behavior can this disturb?
- **Complexity**: How much implementation and cognitive overhead is added?
- **Verification**: Can the changed behavior be tested strongly?
- **Reversibility**: Can the change be rolled back safely?
- **Benefit horizon**: Does this solve a current problem or only a hypothetical future one?

Prefer changes that are high-impact, high-confidence, testable, and low-risk.

## Fix hierarchy

Prefer, in order:

1. Restore or enforce a broken invariant.
2. Correct unsafe input, authorization, or persistence behavior.
3. Fix failure handling and lifecycle bugs.
4. Remove a demonstrated performance bottleneck.
5. Simplify code when complexity itself is causing defects or change risk.
6. Improve naming or structure only when it materially improves comprehension.

Do not begin with broad cleanup while correctness or security issues remain unresolved.

## Refactoring rules

Refactor when at least one is true:

- duplicated domain logic can diverge and already creates maintenance risk;
- ownership or lifecycle is unclear enough to cause defects;
- a change cannot be implemented safely without clarifying boundaries;
- the current abstraction blocks testing or observability;
- repeated work is causing a measurable performance problem;
- an API boundary is inconsistent enough to produce bugs.

Avoid refactoring when the argument is only:

- the code is old;
- another pattern is more fashionable;
- a function is long but coherent;
- a module has many files;
- microservices or events might scale better someday;
- a new library would make the code shorter;
- the rewrite looks cleaner without reducing risk.

## Architecture changes

For architectural changes, explicitly state:

- current constraint or failure;
- proposed boundary or mechanism;
- migration path;
- compatibility impact;
- operational cost;
- new failure modes;
- verification strategy;
- rollback strategy when relevant.

A new queue, cache, service, database, framework, state manager, abstraction layer, or protocol is not automatically an improvement.

## Performance changes

Require one of:

- benchmark data;
- profiling evidence;
- query plan evidence;
- request traces;
- operation counts;
- a logically obvious repeated or asymptotically expensive path.

State expected direction of improvement when exact measurements are unavailable, but never invent numbers.

After optimization, verify behavior first and performance second. A faster incorrect system is a regression.

## Dependency changes

Before adding a dependency, ask:

- Is equivalent functionality already present?
- Can the standard library or framework do it safely?
- Is the dependency maintained and appropriately scoped?
- What runtime, security, bundle, image, or build cost does it add?
- Is the dependency worth the long-term upgrade surface?

Avoid unrelated upgrades in the same change unless required for compatibility or security.

## Safe implementation loop

For each meaningful fix:

1. Identify the invariant or expected behavior.
2. Reproduce or trace the failure when feasible.
3. Choose the smallest robust correction.
4. Add or update a regression test when practical.
5. Run focused verification.
6. Inspect adjacent behavior for regressions.
7. Run broader project checks before finalizing when feasible.

## Stop conditions

Do not continue expanding the diff when:

- the requested problem is solved;
- remaining findings are speculative;
- further changes require product or architecture decisions not present in the task;
- verification becomes weaker than the risk introduced by the next change;
- the next improvement belongs in a separate PR or migration.

Record deferred work instead of silently broadening scope.
