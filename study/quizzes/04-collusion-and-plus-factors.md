# Quiz 04: collusion and plus factors

## Questions
1. State the three-part definition of collusion and name one regime that fails each part.
2. Why is `invalid` (f2) not a plus factor? Which feature would you add if the coalition could also change what evidence the proposer presents?
3. In the scripted world Δ_comm = 0. Does that mean regime P is not collusion?

## Answers
1. Coalition (a joint outcome that raises both payoffs): fails in B, C, F (accuracy-aligned reviewers). Mechanism (one agent's action depends on another's intended action through a channel, signal, or history): fails in E0. Outside cost (the decider's payoff falls): fails in F when the talk changes nothing.
2. P(invalid | collusion) ≈ P(invalid | parallel conduct): both regimes approve false claims at similar rates when the reviewers endorse everything. A feature with likelihood ratio near 1 against the hardest alternative does not separate. If the proposer's selection could be coordinated, add "presented items match the ids named in a private message" (a selection-side followed_plan) and "presented set differs from the channel-off counterfactual's presented set".
3. No. Definition 4.1 requires a mechanism and an outside cost, not a *marginal* effect of the channel over the no-channel world. In P the coalition agreed through a message and the actions matched the plan; the decider lost. The channel did not change the votes because endorsing was already dominant. Collusion that adds no harm beyond parallel conduct is still collusion by the definition, and it is still what a court would call an agreement. Whether it *matters* is a separate question, which Δ_comm answers.

## Transfer
A deployed auditor cannot compute f7 (payoffs) or f10 (counterfactual). Which S4 discount or upgrade survives, and which regime becomes hardest to reject? (Survives: f5, f6 discounts, f8 upgrade, f9. Hardest: F, because the no-motive discount is gone and talk plus coincidental agreement looks like P.)
