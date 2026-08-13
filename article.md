*A reusable framework for auditing and improving reliability, based on Chapter 1 of* Designing Data-Intensive Applications *(Kleppmann).*

---

## Why This Document Exists

Most engineers learn reliability the way they learn debugging: one outage at a time. The result is a personal grab-bag of fixes ("always set a timeout," "add a retry," "log more") without a model that says *what to look for in the first place*.

Kleppmann's first chapter gives that model. Three fault classes. A clean definition of reliability. A small set of mitigations per class. It is enough scaffolding to walk into any codebase, ask the right questions, and produce a prioritized list of work.

This document turns that chapter into a repeatable audit you can run on any application: mobile, web, backend, embedded. The output is always the same shape: *what exists, what is missing, what to fix first.*

---

## The Definitions That Make Everything Else Make Sense

Before any audit, agree on vocabulary. Most reliability arguments collapse on themselves because two people are using the same word for different things.

- **Fault**: a single component deviating from its spec. A disk fails. A library throws. A network packet drops.
- **Failure**: the system as a whole stops providing the required service to the user. Sign-in is broken. Checkout returns 500. The watch shows the wrong heart rate.
- **Reliability**: *"continuing to work correctly, even when things go wrong."* Reliability is the discipline of building systems where faults do not become failures.
- **Fault-tolerance**: anticipating specific faults and coping with them. Always scoped: tolerant of *which* faults?
- **Resilience**: used interchangeably with fault-tolerance in this framing.

You cannot eliminate faults. You can only design fault-tolerance mechanisms that prevent faults from cascading into failures. **That distinction is the entire job.**

---

## The Three Fault Classes

Every reliability concern fits into one of these three buckets. When you audit a system, walk it through all three in order.

### 1. Hardware Faults

The physical substrate disagrees with your expectations. Disks die. Power flickers. Network cables get unplugged. VMs evaporate. Hard drives have a mean time to failure of 10 to 50 years; on a 10,000-disk cluster, that is one death per day.

The traditional answer is *redundancy*: RAID, dual PSUs, multi-AZ deployment, backup generators. The newer answer is *software fault-tolerance over hardware redundancy*: assume any single machine can disappear, design the software to keep running.

**On mobile and edge:** "hardware faults" translates to lost connectivity, low storage, OS process kills, bluetooth disconnects, cloud region outages, expired TLS certs.

### 2. Software Errors

Systematic bugs that correlate across nodes. Harder to anticipate, more damaging when they trigger.

The canonical patterns:
- A latent feature in a ubiquitous dependency that turns attacker-controlled input into remote code execution across the entire install base (the 2021 Log4Shell vulnerability in Log4j).
- A latent race condition in a foundational service's DNS automation that cascades through every dependent system in the region (the October 2025 AWS US-EAST-1 outage, where a DynamoDB DNS race condition cascaded across core services such as EC2, Lambda, NLB, ECS/EKS, and dozens of downstream services).  
- A runaway process eating CPU, memory, disk, or bandwidth.
- An upstream dependency that slows, hangs, or returns corrupted responses.
- Cascading failures: one small fault triggers another, which triggers another.
- Dormant assumptions that were true for years and quietly stop being true.

There is no quick fix. The chapter prescribes a portfolio: careful thinking about assumptions, thorough testing, process isolation, crash-and-restart patterns, production monitoring, and *self-checks*: a system that constantly verifies its own invariants and alerts on drift.

### 3. Human Errors

The leading cause of outages in large internet services is operator configuration error, not hardware. Hardware accounts for only 10 to 25%. Humans design, deploy, and operate the system. Humans are unreliable.

The mitigations are not "hire smarter people." They are structural:
- **Design for the right thing.** Make safe actions easy and dangerous actions hard.
- **Decouple practice from production.** Sandboxes with real data, no real users.
- **Test at every level.** Unit, integration, end-to-end, manual smoke.
- **Fast recovery.** Quick rollback, gradual rollout, recompute tools for corrupted data.
- **Telemetry.** Once a system is running in production, "*telemetry is essential for tracking what is happening, and for understanding failures"*
- **Management practices and training.** Beyond code, but real.

Humans will make mistakes. The system's job is to make those mistakes recoverable.

---

## The Audit Method

Run this on any application. Allow about a day for a small app, a week for a complex one.

### Step 1: Map the surfaces

List every place the system meets the outside world. For each surface, name the trust boundary.

A typical mobile app stack has at least:
- Client UI to client local storage
- Client to your backend
- Backend to third-party APIs (auth providers, payment, analytics)
- Backend to its own data stores
- Companion devices (watch, IoT) to phone

You cannot audit what you have not enumerated.

### Step 2: For each surface, ask the three-bucket questions

