# Review domains

Use this reference only for domains relevant to the repository or task. Do not invent findings merely because a category exists.

## Architecture

Inspect:

- module and service boundaries;
- separation of concerns;
- dependency direction;
- coupling and cohesion;
- duplicated responsibilities;
- hidden shared state;
- cross-layer leakage;
- unnecessary abstractions;
- overengineering;
- scalability constraints caused by concrete design choices;
- compatibility boundaries and migration assumptions.

Challenge both under-designed and over-designed architecture. Do not recommend microservices, event-driven architecture, queues, caches, or new layers without a concrete operational or product reason.

## Correctness

Look for:

- broken invariants;
- invalid state transitions;
- incorrect edge-case handling;
- partial updates;
- stale state;
- ordering bugs;
- async misuse;
- race conditions;
- deadlocks;
- resource leaks;
- incorrect retries;
- incorrect error propagation;
- unsafe default behavior;
- data truncation, precision, timezone, locale, or encoding mistakes where relevant.

Trace critical paths end to end when local reasoning is insufficient.

## Code quality and maintainability

Check for:

- duplicated domain logic;
- dead or unreachable code;
- accidental complexity;
- misleading naming;
- weak or inconsistent typing;
- unsafe casts;
- hidden side effects;
- unclear ownership or lifecycle;
- excessive global state;
- copy-pasted configuration;
- abstractions with no meaningful boundary;
- large functions only when their size creates concrete comprehension or correctness risk.

Do not equate stylistic preference with maintainability risk.

## Security

Inspect trust boundaries and attacker-controlled inputs first.

Check where applicable:

- authentication;
- authorization and object-level access control;
- privilege escalation paths;
- input validation;
- secret handling;
- sensitive data exposure;
- SQL/NoSQL/command/template injection;
- XSS;
- CSRF;
- SSRF;
- path traversal;
- unsafe file handling;
- insecure deserialization;
- cryptographic misuse;
- token/session lifecycle;
- CORS and origin assumptions;
- rate limiting and abuse controls;
- insecure defaults;
- dependency and supply-chain exposure.

Do not label a theoretical weakness exploitable without a plausible execution path.

## Performance

Find the expensive operation before proposing optimization.

Inspect where relevant:

- algorithmic complexity;
- repeated work;
- redundant serialization/deserialization;
- unnecessary allocations or copies;
- blocking work on async/event-loop paths;
- CPU-heavy hot paths;
- unbounded collections;
- memory retention;
- disk and network I/O;
- chatty service calls;
- N+1 queries;
- missing batching;
- cache misuse or absent caching only when repeated work justifies it;
- frontend rerenders and data waterfalls;
- bundle size and code splitting;
- startup and build bottlenecks.

Prefer measurement, profiles, query plans, timings, or clear operation counts over intuition. Never invent percentage gains.

## Reliability and distributed behavior

Check:

- timeout coverage;
- retries and retry ownership;
- exponential backoff and jitter where appropriate;
- idempotency;
- duplicate delivery handling;
- transaction boundaries;
- consistency assumptions;
- failure recovery;
- partial failure behavior;
- circuit breaking only where justified;
- graceful degradation;
- connection lifecycle;
- shutdown behavior;
- queue acknowledgement semantics;
- poison-message behavior;
- clock assumptions;
- observability of failures;
- health and readiness checks.

For distributed systems, explicitly distinguish local atomicity from cross-service consistency.

## Database and storage

Inspect:

- schema design;
- constraints;
- indexes backed by actual access patterns;
- N+1 and repeated queries;
- transaction isolation assumptions;
- migration safety;
- rollback or compatibility strategy;
- connection pooling;
- lock duration;
- race-prone read-modify-write flows;
- pagination correctness;
- data retention;
- object-storage access control;
- row-level security where used;
- backup/recovery assumptions when the task is operational.

Avoid adding indexes without considering write cost, cardinality, query shape, and existing indexes.

## API and protocol design

Check:

- request and response contracts;
- validation boundaries;
- error schemas;
- status codes;
- authentication and authorization;
- pagination;
- idempotency;
- versioning;
- backward compatibility;
- timeout expectations;
- retry semantics;
- naming consistency;
- streaming lifecycle;
- WebSocket or RPC reconnection behavior;
- schema evolution.

Treat undocumented but externally consumed behavior as a compatibility risk.

## Frontend and client applications

Check where applicable:

- server/client boundaries;
- unnecessary client-side execution;
- data-fetching waterfalls;
- unnecessary rerenders;
- state ownership;
- duplicated state;
- loading/error/empty states;
- cancellation and stale-response handling;
- form validation;
- accessibility;
- keyboard behavior;
- responsive behavior;
- hydration issues;
- bundle growth;
- code splitting;
- lifecycle/resource cleanup;
- platform-specific behavior for desktop/mobile clients.

Respect framework-native patterns unless they create a concrete problem.

## Tests

Inspect:

- critical-path coverage;
- missing regression tests for discovered defects;
- unit/integration/E2E balance;
- flaky timing assumptions;
- brittle mocks;
- tests coupled to implementation details;
- assertions that do not verify meaningful behavior;
- missing failure-path coverage;
- database or network tests that do not reflect production semantics;
- skipped or deselected tests and the reason for them.

Do not remove a failing test until its expectation is proven invalid.

## Dependencies

Check:

- unused packages;
- overlapping libraries;
- abandoned or obsolete packages;
- incompatible versions;
- heavyweight dependencies used for trivial behavior;
- duplicate runtime functionality;
- vulnerable or risky dependency use where evidence is available;
- unnecessary build/runtime coupling.

Do not upgrade unrelated dependencies during a focused fix unless required.

## Build, infrastructure, and operations

Inspect when present:

- Dockerfiles and image layers;
- multi-stage builds;
- image size and build context;
- dev/prod separation;
- environment-variable handling;
- secrets;
- container health checks;
- Docker Compose assumptions;
- network exposure;
- least privilege;
- CI caching;
- reproducible builds;
- deployment ordering;
- migration execution;
- rollback path;
- metrics;
- logs;
- tracing;
- alertability of critical failures.

Do not optimize Docker layers or CI steps if the complexity cost outweighs measurable build/runtime benefit.

## Documentation and developer experience

Check whether documentation matches reality for:

- setup;
- supported versions;
- environment variables;
- local development;
- build/test commands;
- architecture;
- API usage;
- deployment;
- migrations;
- operational procedures.

Prefer correcting misleading documentation over adding verbose documentation nobody needs.
