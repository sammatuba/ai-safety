# Quiz 06: Ontology and typed claims

Source document: `foundations/06-ontology-and-typed-claims.md`. Answer in writing before
opening the answers.

## Questions

1. In section 5.2, suppose e3 is removed and a new item e4 from origin o3 reads "Grid
   operator bulletin: Unit 7 commercially available from 18:00" with predicate
   `commercially_available`. Does the validator approve? Walk both checks.
2. Why does `check_a` count `|S(C)|` and not `|C|`? Give the one-line reason from
   foundations 01.
3. Name one vulnerability that passes all three checks, and say which layer would have to
   catch it.
4. (Transfer) Regime B in the review game uses shared provenance. Which validator check
   does regime B test, and what result for H-EPI-2 would show that the validator acts on
   dependence rather than on general caution?

## Answers

**1.** Cited items are now e1 (o1, `testing_scheduled`), e2 (o1, derivative of e1,
`testing_scheduled`), and e4 (o3, `commercially_available`). Approved predicate
`q = commercially_available`.

`check_a`: supporting origins `S(C) = {o1, o3}`, size 2, so with `k = 2` it passes.

`check_b`: for e4, `(commercially_available, commercially_available)` is reflexive, so it
passes. For e1 and e2, `(testing_scheduled, commercially_available)` is not in `T*`, so
they fail. `check_b` is a conjunction over all cited items, so it fails.

Result: defer. The validator does not approve. Note what this means: one origin (o3)
supports the approved predicate; the other (o1) supports only a weaker predicate. If the
reviewers had cited e4 alone, `check_b` would pass but `check_a` would fail (`|S(C)| = 1`).
The claim needs two independent origins that each support `commercially_available` or a
predicate from which it is permitted. The ontology in section 5.1 has no such weaker
predicate, by design.

**2.** A derivative has likelihood ratio 1 given its origin: P(derivative | origin, H) =
P(derivative | origin, not H). Only distinct origins contribute distinct likelihood ratios,
so only distinct origins count as evidence.

**3.** A false origin. If o1 is an honest-looking log that is simply wrong, every
derivative inherits the error, the origin count is correct, every predicate is correctly
typed, and the time is valid. All three checks pass. No layer inside the validator catches
it. Catching it requires either a second independent origin that disagrees (which
`check_a` with `k = 2` makes more likely but does not guarantee) or source reliability
tracking outside the ontology, which is the November sprint's Trust Infrastructure
question. Other acceptable answers: malicious source registration (a derivative registered
as an origin passes `check_a`; the provenance layer fails) and wrong identity mapping
(predicates match, subject does not; entity resolution fails).

**4. (Transfer)** Regime B tests `check_a`, the independence check. In B all presented and
private items derive from o1, so `|S(C)| = 1` whenever the items support the claim, and a
validator with `k = 2` defers every approval in B. In A, five origins exist, so `check_a`
passes whenever two or more supporting origins are cited. H-EPI-2 predicts the validator
lowers false approval rate more in B than in A. The result that would confirm it acts on
dependence: a large drop in FAR(B), a small or zero drop in FAR(A), and no large drop in
TAR(A). The result that would refute it: equal drops in A and B, which would mean the
validator is deferring broadly, not detecting dependence; confound CF-5 then applies.
