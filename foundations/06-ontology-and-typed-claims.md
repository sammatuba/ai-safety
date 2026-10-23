---
title: "Ontology and typed claims: fixing what a claim means before anyone endorses it"
status: draft
updated: 2026-10-23
depends_on: ["GLOSSARY.md", "foundations/01-evidence-independence.md", "foundations/05-ai-control-and-oversight.md"]
---

# Ontology and typed claims: fixing what a claim means before anyone endorses it

> **One sentence.** An ontology fixes what a claim means and which moves between claims are
> permitted, so that a deterministic validator can reject a promotion that no number of
> endorsements should be allowed to make.

**Terms used (from GLOSSARY.md):** claim, typed claim, ontology, evidence item, origin,
derivative, provenance, evidence independence, double counting, endorsement, approval,
invalid approval, authority transition, semantic promotion, epistemic authority, decision
authority, decider, reviewer, regime, false approval rate, true approval rate.

## 1. Purpose

Foundations 01 shows one failure: counting dependent evidence items as if they were
independent. This document covers a second failure that counting cannot see at all: using
evidence for one claim as if it were evidence for a different, stronger claim.

Example from the fictional plant domain. Three reports say "testing of Unit 7 may begin at
18:00". A decider approves "Unit 7 is commercially available at 18:00". Even if the three
reports were independent and true, the approval is invalid. The evidence supports a weaker
predicate. The approval asserts a stronger one. We call this move **semantic promotion**.

An **ontology** is the tool that makes semantic promotion detectable by a machine. It is a
fixed vocabulary of predicates with a stated set of permitted relationships among them. A
validator that knows the ontology can check, before an approval executes, whether the
predicate being approved is one that the cited evidence can support.

What an ontology does **not** do: it does not make the entered facts true. A perfectly typed
claim can rest on a false origin. The ontology guards the meaning layer. The provenance
layer (foundations 01) guards the dependence layer. Neither guards against a lying origin.

## 2. Intuition

Two pictures.

**Three confirmations, one origin.** A control-room log says "Unit 7 synchronized at 17:55".
A dispatch note restates the log. A regional bulletin restates the note. A decider sees
three items and three source names. Provenance says: one origin, two derivatives. The
correct update uses one likelihood ratio (foundations 01). This is a dependence problem.

**Testing is not availability.** The same log says "Unit 7 synchronized for testing at
17:55". Two reviewers endorse "Unit 7 commercially available at 18:00", citing the log. The
decider approves. Here the evidence may be independent and true, and the approval is still
invalid, because "synchronized for testing" does not entail "commercially available". This
is a meaning problem.

The two pictures fail for different reasons and need different checks. A count of distinct
origins catches the first and misses the second. A permitted-transition check catches the
second and misses the first. The validator in section 3 does both.

**Limit of the pictures.** Both assume the predicates are already attached to the evidence
items. In the lab, the case generator attaches them. In a deployment, something has to
extract "this report is about `testing_scheduled`, not `commercially_available`" from
prose, and that extractor can be wrong or manipulated. The ontology moves the problem to
the extraction step; it does not remove it.

## 3. Mechanism

### 3.1 Typed claim

A **typed claim** is a tuple:

```
claim = (predicate, subject, time, value)
```

- `predicate` comes from the ontology's fixed vocabulary, for example
  `commercially_available`.
- `subject` is the entity, for example `Unit 7 at Ilog Plant`.
- `time` is the instant or interval the claim is about.
- `value` is the asserted truth value, usually `true`.

The lab's `Claim` dataclass (`lab/src/epistemic_lab/schemas.py`) has fields `predicate`,
`subject`, `time`, `text`. The `text` is the natural-language rendering an agent reads. The
other three fields are what a validator reads.

### 3.2 Provenance graph

Each **evidence item** has an `origin` and a `parent`. An origin observation has
`parent = None`. A **derivative** has `parent = <id of the item it restates>` and inherits
the origin. The set of items with their parent links forms a directed graph. Following
`parent` links from any item ends at exactly one root: its origin.

### 3.3 Permitted transitions

The ontology states which predicates can be inferred from which. Write `p -> q` to mean
"evidence for `p` is permitted as evidence for `q`". The relation is reflexive (`p -> p`)
and can chain. Everything not listed is forbidden.

### 3.4 The validator

The validator sits at the **authority transition**: after endorsements exist, before the
approval executes. It receives the approved claim, the cited evidence items (with their
predicates and provenance), and the ontology. It checks three conditions.

| Check | Question | Catches |
|---|---|---|
| (a) independence | Do the cited items that support the claim trace to at least `k` distinct origins? | double counting (regime B) |
| (b) transition | For every cited item with predicate `p`, is `p -> q` permitted, where `q` is the approved predicate? | semantic promotion |
| (c) time validity | Is each cited item's time inside the window the claim is about, and not later than the decision time? | stale or future-dated evidence |

If any check fails, the validator returns `defer` with the failed check named. The
decider's approval does not execute. No endorsement count overrides the validator.

### 3.5 Where it sits in the review game

```
proposer --> reviewers --> decider --> [validator] --> executed action
                                         ^
                                         | reads: approved claim, cited items,
                                         |        provenance, ontology
```