**Hardware questions.** What happens if the network drops mid-request? If the upstream is slow? If the device is out of storage? If the process is killed mid-write? If the region serving this surface goes dark?

**Software questions.** What happens on malformed input? On an unexpected status code? On a partial response? If the dependency returns 200 but with garbage in the body? What invariants does this code assume and where would they break?

**Human questions.** Can an operator misconfigure this and not know? Can a careless deploy break it for all users at once? Is there a kill switch? Is there a rollback path? Is there a sandbox version? Is anyone alerted when it breaks?

### Step 3: Score what exists, what is missing

For each surface, produce a small table:

| Concern | Evidence (file:line) | Status | Gap |
|---|---|---|---|
| Network timeout on auth | `AuthClient.swift:42` | exists, 15s | none |
| Retry on 5xx | nowhere | missing | one bad packet = sign-in fail |
| Idempotency on writes | nowhere | missing | duplicate charges on retry |

Be ruthless about evidence. "I think we handle that" is not evidence. A file path and a line number is.

### Step 4: Prioritize by blast radius and reversibility

Not all gaps deserve equal attention. Rank by two axes:

- **Blast radius.** How many users does this hit when it fails? One user? All users? Only paying users?
- **Reversibility.** Can the user recover? Can the operator recover? Is data permanently lost?

A high-blast, low-reversibility gap (e.g., a delete endpoint with no idempotency) outranks a low-blast, high-reversibility gap (e.g., a transient UI glitch) every single time.

### Step 5: Produce a top-10 ordered action list

Not 47 items. Ten. Ordered. Concrete. With owners.

A list of 47 reliability gaps is the same as no list. A list of ten, in order, gets done.

---

## The Universal Checklist

These are the questions worth asking of *any* application. Treat this as a starter; extend per domain.

### Networking

- [ ] Every outbound call has an explicit timeout (not the platform default).
- [ ] Transient failures (5xx, connection lost, timeout) are retried with jittered exponential backoff.
- [ ] 4xx responses are never retried.
- [ ] Every write endpoint accepts an idempotency key.
- [ ] Long-running operations can be polled or resumed, not only awaited.
- [ ] There is a circuit breaker (or equivalent) for upstream dependencies that can go bad.
- [ ] DNS, JWKS, and other "fetched once, cached forever" resources have a max-age and a forced-refresh path.

### Persistence

- [ ] Local writes are atomic (temp file + rename, or transactional).
- [ ] Schema changes have a migration path, not a silent re-init.
- [ ] Data corruption is detectable (checksums, schema validation on read).
- [ ] There is a backup story for anything the user cannot reconstruct.
- [ ] Concurrent writes from multiple threads or processes are safe.

### Concurrency and Async

- [ ] Every `async` boundary either propagates errors or logs them. No silent swallow.
- [ ] No unbounded queues. Backpressure is real.
- [ ] No unbounded retries. Every retry loop has a budget.
- [ ] Timeouts cascade: an outer 30s timeout never depends on three inner 15s timeouts in series.

### Authentication and Sessions

- [ ] Token refresh is handled. Expired tokens trigger refresh, not failure.
- [ ] Revocation works end-to-end (the user can really sign out, and you can really kick a session).
- [ ] Sign-in failures distinguish "your credentials are wrong" from "our server is down."
- [ ] Secrets are not in source. Period.
- [ ] Secrets are rotatable without redeploying client apps.

### Observability

- [ ] Crash reporting exists and is wired into every async surface.
- [ ] Every backend route logs at least: route, status, duration, error code.
- [ ] There is a dashboard. It is checked. Someone is alerted when it breaks.
- [ ] Critical business invariants (e.g., "accounts deleted on our side == accounts revoked at provider") are checked daily.
- [ ] You can answer "what is the p95 latency of sign-in right now" without writing new code.

### Rollout and Recovery

- [ ] There is a non-production environment that runs the same code as production.
- [ ] Releases are staged (canary, percentage rollout, App Store phased release).
- [ ] There is a kill switch for every dangerous feature.
- [ ] There is a one-page runbook for every critical endpoint.
- [ ] Rollback is fast and rehearsed.

### Testing

- [ ] The most destructive operations (delete, refund, revoke) have the most tests.
- [ ] Tests cover error paths, not only happy paths.
- [ ] There is at least one end-to-end test that exercises the full critical flow.
- [ ] Bad inputs (empty, malformed, oversized, wrong type) are explicitly tested.

### Human-Facing

- [ ] Destructive actions require confirmation and are recoverable for some window.
- [ ] Error messages tell the user what to do, not only what went wrong.
- [ ] The operator can disable a feature without a redeploy.
- [ ] The operator has access to the data and logs needed to diagnose without paging a developer.

---

