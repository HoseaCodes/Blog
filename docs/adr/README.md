# Architecture decision records

Six decisions where a competent engineer could reasonably have chosen otherwise. Each one states its downsides — an ADR that lists none is marketing.

| # | Decision | Status |
|---|---|---|
| [001](ADR-001-delegated-auth.md) | Delegate authentication to Storm-Gate | Accepted |
| [002](ADR-002-mongodb.md) | MongoDB with Mongoose | Accepted |
| [003](ADR-003-app-server-split.md) | `app.js` builds, `server.js` boots | Accepted |
| [004](ADR-004-testcontainers.md) | Testcontainers over an in-memory MongoDB | Accepted |
| [005](ADR-005-single-deployable.md) | One deployable serves the API and the SPA | Accepted |
| [006](ADR-006-write-time-sanitisation.md) | Sanitise markdown at write time | Accepted |

## Format

Context → Decision → Consequences → What would change the answer.

The last section matters most. A decision recorded without its expiry conditions becomes folklore: everyone knows the rule, nobody remembers whether it still applies.

## Adding one

Write an ADR when a choice is (a) hard to reverse, (b) likely to be questioned later, or (c) surprising to a reader of the code. Routine choices do not need one. Number sequentially, never renumber, and supersede rather than edit — a decision that was later reversed is more instructive than one that was quietly rewritten.