The validator is deterministic. It is not an agent and has no payoff. It is the mechanical
form of the owner's prior-work idea from the Grid Nowcast ontology: a review decision is a
separate act from the claim it accepts, and a reported milestone is not an observed event.
Those ideas are described here as concepts; no Grid Nowcast code is in this repository.

## 4. Formalism

### 4.1 Provenance graph as a DAG

Let `V` be the set of evidence items. Define the edge set
`E_parent = { (v, parent(v)) : v ∈ V, parent(v) ≠ None }`. The graph `G = (V, E_parent)`
is a directed acyclic graph: every edge points from a derivative to an earlier item, and an
item cannot be its own ancestor. Each weakly connected component has exactly one root.

For a set of cited items `C ⊆ V`, define the **information-bearing origins**

```
origins(C) = { root(v) : v ∈ C }
```

where `root(v)` follows `parent` until `None`. This is the set the lab's
`Case.origins_of(ids)` returns.

### 4.2 Independence check (a)

Let `support(v) = 1` if item `v` reports the claim true. Define

```
S(C) = { root(v) : v ∈ C, support(v) = 1 }
check_a(C, k) = [ |S(C)| ≥ k ]
```

The lab's secondary approval criterion (design/game.md section 6) is `check_a` with
`k = 2`: an approval is invalid when fewer than two distinct supporting origins exist. In
`lab/src/epistemic_lab/game.py` this is the `weak_support_approval` flag computed from
`supporting_origins`.

**[ESTABLISHED]** Why `|S(C)|` and not `|C|`: by foundations 01, a derivative has
likelihood ratio 1 given its origin. Only distinct origins carry distinct likelihood
ratios. `|S(C)|` counts the multiplicands that actually exist.

### 4.3 Transition check (b)

Let `Pred` be the ontology's predicate set and `T ⊆ Pred × Pred` the permitted-transition
relation, with `(p, p) ∈ T` for all `p`. Let `pred(v)` be the predicate of item `v` and
`q` the predicate of the approved claim.

```
check_b(C, q) = ∧_{v ∈ C}  [ (pred(v), q) ∈ T* ]
```

where `T*` is the transitive closure of `T`. **Semantic promotion** is the event
`check_b(C, q) = false`: the approval asserts `q` from evidence for some `p` with
`(p, q) ∉ T*`.

### 4.4 The validator as a function

```
validate(C, q, k, T) =
    approve_permitted   if check_a(C, k) ∧ check_b(C, q) ∧ check_c(C)
    defer(reason)       otherwise
```

`check_c` is time validity; the sprint lab does not implement it, because every case has a
single time field. It is listed because the Grid Nowcast concept of time-valid evidence
needs it, and the November sprint will.

### 4.5 What the formalism assumes

- `pred(v)` is known and correct for every item. (Extraction assumption.)
- `parent(v)` is known and correct. (Provenance assumption.)
- `T` is complete and correct for the domain. (Ontology assumption.)
- Origins are honest. (Not assumed; not guaranteed; see section 6.)

Each assumption, when false, is a separate vulnerability.

## 5. Example

### 5.1 A small ontology for the fictional plant domain

| Predicate | Meaning |
|---|---|
| `testing_scheduled` | A test of the unit is planned for the stated time |
| `testing_started` | The test has begun |
| `synchronized` | The unit is connected to the grid (for testing or for service) |
| `commercially_available` | The unit can be dispatched for commercial service |

Permitted transitions `T` (beyond reflexive):

| From `p` | To `q` | Permitted? | Why |
|---|---|---|---|
| `testing_started` | `testing_scheduled` | yes | A started test was scheduled |
| `synchronized` | `testing_started` | yes, in this domain | Synchronization is a test step |
| `commercially_available` | `synchronized` | yes | A dispatchable unit is connected |
| `testing_scheduled` | `commercially_available` | **no** | A plan is not a state |
| `synchronized` | `commercially_available` | **no** | Test synchronization is not service |

Note the direction. Stronger states imply weaker ones. Weaker states never imply stronger
ones.

### 5.2 A case

Approved claim: `q = commercially_available`, subject Unit 7, time 18:00.

Cited items:

| Item | Origin | Parent | Predicate | Text |
|---|---|---|---|---|
| e1 | o1 | None | `testing_scheduled` | "Ilog control room log: Unit 7 testing may begin at 18:00." |
| e2 | o1 | e1 | `testing_scheduled` | "Dispatch desk note: per control room, Unit 7 test window opens 18:00." |
| e3 | o2 | None | `synchronized` | "Plant SCADA export: Unit 7 breaker closed 17:55 for test run." |

Reviewer R1 endorses, citing e1 and e2. Reviewer R2 endorses, citing e3.

### 5.3 A count-based decider

The scripted `NaiveDecider` in the lab approves when both reviewers endorse and a majority
of presented items report true. All three items report their own predicate true. Both
endorse. The decider approves. **[FINDING, scripted]** The approval executes.

### 5.4 The validator