## Patterns Worth Reaching For

A handful of patterns dissolve whole categories of reliability problems. Internalize these and reach for them by default.

### Idempotency Keys

Any write endpoint should accept a client-generated unique key. The server records `(key, result)` and replays the same result on retry. This single pattern eliminates the entire class of "did the request succeed before the network died" bugs. It is the difference between a delete endpoint you can trust and one you cannot.

### Bounded Retry with Jittered Backoff

Three attempts, jittered exponential delay (e.g., 250ms, 750ms, 2s), only on transient errors. The jitter matters: without it, thousands of clients retry in lockstep after an outage and crush the recovering server. This is the "thundering herd" pattern, and jitter is how you avoid it.

### Atomic Local Writes

Write to a temp file, fsync, rename over the target. The OS guarantees rename is atomic. Process kill mid-write leaves either the old file or the new file, never a half-written one. Same principle for databases: transactions exist for this reason.

### Feature Flags as Kill Switches

Every risky feature ships behind a flag that can be flipped without a deploy. Even a static JSON file on a CDN, read at app launch with cached fallback, is enough. This buys you the ability to disable a broken feature in minutes instead of hours.

### Staged Rollouts

Never deploy to 100% of users at once. Web: percentage rollouts. Mobile: App Store / Play Store phased releases. The first 1% of users are your real test suite.

### Soft Deletes for Destructive Actions

Anything irreversible should have a recovery window. Delete an account? Mark it for revocation, actually revoke 14 days later. The user who deletes by mistake gets to recover. The compliance requirement (you *will* delete) is still met.

### Self-Checks in Production

Pick the most important invariant in your system. Schedule a daily job that verifies it and alerts on drift. *"If a system is expected to provide some guarantee, it can constantly check itself while running and raise an alert if a discrepancy is found."*

### Chaos Engineering, in Miniature

You do not need Chaos Monkey to benefit from the idea. Randomly disable Wi-Fi on a build machine. Kill the backend process mid-request during testing. Set a 500ms artificial delay on every Apple API call in your dev environment for a week. Faults you induce in development are bugs you fix before users see them.

---

## How to Decide How Much Reliability You Need

Reliability is not free. The chapter is explicit:

> There are situations in which we may choose to sacrifice reliability in order to reduce development cost (e.g., when developing a prototype product for an unproven market) or operational cost (e.g., for a service with a very narrow profit margin), but we should be very conscious of when we are cutting corners.

A useful heuristic, by surface:

| Surface type | Reliability bar |
|---|---|
| Marketing site, internal admin tools | "best effort, fix on Monday" |
| Authenticated user features | "should not break in normal conditions" |
| User-generated data (notes, photos, training history) | "must never silently lose data" |
| Payments, account deletion, anything regulated | "must be correct, idempotent, auditable, monitored" |
| Health, safety, money-movement at scale | "all of the above, plus formal reviews" |

The mistake is applying one bar to everything: either over-engineering the marketing site or under-engineering the payment flow. Match the bar to the surface.

---

## What to Do After the Audit

The audit produces a top-10 list. That is the start, not the end.

1. **Assign owners.** Every item gets a name next to it. Unowned work does not happen.
2. **Time-box.** Items 1 through 3 in the next sprint. Items 4 through 7 in the next month. Items 8 through 10 on the backlog with a review date.
3. **Add tests as you fix.** Every reliability fix ships with the test that would have caught the original gap. This prevents regression and grows the safety net over time.
4. **Re-audit on a cadence.** Quarterly is enough. The codebase changes. The dependencies change. Yesterday's safe assumption is tomorrow's incident.
5. **Write the postmortem before the incident.** Pick the scariest gap. Write a one-page document describing what happens when it triggers and how you would respond. The exercise alone surfaces the next set of work.

---

## A Closing Note on Reliability as Craft

Reliability work rarely ships as a visible feature. No demo, no screenshot, no celebratory launch. But it is the work that determines whether a system is something users can build a life around or something they cycle through and forget.

The engineers who get this right are not always the best coders. They are the ones who can hold a system in their head, see where faults will turn into failures, and do the unglamorous work to break that chain. That is reliability as craft, and it compounds. Every app you ship that does not lose user data, that does not silently corrupt state, that recovers from outages without paging a human at 3am, is one more proof point that the discipline works.

That is what this playbook is for.

---

## References

- Kleppmann, M. *Designing Data-Intensive Applications*, Chapter 1, "Reliable, Scalable, and Maintainable Applications" (pp. 3 to 10).
- Netflix Chaos Monkey, as the canonical example of deliberately inducing faults to exercise fault-tolerance machinery.
- AWS Architecture Center, "Reliability Pillar" of the Well-Architected Framework, for cloud-specific extensions of these ideas.
