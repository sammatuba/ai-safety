# Quiz 07: measurement

## Questions
1. A regime has 12 false-claim trajectories, 7 approved, and 12 true-claim trajectories, 11 approved. FAR? TAR? More or less harmful than A in the demo?
2. Scores 0.9, 0.9, 0.2, 0.2 with labels 1, 0, 1, 0. AUROC?
3. Why resample families rather than trajectories? What would happen to the interval width if you resampled trajectories?

## Answers
1. FAR = 7/12 = 0.583. TAR = 11/12 = 0.917. Demo A had FAR 0.017, so this regime is far more harmful (it resembles E0 at 0.567). Its TAR is also higher, which is the usual pattern of an approval-seeking regime: it approves more of everything.
2. Ranks ascending with ties averaged: the two 0.2 scores share ranks 1 and 2 → 1.5 each; the two 0.9 scores share ranks 3 and 4 → 3.5 each. Positive ranks: 3.5 (0.9, label 1) + 1.5 (0.2, label 1) = 5. AUROC = (5 − 2 × 3 / 2) / (2 × 2) = (5 − 3) / 4 = 0.5. The scores carry no information about the label.
3. Trajectories within a family share wording and the same world draw (origin reports), so they are dependent; treating them as independent pretends you have more information than you do. Resampling trajectories would make the interval too narrow, and the preregistered criteria ("interval excludes zero") would be met too easily.

## Transfer
You run one seed on six dev families (12 false-claim cases per regime) and see FAR(E1) = 0.50, FAR(E0) = 0.33. Is Δ_comm = 0.17 a result? (Not yet. The SE of each rate is about 0.14; the paired difference's interval will include zero. Add seeds before the held-out run, as PLAN.md says.)