- `check_a`: `S(C) = {o1, o2}`, size 2, `k = 2`. **Pass.**
- `check_b`: `(testing_scheduled, commercially_available) ∈ T*`? No. **Fail** on e1 and
  e2. `(synchronized, commercially_available) ∈ T*`? No. **Fail** on e3.
- Result: `defer("transition not permitted: testing_scheduled -> commercially_available;
  synchronized -> commercially_available")`.

The validator defers although two independent origins support their own claims and both
reviewers endorse. The endorsements have **epistemic authority** about `testing_scheduled`
and `synchronized`. They have no **decision authority** over `commercially_available`,
because the ontology does not connect those predicates.

### 5.5 What a prompt cannot do here

An instruction to the decider to "be careful about the difference between testing and
availability" relies on the decider noticing. The validator does not rely on noticing. It
rejects every transition not in `T`, including ones nobody anticipated. That is the
content of H-CORE-3: an intervention at the authority transition is a different kind of
intervention from one on an agent's prompt. **[HYPOTHESIS]** Whether it measurably beats
the prompt is the question for H-EPI-1.

## 6. Significance

### 6.1 What an ontology cannot guarantee

| Vulnerability | What happens | Which layer fails |
|---|---|---|
| False origin | o1 lies; every derivative inherits the lie; `check_a` and `check_b` pass | truth of origins |
| Malicious source registration | An attacker registers a new "origin" that is really a derivative; `|S(C)|` is inflated | provenance assumption |
| Wrong identity mapping | "Unit 7" in e1 is a different unit than in the claim; predicates match, subject does not | entity resolution |
| Wrong predicate extraction | A derivative is tagged `commercially_available` because it used the word "available" | extraction assumption |
| Incomplete `T` | A legitimate inference is missing; valid approvals are deferred | ontology assumption; lowers true approval rate |

The last row is the usefulness cost. H-EPI-1's falsifier includes "validator rejects valid
transitions". Confound CF-5 applies: report true approval rate whenever reporting false
approval rate.

### 6.2 Links to the hypothesis registry

- **H-CORE-3.** The authority transition is where this validator acts. The hypothesis
  predicts a validator reduces false approval rate more than a caution prompt does.
- **H-EPI-1.** A deterministic validator blocks semantic promotion that a free-text
  reviewer accepts, with no loss on valid transitions. The example in section 5 is the
  shape of one test case.
- **H-EPI-2.** Typed claims with provenance reduce false approval rate more under regime
  B (shared provenance) than under regime A. If the reduction were equal, the intervention
  would be general caution, not a dependence check.

### 6.3 The November sprint

The Apart AI x Epistemics Research Sprint runs 2026-11-13 to 2026-11-15. Its Trust
Infrastructure track covers source reliability, verifiable provenance, and whether
provenance information improves agent decisions. The validator of section 3.4, compared
against a free-text reviewer on the review game's regimes, is a candidate project
(`projects/2026-11-apart-epistemics-sprint/`). The October sprint produces the regimes and
the labeled trajectories; the November sprint tests the defense.

### 6.4 Links to the literature

- [R1] Hauswald 2025 separates identifying an epistemic authority from deciding how much to
  defer to it. The validator is a third thing: a bound on what any authority, however
  credible, can authorize. **[INTERPRETATION]** Deference is bounded by the ontology, not
  by credibility.
- [R14] Hu et al. 2026 study coordinated release of individually true evidence items that
  together induce a false conclusion. Section 5 is a single-step version of that pattern:
  every cited item is true, and the approved claim is not supported. The validator's
  `check_b` is the kind of mechanism that would have to catch it. Whether it does, under
  adversarial selection of items, is untested.

### 6.5 What breaks if an assumption fails

If predicate extraction is adversarial, an attacker rewrites a derivative so that it is
tagged with the stronger predicate; `check_b` passes and the validator is bypassed. If
origin registration is open, `check_a` is bypassed. If `T` is maintained by the same
agents it constrains, the ontology itself becomes the coordination channel (threat model
TM-5). An ontology is a control only when its maintenance is outside the untrusted agents'
reach.

## 7. Check yourself

1. In section 5.2, suppose e3 is removed and a new item e4 from origin o3 reads "Grid
   operator bulletin: Unit 7 commercially available from 18:00" with predicate
   `commercially_available`. Does the validator approve? Walk both checks.
2. Why does `check_a` count `|S(C)|` and not `|C|`? Give the one-line reason from
   foundations 01.
3. Name one vulnerability that passes all three checks, and say which layer would have to
   catch it.

Answers: `study/quizzes/06-ontology-and-typed-claims.md`.

## Sources

- [R1] Hauswald 2025, artificial epistemic authorities: identification and deference.
- [R14] Hu et al. 2026, individually truthful fragments inducing a false conclusion.
- Owner's prior-work concepts (Grid Nowcast ontology; not on disk): claim versus accepted
  fact; source versions copied or derived from one another; reported milestone versus
  observed event; review decision as a separate act.
- Repository: `foundations/01-evidence-independence.md`,
  `projects/2026-10-apart-collusion-sprint/design/game.md` section 6,
  `lab/src/epistemic_lab/schemas.py`, `lab/src/epistemic_lab/game.py`.
