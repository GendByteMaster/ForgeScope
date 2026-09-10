# Verification

Use this reference before finalizing code changes, production-readiness reviews, or claims that a defect has been fixed.

## Principles

- Prefer repository-defined commands over guessed commands.
- Verify the behavior that changed, then verify surrounding project health.
- Match verification depth to regression risk.
- Never claim a check passed unless it actually ran and succeeded.
- Distinguish pre-existing failures from regressions introduced by the current change.
- Do not alter tests, linters, compiler flags, or type settings merely to silence failures.

## Discover project checks

Inspect relevant configuration before running commands:

- `package.json` scripts;
- workspace manifests;
- `pyproject.toml`, `tox.ini`, `noxfile.py`;
- `Cargo.toml` and workspace configuration;
- Flutter/Dart configuration;
- Makefiles, Taskfiles, Justfiles;
- Dockerfiles and Compose files;
- CI workflow definitions;
- repository documentation and `AGENTS.md`.

Use the project's own entry points when available.

## Verification ladder

Use the strongest feasible sequence appropriate to the change.

### 1. Static sanity

Check:

- syntax/parsing;
- formatting;
- generated-file consistency where applicable;
- obvious unresolved imports or references.

### 2. Focused validation

Run the smallest relevant tests or checks for the changed behavior.

Examples:

- a unit test for the modified module;
- a targeted integration test;
- a regression test reproducing the fixed bug;
- a focused type check or build target;
- a specific migration dry run.

Focused checks accelerate iteration but do not replace broader verification for high-risk changes.

### 3. Static project checks

When configured, run:

- formatter checks;
- linter;
- type checker;
- compiler checks;
- dependency or schema validation.

### 4. Test suites

Run applicable layers:

- unit;
- integration;
- contract;
- end-to-end;
- release or smoke tests.

For large suites, use focused tests during iteration and the broadest practical suite before finalizing.

### 5. Build and packaging

Verify applicable artifacts:

- production frontend build;
- backend/package compilation;
- Rust workspace build/check;
- Flutter build/analyze path;
- Docker image build;
- package creation;
- generated client/server artifacts.

### 6. Runtime and operational checks

When the change affects runtime behavior, consider:

- service startup;
- health/readiness endpoints;
- database connectivity;
- migration behavior;
- queue/worker startup;
- graceful shutdown;
- retry behavior;
- logging/metrics/tracing;
- external integration failure paths.

Do not call a system production-ready solely because compilation succeeds.

## Domain-specific examples

These are examples only. Prefer repository-defined equivalents.

### Rust

Potential checks:

```text
cargo fmt --check
cargo clippy --workspace --all-targets --all-features
cargo test --workspace --all-features
cargo build --workspace --release
```

Do not enable `--all-features` if the project intentionally has mutually exclusive features.

### Python

Potential checks:

```text
ruff check .
ruff format --check .
mypy .
pytest
```

Use the configured environment/package manager rather than assuming global tools.

### TypeScript / Next.js

Potential checks:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Use `pnpm`, `yarn`, `bun`, or another package manager when the repository specifies it.

### Flutter / Dart

Potential checks:

```text
dart format --output=none --set-exit-if-changed .
flutter analyze
flutter test
```

Build platform targets only when the required SDK/toolchain is available.

### Docker

Potential checks:

- validate Compose configuration;
- build affected images;
- verify health checks and startup dependencies;
- inspect final image stage and runtime user;
- smoke-test services when feasible.

## Database and migration verification

For persistence changes, check when applicable:

- forward migration;
- compatibility with currently deployed application versions;
- transaction safety;
- backfill strategy;
- rollback or roll-forward strategy;
- constraints and indexes;
- representative query behavior;
- handling of existing rows, not only new rows.

A migration that works on an empty database is not sufficient evidence for production safety.

## Security verification

When fixing a security issue:

- test the denied path as well as the allowed path;
- verify authorization at the actual trust boundary;
- confirm attacker-controlled values cannot bypass validation;
- check logs and errors for secret leakage;
- ensure the fix does not rely only on client-side enforcement.

## Performance verification

When performance is part of the claim:

- use the same workload before and after when feasible;
- record relevant environment assumptions;
- compare latency, throughput, allocations, query count, memory, bundle size, or another metric tied to the problem;
- avoid extrapolating from tiny synthetic examples unless clearly labeled.

If benchmarking cannot be performed, report the optimization as structurally justified rather than numerically proven.

## Failure accounting

For each failed command, determine whether it is:

- caused by the current change;
- pre-existing;
- caused by environment/tooling limitations;
- flaky or nondeterministic;
- blocked by unavailable external services, credentials, Docker, platform SDKs, or network access.

Do not silently omit failures.

## Final diff review

Before finalizing:

- inspect changed files;
- remove accidental formatting churn;
- remove debug code and temporary files;
- verify no secrets were added;
- verify generated files are consistent if required;
- confirm the diff matches the requested scope;
- ensure tests were not weakened merely to pass.

## Reporting template

Report verification using concrete statements, for example:

```text
Verification
- `cargo fmt --check` — passed
- `cargo test -p api` — 42 passed
- full workspace tests — not run: Docker daemon unavailable
```

Do not write "all tests pass" when only a focused subset ran.
