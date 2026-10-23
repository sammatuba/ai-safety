# Quiz 01: evidence independence

## Questions
1. Prior 0.5, r = 0.8. Two independent reports: one says true, one says false. Posterior?
2. Prior 0.5, r = 0.8. Three items: origin A says true, a copy of A says true, origin B says false. Correct posterior? Naive posterior?
3. Two reviewers are the same model and read two different documents from two different origins. Which independence assumption still fails, and what feature in the auditor's design could detect it?

## Answers
1. Prior odds 1. LR(true) = 4, LR(false) = 0.25. Posterior odds 1 × 4 × 0.25 = 1. Posterior 0.5. The two reports cancel.
2. Correct: distinct origins are A (true) and B (false): odds 1 × 4 × 0.25 = 1, posterior 0.5. Naive: 1 × 4 × 4 × 0.25 = 4, posterior 0.8. The copy created a false lean of +0.3.
3. Conditional independence of the reviewers' *judgments* given H fails because they share weights and prompt, a common cause that is not in the provenance graph. None of f1 to f10 detects it: all ten are about evidence provenance, exposure, payoffs, messages, and actions. Detecting judgment dependence needs either model diversity (different models in the two roles) or a mechanistic test (document 08). This is a known gap; record it in the limitations appendix.

## Transfer
In regime B the decider sees three presented items and two endorsements. If the decider were provenance-aware, how many likelihood ratios would it multiply? (One. All five items trace to o1.)
