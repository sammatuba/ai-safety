# Quiz 02: social learning

Companion to `foundations/02-social-learning.md`. Try each question before opening the
answers.

## Questions

1. In the DeGroot example, agent 2 starts farthest from the truth yet has the largest
   influence weight. Change one entry of W so that agent 1 has the largest influence, keep
   rows summing to 1, and recompute π. What does the group converge to?
2. In the cascade with p = 0.7, suppose agent 3 announces its raw signal l instead of only
   its action. Recompute agent 4's odds if s_4 = l. Does the cascade survive?
3. A decider says: "Two reviewers with the same prior reached the same posterior, so by
   Aumann the claim is well supported." Name the two assumptions this sentence needs and
   state which one the review game violates by design.

**Transfer question.** In regime C of the review game, reviewer R2 sees R1's endorsement
before acting. Write down, in the cascade model's terms, what R2 can infer from "R1
endorsed" and what R2 cannot infer. Then state one log field in the trajectory schema that
an auditor needs to detect this, and which information slices contain it.

## Answers

### 1. Reweighting DeGroot

Influence π is the left eigenvector of W. To raise agent 1's influence, make the others
listen to agent 1 more. One change: let agent 2 put weight 0.5 on agent 1 instead of 0.2,
and reduce its self-weight to 0.3 so the row still sums to 1.

```
W' = [ 0.5  0.3  0.2 ]
     [ 0.5  0.3  0.2 ]
     [ 0.1  0.3  0.6 ]
```

Solve π W' = π:

```
π_1 = 0.5 π_1 + 0.5 π_2 + 0.1 π_3   →  0.5 π_1 = 0.5 π_2 + 0.1 π_3
π_3 = 0.2 π_1 + 0.2 π_2 + 0.6 π_3   →  0.4 π_3 = 0.2 (π_1 + π_2)  →  π_3 = (π_1 + π_2)/2
```

Substitute: 0.5 π_1 = 0.5 π_2 + 0.05 (π_1 + π_2), so 0.45 π_1 = 0.55 π_2, π_2 = (9/11) π_1 ≈
0.818 π_1, and π_3 = (1 + 0.818)/2 π_1 = 0.909 π_1. Normalize: π_1 (1 + 0.818 + 0.909) =
2.727 π_1 = 1, so

```
π ≈ [0.367, 0.300, 0.333]
```

Agent 1 now has the largest influence. The limit is

```
0.367(0.9) + 0.300(0.2) + 0.333(0.4) = 0.330 + 0.060 + 0.133 = 0.523
```

The group moves from 0.433 toward the truth (0.9), but only to 0.523. The lesson holds:
the limit is set by the listening pattern, and the correct agent's influence is whatever
the network gives it, not what its accuracy earns.

### 2. Breaking the cascade with a raw signal

Agent 4 now knows s_1 = h, s_2 = h (from actions 1 and 2) and s_3 = l (announced). Its
odds before its own signal:

```
(7/3) × (7/3) × (3/7) = 7/3
```

With s_4 = l:

```
(7/3) × (3/7) = 1   →  P(H) = 0.5
```

Agent 4 is at the tie. Under our convention it follows its own signal and rejects. Its
action now reveals s_4. The cascade is broken: one disclosed signal restored the
information flow. This is the fragility point. It is also the argument for protocols that
record evidence, not only votes.

### 3. Aumann's assumptions in the review game

The sentence needs (1) a common prior and (2) common knowledge of the two posteriors.

The review game violates (2) by design in every regime: the decider sees each reviewer's
stated probability, but the reviewers do not see each other's posteriors except in regime C,
and even there R1 never sees R2's. Common knowledge needs each to know the other's posterior,
to know that the other knows, and so on without end. One visible number is not that.

Assumption (1) is also doubtful. Two role prompts of one model may encode different
starting beliefs, and two different models certainly may. Even if both assumptions held,
the theorem gives equal posteriors, not correct ones.

### Transfer answer

In cascade terms, "R1 endorsed" tells R2 that R1's total evidence (presented items plus R1's
private slice) favored the claim. If R2 assumes R1 is accuracy-aligned and competent, R2
can treat this as one private signal in favor. R2 cannot infer which items R1 relied on,
whether R1's private item agreed or disagreed with the presented items, or whether R1 was
itself copying something. R2 also cannot tell R1's private signal apart from the presented
items both of them saw, so R2 risks counting the presented items twice: once directly and
once through R1.

The trajectory field is `exposure_order`, which records that R2 saw R1 before acting. Only
slice S4 contains it. Slices S1 to S3 see the two endorsements but not the order in which
they were formed, which is why an actions-only auditor cannot separate regime C from a
coalition (H-SPRINT-2).
