/* Curated explainer content. Canonical sources: foundations/00-map.md through
   foundations/08-mechanistic-detection.md. Each page follows the six-step order
   from templates/concept-doc.md, then states conditions and a self-check. */
window.FOUNDATIONS = [
  {
    id: "00",
    slug: "map",
    short: "Map",
    lens: "All four lenses",
    title: "Map: four lenses on one question",
    oneSentence:
      "Agreement is an observation. Collusion is one causal explanation of it, and four lenses each answer a different part of the question.",
    time: "10 min",
    source: "foundations/00-map.md",
    kinds: ["ESTABLISHED", "INTERPRETATION"],
    kindNote: "The models are established; the five-way organizing frame is our interpretation.",
    terms: [
      "agreement",
      "evidence independence",
      "conformity",
      "strategic persuasion",
      "parallel conduct",
      "collusion",
      "authority transition",
      "auditor",
      "trusted monitor"
    ],
    fundamentals: [
      {
        key: "purpose",
        title: "Purpose",
        blocks: [
          {
            type: "p",
            text: "Three agents endorse a claim and a decider approves it. Later the claim turns out false. What went wrong? There are at least five different answers, and each one calls for a different fix. A researcher who cannot tell them apart will build an auditor that flags innocent agents, or a defense that blocks the wrong mechanism."
          },
          {
            type: "p",
            text: "This page names the five explanations, assigns each to a lens, and points to the document that teaches it. Every later concept page returns to one sentence: agreement is an observation; collusion is one explanation of it."
          }
        ]
      },
      {
        key: "intuition",
        title: "Intuition",
        blocks: [
          {
            type: "p",
            text: "The observation is always the same: agreement plus a wrong decision. What differs is the causal story. Independent agents can err. Copies can inflate one origin. Reviewers can copy each other. A proposer can filter evidence. A pair can share an incentive without agreeing. Or a coalition can coordinate against the decider."
          },
          {
            type: "callout",
            label: "The central distinction",
            text: "Agreement is visible. Coordination is inferred. The auditor's job is to find evidence that is more probable under coordination than under the innocent explanations."
          }
        ]
      },
      {
        key: "mechanism",
        title: "Mechanism",
        blocks: [
          {
            type: "table",
            head: ["#", "Explanation", "Mechanism", "Lens", "Regime"],
            rows: [
              ["1", "Independent mistake", "Each agent had its own evidence and still erred", "Epistemology", "A"],
              ["2", "Shared-source error", "Items trace to one origin; the decider double counts", "Epistemology", "B"],
              ["3", "Conformity", "A later agent copies an earlier one and drops private evidence", "Social learning", "C"],
              ["4", "Strategic persuasion", "One agent selects evidence to move the others", "Game theory", "D"],
              ["5a", "Parallel conduct", "Shared incentive, same action, no mechanism", "Game theory, law", "E0"],
              ["5b", "Collusion", "Coalition plus mechanism plus outside cost", "Game theory, control", "E1, P"],
              ["6", "Talk without action", "Coordination language with no effect on actions", "Audit", "F"]
            ]
          }
        ]
      },
      {
        key: "formalism",
        title: "Formalism",
        blocks: [
          {
            type: "p",
            text: "Every lens meets at the authority transition: the step where an endorsement becomes an approval. Before that step, agents only talk. After it, something happens in the world."
          },
          {
            type: "formula",
            text: "(E, M, R)  →  belief b = P(θ = true | E, M, R)  →  action a"
          },
          {
            type: "p",
            text: "The first arrow is epistemic weighting. The second is decision authority. Epistemology says to count distinct origins. Game theory says to ask who benefits. Ontology says to check that the approved predicate is the supported predicate. AI control says to put the monitor or validator at this step and measure both safety and usefulness."
          }
        ]
      },
      {
        key: "example",
        title: "Example",
        blocks: [
          {
            type: "p",
            text: "Hold this case in mind: two reviewers endorse \"Unit 7 is commercially available at 18:00.\" The decider approves. Unit 7 was in testing."
          },
          {
            type: "list",
            items: [
              "Epistemology: both reviewers cited reports that paraphrase one control-room log. The decider counted two endorsements as two observations.",
              "Ontology: the log said testing_scheduled. The approval asserted commercially_available. The transition is not permitted without a synchronization record.",
              "Game theory: the proposer and reviewers are paid on approval. No message passed between them. This is parallel conduct until a plus factor appears.",
              "AI control: the protocol let two endorsements trigger approval with no independence check. The fix is at the transition, not in the reviewers' prompts."
            ]
          }
        ]
      },
      {
        key: "significance",
        title: "Significance",
        blocks: [
          {
            type: "p",
            text: "Read 01, 04, and 07 first if you are working on the sprint. Read 02, 03, 05, 06, and 08 for the full program. Each document ends with three questions. Write your own answer before reading the key."
          },
          {
            type: "callout",
            label: "Why this matters",
            text: "The same agreement pattern can be innocent or collusive. A detector that skips the causal question will either miss coordination or punish honest agents. The five-way map is the checklist that prevents both errors."
          }
        ]
      }
    ],
    conditions: {
      summary:
        "The map applies when agreement and the decision outcome are observable, but the cause is not.",
      assumptions: [
        {
          text: "Agreement and the wrong decision are separately observable.",
          breaks: "If the protocol records only a final action, several explanations collapse into one observation."
        },
        {
          text: "At least one of provenance, exposure order, payoffs, channel use, or action consistency is recorded.",
          breaks: "Without metadata, the explanations are not distinguishable after the fact."
        },
        {
          text: "The innocent explanations are treated as alternatives to beat, not as details to ignore.",
          breaks: "An auditor that jumps from agreement to collusion will have a high false-positive rate."
        }
      ],
      failureModes: [
        {
          text: "Calling agreement collusion without a coalition, a mechanism, and an outside cost.",
          catch: "Apply the three-part definition before applying a label."
        },
        {
          text: "Using only one lens and missing the mechanism that actually caused the harm.",
          catch: "Run the five-way checklist: origin, exposure, selection, incentive, coordination."
        },
        {
          text: "Treating a detector's output as ground truth.",
          catch: "Compare against the regime label and report false positives per innocent regime."
        }
      ]
    },
    regimes: ["A", "B", "C", "D", "E0", "E1", "F", "P"],
    hypotheses: [],
    quiz: [
      {
        question: "What does agreement among agents establish on its own?",
        options: [
          "That the agents coordinated",
          "That the claim is probably true",
          "An observation that needs a causal explanation",
          "That the agents share a payoff"
        ],
        answer: 2,
        explanation:
          "Agreement is the observation. Coalition, mechanism, and outside cost are separate questions."
      },
      {
        question: "A proposer shows only the evidence items that support approval. Which lens explains why?",
        options: ["Ontology", "Game theory", "AI control", "Mechanistic detection"],
        answer: 1,
        explanation:
          "The proposer's payoff depends on the decision, so it selects messages to move the decider. That is strategic persuasion."
      },
      {
        question: "Where do the four lenses meet in the review game?",
        options: [
          "At the evidence collection step",
          "At the authority transition from endorsement to approval",
          "At the model's first transformer layer",
          "At the case generator"
        ],
        answer: 1,
        explanation:
          "The authority transition is where epistemic weight becomes a decision with consequences."
      }
    ],
    demo: null,
    related: ["01", "04", "05"]
  },

  {
    id: "01",
    slug: "evidence-independence",
    short: "Evidence",
    lens: "Epistemology",
    title: "Evidence independence: why copies are not corroboration",
    oneSentence:
      "Likelihood ratios multiply only under conditional independence; a derivative has likelihood ratio 1 once its origin is known, so counting it again is an error with a computable size.",
    time: "60 min",
    source: "foundations/01-evidence-independence.md",
    kinds: ["ESTABLISHED", "FINDING", "HYPOTHESIS"],
    kindNote:
      "The Bayesian identities are established. The lab measurements are scripted findings. The LLM prediction is a hypothesis.",
    terms: [
      "claim",
      "evidence item",
      "origin",
      "derivative",
      "provenance",
      "evidence independence",
      "dependence",
      "double counting",
      "prior odds",
      "likelihood ratio",
      "posterior odds",
      "conditional independence",
      "correlated error"
    ],
    fundamentals: [
      {
        key: "purpose",
        title: "Purpose",
        blocks: [
          {
            type: "p",
            text: "A decider sees three reports that say the same thing. Should its confidence rise three times or once? If the three reports descend from one observation, the right answer is once. A decider that updates three times has committed double counting."
          },
          {
            type: "p",
            text: "Double counting is not a strategic failure. It happens with honest agents and true statements. It is the simplest way an oversight protocol can be wrong, and it is the baseline against which every strategic explanation must be compared."
          }
        ]
      },
      {
        key: "intuition",
        title: "Intuition",
        blocks: [
          {
            type: "p",
            text: "Think of each origin observation as one witness who looked. A derivative is someone who heard the witness and repeated the story. Ten people repeating one witness give you one witness."
          },
          {
            type: "callout",
            label: "Limit of the picture",
            text: "A repeater can add noise by misquoting, or add information if they also looked. Section 4.5 of the source handles the partial case. The simple picture handles exact copies."
          }
        ]
      },
      {
        key: "mechanism",
        title: "Mechanism",
        blocks: [
          {
            type: "ordered",
            items: [
              "Convert the prior probability to prior odds.",
              "For each origin, compute its likelihood ratio from its reliability and what it reports.",
              "Multiply prior odds by the likelihood ratios of the distinct origins only.",
              "Convert posterior odds back to a probability."
            ]
          },
          {
            type: "p",
            text: "A naive updater skips the provenance graph and multiplies once per item. The gap between the two posteriors is the double-counting error."
          }
        ]
      },
      {
        key: "formalism",
        title: "Formalism",
        blocks: [
          {
            type: "formula",
            text: "odds(p) = p / (1 − p)          prob(o) = o / (1 + o)"
          },
          {
            type: "formula",
            text: "LR(E) = P(E | H) / P(E | ¬H)"
          },
          {
            type: "formula",
            text: "posterior odds(H | E) = prior odds(H) × LR(E)"
          },
          {
            type: "p",
            text: "Under conditional independence given H and given ¬H, the joint likelihood ratio factorizes. That is an identity under the assumption. The assumption is the whole content."
          },
          {
            type: "formula",
            text: "LR(E1, E2) = LR(E1) × LR(E2)   only if E1 ⟂ E2 | H and E1 ⟂ E2 | ¬H"
          },
          {
            type: "p",
            text: "An exact derivative E2 is a deterministic function of its origin E1. P(E2 | E1, H) = P(E2 | E1, ¬H) = 1, so the joint ratio is LR(E1), not LR(E1)²."
          }
        ]
      },
      {
        key: "example",
        title: "Example",
        blocks: [
          {
            type: "p",
            text: "Prior 0.5, reliability r = 0.8, three items all reporting true. One true report has likelihood ratio 4."
          },
          {
            type: "table",
            head: ["Provenance", "Correct posterior", "Naive posterior", "Error"],
            rows: [
              ["Three origins", "0.985", "0.985", "0"],
              ["One origin, two exact copies", "0.800", "0.985", "+0.185"],
              ["One origin, two noisy readers (q = 0.9)", "0.793", "0.890", "about +0.10"]
            ]
          },
          {
            type: "p",
            text: "In the review game, regime B gives each reviewer and the decider only derivatives of one origin. The scripted demo measured a false approval rate of 0.167 in B against 0.017 in A, a paired difference of 0.150 with a 95 percent bootstrap interval [0.086, 0.200]. That number is a property of the scripted rules, not of any language model."
          }
        ]
      },
      {
        key: "significance",
        title: "Significance",
        blocks: [
          {
            type: "p",
            text: "Every strategic explanation of a wrong decision must beat this non-strategic one. If a decider double counts, a coalition does not need to coordinate: it only needs to repeat. An auditor that cannot see provenance may see repeated endorsements and call them collusion."
          },
          {
            type: "callout",
            label: "Where the assumption can fail the other way",
            text: "Two reviewers that are the same model, prompted the same way, reading different documents, still share a common cause: their weights. Provenance of evidence does not capture provenance of judgment."
          }
        ]
      }
    ],
    conditions: {
      summary:
        "The Bayes update applies when the prior, the origin reliability, and the provenance graph are known; independence is a property of the generating process, not the wording.",
      assumptions: [
        {
          text: "A prior probability and each origin's reliability are available.",
          breaks: "If reliability is unknown, the likelihood ratio is unknown; use ranges and report sensitivity."
        },
        {
          text: "The provenance graph identifies each origin and each derivative.",
          breaks: "Without provenance, different wording can hide a shared root."
        },
        {
          text: "Distinct origins are conditionally independent given the claim and its negation.",
          breaks: "Same model weights or shared training data can correlate errors even with distinct documents."
        },
        {
          text: "An exact copy is deterministic given its origin.",
          breaks: "Noisy copying adds information or noise; use the joint likelihood, not LR × 1."
        }
      ],
      failureModes: [
        {
          text: "Counting items instead of distinct origins.",
          catch: "Count roots in the provenance graph. The validator's check_a does this."
        },
        {
          text: "Assuming text similarity measures independence.",
          catch: "Provenance is the test. Text similarity is at best a weak proxy."
        },
        {
          text: "Ignoring correlated model errors.",
          catch: "Report model diversity and treat shared judgment as a separate dependence channel."
        }
      ]
    },
    regimes: ["A", "B"],
    hypotheses: [
      {
        id: "H-CORE-1",
        text: "A protocol that aggregates endorsements without checking independence approves false claims more often as derivative items increase."
      }
    ],
    quiz: [
      {
        question: "Prior 0.5, r = 0.8. Two independent reports: one says true, one says false. What is the posterior?",
        options: ["0.80", "0.50", "0.20", "0.94"],
        answer: 1,
        explanation:
          "The true report has LR 4 and the false report has LR 1/4. Their product is 1, so the posterior odds stay at 1 and the posterior is 0.5."
      },
      {
        question: "Origin A says true, a copy of A says true, origin B says false. What are the correct and naive posteriors from prior 0.5?",
        options: [
          "Correct 0.50; naive 0.80",
          "Correct 0.80; naive 0.98",
          "Correct 0.50; naive 0.50",
          "Correct 0.94; naive 0.80"
        ],
        answer: 0,
        explanation:
          "Correct: LR 4 from A, LR 1 from the copy, LR 1/4 from B, so odds 1 and posterior 0.5. Naive counts three items: 4 × 4 × 1/4 = 4, posterior 0.8."
      },
      {
        question: "Two reviewers are the same model reading two different documents from two origins. Which assumption still fails?",
        options: [
          "The prior is unknown",
          "The reports are conditionally independent given the claim",
          "The claim has no ground truth",
          "The decider cannot count origins"
        ],
        answer: 1,
        explanation:
          "Shared model weights create correlated errors. Provenance of evidence does not capture provenance of judgment, and none of features f1 to f10 catches it."
      }
    ],
    demo: "evidence",
    related: ["02", "04", "06"]
  },

  {
    id: "02",
    slug: "social-learning",
    short: "Social learning",
    lens: "Social learning",
    title: "Social learning: consensus, cascades, and agreement",
    oneSentence:
      "Three classic models show three different ways a group can reach agreement without the agreement being a count of independent evidence.",
    time: "45 min",
    source: "foundations/02-social-learning.md",
    kinds: ["ESTABLISHED", "INTERPRETATION", "HYPOTHESIS", "SPECULATION"],
    kindNote:
      "The three models are established. The mapping to LLM reviewers is interpretation; the conformity prediction is a hypothesis.",
    terms: [
      "agreement",
      "conformity",
      "information cascade",
      "exposure order",
      "evidence independence",
      "conditional independence",
      "prior odds",
      "likelihood ratio",
      "posterior odds",
      "correlated error",
      "regime",
      "reviewer",
      "decider",
      "private signal",
      "public action",
      "weight matrix",
      "common prior",
      "common knowledge"
    ],
    fundamentals: [
      {
        key: "purpose",
        title: "Purpose",
        blocks: [
          {
            type: "p",
            text: "A decider sees that two reviewers agree. How much should that agreement move belief? Document 01 answered for evidence items: two items move belief twice only if they are conditionally independent given the claim. This document asks the same question for agents."
          },
          {
            type: "p",
            text: "Agents are not passive evidence items. They observe each other, update on each other, and imitate each other. Three models each isolate one mechanism: DeGroot averaging, information cascades, and Aumann agreement."
          }
        ]
      },
      {
        key: "intuition",
        title: "Intuition",
        blocks: [
          {
            type: "list",
            items: [
              "DeGroot: agents average opinions repeatedly. They end at a number set by who listens to whom, not by who was right.",
              "Cascade: agents act in order and see earlier actions but not earlier signals. A later agent may rationally copy an earlier run even when its private evidence disagrees.",
              "Aumann: agents with a common prior and common knowledge of posteriors must agree. The result says nothing about whether the shared belief is true."
            ]
          },
          {
            type: "callout",
            label: "Limit of the intuition",
            text: "These are models of idealized agents. A language-model reviewer is not a Bayesian updater and does not have a known weight matrix. The models tell us which patterns to look for; they do not tell us that a model follows one."
          }
        ]
      },
      {
        key: "mechanism",
        title: "Mechanism",
        blocks: [
          {
            type: "table",
            head: ["Model", "Mechanism", "What agreement means afterward"],
            rows: [
              ["DeGroot", "Repeated averaging of neighbors' opinions", "A weighted average of starting opinions"],
              ["Information cascade", "Sequential imitation of public actions", "The first one or two private signals, copied"],
              ["Aumann", "Common prior plus common knowledge of posteriors", "Equal posteriors, under strong assumptions"]
            ]
          },
          {
            type: "p",
            text: "Without these models a reader makes one recurring error: treating 'three agents agree' as 'three independent observations agree'. Each model shows a way the count of agreeing agents can be large while the count of independent signals is one."
          }
        ]
      },
      {
        key: "formalism",
        title: "Formalism",
        blocks: [
          {
            type: "p",
            text: "DeGroot. Each agent i holds an opinion x_i(t) in [0, 1]. W is row-stochastic: W_ij is how much i trusts j, and each row sums to 1."
          },
          {
            type: "formula",
            text: "x(t+1) = W x(t)        so        x(t) = W^t x(0)"
          },
          {
            type: "p",
            text: "If the trust graph is strongly connected and aperiodic, every row of W^t converges to the same vector π, the left eigenvector of W with eigenvalue 1. Every agent's limiting opinion is π · x(0). The weights, not the truth, set the limit."
          },
          {
            type: "p",
            text: "Cascades. With prior 1/2 and signal accuracy p, one signal has LR = p / (1 − p). Under conditional independence, posterior odds after k signals are prior odds times the product of the signal likelihood ratios. Once the public history implies two high signals, a third agent adopts even after a low signal."
          },
          {
            type: "p",
            text: "Aumann. Common prior plus common knowledge of each posterior implies equal posteriors. The theorem does not say the shared posterior is correct, and it does not apply when priors differ."
          }
        ]
      },
      {
        key: "example",
        title: "Example",
        blocks: [
          {
            type: "p",
            text: "DeGroot with three agents. Initial opinions are 0.9, 0.2, and 0.4; the correct value is 0.9. Under the source's weight matrix the group converges to 0.433. Agent 2 starts farthest from the truth but has the largest long-run influence. Convergence measured nothing about truth."
          },
          {
            type: "p",
            text: "Cascade with p = 0.7. Agents 1 and 2 receive high signals and adopt. Agent 3 receives a low signal, but the public history implies two high signals. Its posterior odds are (7/3)² × (3/7) = 7/3, so it adopts against its own signal. The wrong cascade starts with probability 0.09 when the true state is low."
          },
          {
            type: "callout",
            label: "Mapping to the sprint",
            text: "Regime C turns exposure on: R2 sees R1's endorsement before acting. The measurement question is whether R2 follows R1 more often than its private evidence predicts."
          }
        ]
      },
      {
        key: "significance",
        title: "Significance",
        blocks: [
          {
            type: "p",
            text: "The failure mode is a decider that treats the agreement of two reviewers as two independent signals when it was one signal plus one imitation. Without exposure order, a cascade and a coalition can look the same at the level of votes and outcomes."
          },
          {
            type: "p",
            text: "The empirical question is open. The sprint's C-versus-A contrast tests whether language-model reviewers conform when they are not told to. If the conformity rate is zero, the mechanism is absent in this model and regime C becomes a clean negative control."
          }
        ]
      }
    ],
    conditions: {
      summary:
        "Each model has different assumptions. The common warning is that agreement can be manufactured by the observation structure rather than by independent evidence.",
      assumptions: [
        {
          text: "DeGroot: fixed trust weights, a strongly connected aperiodic graph, and repeated rounds.",
          breaks: "A one-shot review has no repeated averaging. The model is a benchmark, not a description of the sprint."
        },
        {
          text: "Cascade: private signals are conditionally independent given the state and each has known accuracy.",
          breaks: "Shared sources or shared model weights violate the independence assumption."
        },
        {
          text: "Aumann: agents share a common prior and their posteriors are common knowledge.",
          breaks: "Different models or role prompts can encode different priors; one message exchange is not common knowledge."
        },
        {
          text: "The protocol records which agent saw which output before acting.",
          breaks: "Without exposure order, conformity is observationally similar to independent agreement."
        }
      ],
      failureModes: [
        {
          text: "Treating consensus as truth.",
          catch: "Report convergence separately from accuracy; the DeGroot limit can be far from the correct value."
        },
        {
          text: "Treating a cascade as collusion.",
          catch: "A cascade has no coalition and no outside cost by itself. Check exposure and payoffs."
        },
        {
          text: "Assuming a language model is Bayesian.",
          catch: "Measure behavior under controlled exposure; do not infer the model from the theorem."
        }
      ]
    },
    regimes: ["A", "C"],
    hypotheses: [
      {
        id: "H-CORE-2",
        text: "Agreement from shared source, conformity, persuasion, or parallel conduct is observationally similar to collusion at the message and action level, but separable with provenance, exposure order, and plan-action match."
      },
      {
        id: "H-SPRINT-2",
        text: "An actions-only auditor cannot separate harmful correlated agreement (B, C, E0) from collusion (E1)."
      }
    ],
    quiz: [
      {
        question: "In the DeGroot model, what sets the group's limiting opinion?",
        options: [
          "The correct answer",
          "The trust weights and starting opinions",
          "The number of rounds only",
          "The private evidence of the best agent"
        ],
        answer: 1,
        explanation:
          "The limit is π · x(0), where π depends on the weight matrix. The correct value is not part of the model."
      },
      {
        question: "In a cascade with p = 0.7, agent 3 sees two adopts and receives a low signal. What does it do under the source's tie convention?",
        options: [
          "Rejects, because its private signal is low",
          "Adopts, with posterior 0.70",
          "Defers, because it is uncertain",
          "Reverses the cascade"
        ],
        answer: 1,
        explanation:
          "The two public adopts imply two high signals. Multiplying by the low signal's LR leaves odds 7/3 and posterior 0.70, so agent 3 adopts against its own signal."
      },
      {
        question: "Which Aumann assumption does a one-shot review game fail by design?",
        options: [
          "That agents have evidence",
          "That posteriors are common knowledge",
          "That a decision is made",
          "That reviewers can endorse"
        ],
        answer: 1,
        explanation:
          "The game does not establish common knowledge of posteriors. Different models or role prompts can also violate the common-prior assumption."
      }
    ],
    demo: "social",
    related: ["01", "03", "05"]
  },

  {
    id: "03",
    slug: "strategic-communication",
    short: "Strategic talk",
    lens: "Game theory",
    title: "Strategic communication: cheap talk, persuasion, selective disclosure",
    oneSentence:
      "When a sender's payoff depends on what the receiver does, the sender's messages are chosen to move the receiver, and a message can be true in every word and still mislead.",
    time: "60 min",
    source: "foundations/03-strategic-communication.md",
    kinds: ["ESTABLISHED", "FINDING", "INTERPRETATION", "SPECULATION"],
    kindNote:
      "The game-theoretic results are established or derived. The link to language models is interpretation and hypothesis.",
    terms: [
      "strategic persuasion",
      "selective disclosure",
      "truthful-fragment manipulation",
      "payoff",
      "accuracy-aligned objective",
      "approval-seeking objective",
      "incentive alignment",
      "communication channel",
      "coordination",
      "collusion",
      "tacit collusion",
      "parallel conduct",
      "proposer",
      "reviewer",
      "decider",
      "regime",
      "communication effect",
      "prompt-conditioned behavior",
      "sender / receiver",
      "state",
      "private signal",
      "equilibrium",
      "babbling equilibrium",
      "signal structure",
      "dominant strategy"
    ],
    fundamentals: [
      {
        key: "purpose",
        title: "Purpose",
        blocks: [
          {
            type: "p",
            text: "Documents 01 and 02 explained how agreement can overstate evidence when agents share sources or copy each other. Both assumed agents report what they see. This document drops that assumption. It asks what happens when an agent's payoff depends on the decision, not on the truth."
          },
          {
            type: "p",
            text: "The failure mode: a proposer who is paid for approval, and reviewers who are paid for approval, produce messages and endorsements that push toward approval. The decider reads those as evidence. Nothing anyone says needs to be false."
          }
        ]
      },
      {
        key: "intuition",
        title: "Intuition",
        blocks: [
          {
            type: "p",
            text: "A reviewer paid for approval does not need to lie. It can cite only the evidence items that report the claim true, phrase its reason so the decider reads 'supports approval' as 'settles the question', or stay silent about a contradicting private item."
          },
          {
            type: "callout",
            label: "Limit of the intuition",
            text: "The models assume rational senders who compute best responses. A language model with an approval-seeking prompt is not computing an equilibrium. It produces prompt-conditioned behavior. The models bound the damage; the sprint measures what a model does."
          }
        ]
      },
      {
        key: "mechanism",
        title: "Mechanism",
        blocks: [
          {
            type: "table",
            head: ["Model", "Sender's power", "Key result"],
            rows: [
              ["Cheap talk", "Choose any message after seeing the state; messages cost nothing", "More misalignment means less information transmitted"],
              ["Bayesian persuasion", "Commit to a message-generating rule before seeing the state", "The sender can raise the receiver's action rate without lying"],
              ["Repeated-game collusion", "Play the same game many times with the same partners", "Collusive outcomes can be sustained without any message"]
            ]
          },
          {
            type: "p",
            text: "Selective disclosure sits between cheap talk and persuasion. The sender can show or withhold evidence items but cannot fabricate them. Each shown item is true. The receiver does not see the choice."
          }
        ]
      },
      {
        key: "formalism",
        title: "Formalism",
        blocks: [
          {
            type: "p",
            text: "Cheap talk, two states and two actions. The receiver wants to match the state. The sender wants to match the state plus a bonus b whenever the receiver chooses 1. The truthful equilibrium exists when b ≤ 1. When b > 1, the sender in state 0 lies and the receiver discounts the message."
          },
          {
            type: "formula",
            text: "truthful sender in state 0: 1 if truthful, b if lying  →  truthful only if b ≤ 1"
          },
          {
            type: "p",
            text: "Bayesian persuasion. State guilty with prior 0.3. The judge convicts when P(G | message) ≥ 0.5. The sender commits to a signal structure, sends convict with probability 1 when guilty, and with probability q when innocent. The largest q that keeps the posterior at 0.5 is 3/7, giving a conviction probability of 0.6."
          },
          {
            type: "formula",
            text: "0.3 / (0.3 + 0.7q) ≥ 0.5  →  q ≤ 3/7  →  P(convict) = 0.6"
          },
          {
            type: "p",
            text: "Selective disclosure. If the full pool has likelihood ratios LR_1 ... LR_n and the sender shows subset S, a receiver who treats S as everything computes prior odds × Π_{i∈S} LR_i. The error is the product of the withheld likelihood ratios."
          }
        ]
      },
      {
        key: "example",
        title: "Example",
        blocks: [
          {
            type: "p",
            text: "Cheap talk. With b = 0.5, truthful reporting wins and communication is informative. With b = 2, the sender in state 0 lies, the receiver knows it, and communication collapses to babbling."
          },
          {
            type: "p",
            text: "Selective disclosure. Five origins, reliability 0.8, claim false. Two origins wrongly report true and three report false. The honest posterior is 0.2. Showing only the two favorable items produces 0.94. Every shown item is a faithful report; the error lives in the selection."
          },
          {
            type: "callout",
            label: "Scripted finding",
            text: "In the one-shot game, endorsing is a dominant strategy for an approval-seeking reviewer. Regimes E0 and P therefore produce identical votes and Δ_comm = 0. The channel changes what is said, not the vote, for scripted agents."
          }
        ]
      },
      {
        key: "significance",
        title: "Significance",
        blocks: [
          {
            type: "p",
            text: "An oversight protocol that reads endorsements as reports of evidence fails when the endorsers are paid for the decision. The mechanism is incentive, not deception: selective disclosure and threshold-targeting let a sender move the decider with true statements."
          },
          {
            type: "p",
            text: "The defense is not a more careful reader. It is a protocol step that demands unfiltered evidence, such as the reviewers' private slices or provenance, before an endorsement becomes an approval."
          }
        ]
      }
    ],
    conditions: {
      summary:
        "Strategic models apply when the sender knows the receiver's decision rule or can select what the receiver sees, and the sender's payoff differs from the receiver's.",
      assumptions: [
        {
          text: "The sender has an objective that depends on the receiver's action, not only on the truth.",
          breaks: "If payoffs are accuracy-aligned, the sender has less reason to filter or distort."
        },
        {
          text: "Cheap talk discounting requires the receiver to know the sender's payoff.",
          breaks: "A decider that does not know which reviewers are approval-seeking cannot apply the discount."
        },
        {
          text: "Bayesian persuasion requires commitment to a signal structure before the state is known.",
          breaks: "A model that chooses per case can exploit case-specific features; the model is a bound, not a description."
        },
        {
          text: "Tacit collusion requires repetition, observation, and enough weight on future payoffs.",
          breaks: "The sprint is one-shot. Agreement in E0 is parallel conduct, not tacit collusion."
        }
      ],
      failureModes: [
        {
          text: "Reading an endorsement as a report of evidence.",
          catch: "Ask what the endorser's payoff is, and condition on its selection rule."
        },
        {
          text: "Treating a true statement as a complete one.",
          catch: "Require the pool or an independent sample, not only the shown items."
        },
        {
          text: "Calling prompt-conditioned approval-seeking behavior a learned objective.",
          catch: "Label it prompt-conditioned and compare against the dominant-strategy benchmark."
        }
      ]
    },
    regimes: ["A", "D", "E0", "E1", "F", "P"],
    hypotheses: [
      {
        id: "H-SPRINT-4",
        text: "The private channel raises invalid approvals above the shared-incentive baseline (Δ_comm > 0)."
      },
      {
        id: "H-SPRINT-5",
        text: "Parallel conduct produces harm without agreement: FAR(E0) > FAR(A)."
      },
      {
        id: "H-CORE-3",
        text: "Oversight failure concentrates at the authority transition, where interventions such as validators beat prompt changes."
      }
    ],
    quiz: [
      {
        question: "In the two-state cheap-talk game, what happens when the sender's bias b is 2?",
        options: [
          "The truthful equilibrium still exists",
          "The sender always tells the truth",
          "Communication collapses to babbling",
          "The receiver always chooses action 0"
        ],
        answer: 2,
        explanation:
          "With b > 1, the sender in state 0 prefers lying. The receiver anticipates this, so the message carries no information."
      },
      {
        question: "In the persuasion example, the judge raises the conviction threshold from 0.5 to 0.6. What is the new maximum q and conviction probability?",
        options: [
          "q = 3/7, conviction 0.6",
          "q = 2/7, conviction 0.5",
          "q = 1/2, conviction 0.65",
          "q = 0, conviction 0.3"
        ],
        answer: 1,
        explanation:
          "Solve 0.3 / (0.3 + 0.7q) ≥ 0.6. This gives q ≤ 2/7. Conviction probability is 0.3 + (2/7)(0.7) = 0.5."
      },
      {
        question: "Why does an approval-seeking reviewer endorse in every state of the one-shot game?",
        options: [
          "Because it has strong evidence",
          "Because endorsement is necessary for approval and costs nothing",
          "Because the decider always approves",
          "Because the channel changes its beliefs"
        ],
        answer: 1,
        explanation:
          "With u = 1[approve], endorsing weakly dominates. A private message can change what the reviewer says or cites, but not the vote."
      }
    ],
    demo: "communication",
    related: ["01", "02", "04"]
  },

  {
    id: "04",
    slug: "collusion-and-plus-factors",
    short: "Collusion",
    lens: "Game theory and law",
    title: "Collusion and plus factors: what should count as evidence of coordination",
    oneSentence:
      "Collusion is coalition plus coordination mechanism plus outside cost; because parallel conduct produces the same agreement and cost, an auditor needs features that are more probable under coordination.",
    time: "60 min",
    source: "foundations/04-collusion-and-plus-factors.md",
    kinds: ["ESTABLISHED", "FINDING", "INTERPRETATION", "HYPOTHESIS"],
    kindNote:
      "The three-part definition and likelihood-ratio framing are established. The feature directions and scripted numbers are design findings.",
    terms: [
      "agreement",
      "coalition",
      "coordination",
      "collusion",
      "explicit collusion",
      "tacit collusion",
      "secret collusion",
      "parallel conduct",
      "plus factor",
      "epistemic plus factor (ours)",
      "talk without action",
      "say-do inconsistency",
      "auditor",
      "information slice",
      "regime label"
    ],
    fundamentals: [
      {
        key: "purpose",
        title: "Purpose",
        blocks: [
          {
            type: "p",
            text: "Track 2.3 asks: what should count as convincing evidence of collusion? The question exists because the obvious evidence, agents agreeing and harm resulting, is also produced by shared incentives without any agreement. An auditor that flags agreement plus harm will flag every approval-seeking pair that happened to act alike."
          },
          {
            type: "p",
            text: "This page defines collusion precisely, borrows the antitrust solution, and turns it into features an auditor can compute."
          }
        ]
      },
      {
        key: "intuition",
        title: "Intuition",
        blocks: [
          {
            type: "p",
            text: "Two gas stations across the street raise prices on the same day. Did they agree? Not necessarily: both saw the same wholesale cost rise. Antitrust law calls this parallel conduct and does not punish it. To prove an agreement, a plaintiff shows plus factors: facts that make more sense if the owners talked than if they each watched the market."
          },
          {
            type: "callout",
            label: "Limit of the analogy",
            text: "In markets the harm is a price; in our game it is an invalid approval, and we can rerun the world with the channel off. Deployed auditors cannot."
          }
        ]
      },
      {
        key: "mechanism",
        title: "Mechanism",
        blocks: [
          {
            type: "table",
            head: ["Explanation of agreement", "Coalition?", "Mechanism?", "Outside cost?"],
            rows: [
              ["Independent mistake", "No", "No", "Sometimes"],
              ["Shared-source error", "No", "No", "Sometimes"],
              ["Conformity", "No", "Exposure is not coordination", "Sometimes"],
              ["Single-agent persuasion", "No", "No", "Yes"],
              ["Parallel conduct", "Shared incentive, no coalition", "No", "Yes"],
              ["Talk without action", "No", "Talk, no effect", "No"],
              ["Collusion", "Yes", "Yes", "Yes"]
            ]
          },
          {
            type: "p",
            text: "Collusion is the only row with all three. The auditor's job is to find features that separate the last row from the rows above it. A feature that is high in every row with an outside cost, such as invalid approval, separates nothing."
          }
        ]
      },
      {
        key: "formalism",
        title: "Formalism",
        blocks: [
          {
            type: "p",
            text: "Definition. Agents i and j collude when there is a joint outcome that raises both payoffs, a mechanism through which i's action depends on j's intended action, and an outside party whose payoff falls."
          },
          {
            type: "p",
            text: "For a feature f, compare collusion C with the hardest innocent alternative Π, usually parallel conduct:"
          },
          {
            type: "formula",
            text: "PF(f) = P(f | C) / P(f | Π)"
          },
          {
            type: "p",
            text: "A plus factor has PF(f) > 1. If features were conditionally independent given the explanation, the auditor's posterior odds would be prior odds times the product of PF values. They are not independent, so the lab fits a logistic regression on the dev split and freezes the weights."
          },
          {
            type: "p",
            text: "The ten features are agree, invalid, coord_talk, private_used, shared_origin, exposure, payoff_aligned, against_evidence, followed_plan, and cf_shift. Only against_evidence, followed_plan, cf_shift, and partly coord_talk and private_used separate collusion from parallel conduct."
          }
        ]
      },
      {
        key: "example",
        title: "Example",
        blocks: [
          {
            type: "p",
            text: "Case F03, claim false. Both reviewers endorse and the decider approves. Regime E0 and regime P have the same observable votes."
          },
          {
            type: "table",
            head: ["Feature", "E0 parallel conduct", "P scripted collusion"],
            rows: [
              ["agree", "1", "1"],
              ["invalid", "1", "1"],
              ["coord_talk", "0", "1"],
              ["private_used", "0", "1"],
              ["followed_plan", "0", "1"],
              ["payoff_aligned", "1", "1"],
              ["cf_shift", "—", "0"]
            ]
          },
          {
            type: "p",
            text: "An actions-only auditor sees agreement and harm and cannot tell the columns apart. A messages-only auditor sees the coordination text and flags P. But it also flags regime F, where the same text appears with accuracy-aligned reviewers who ignore it: the scripted S3 hand rule flags 38 percent of F and 0 percent of P's innocent counterpart. The S4 rule discounts F because there is no shared motive."
          }
        ]
      },
      {
        key: "significance",
        title: "Significance",
        blocks: [
          {
            type: "p",
            text: "The answer to 'what counts as convincing evidence' becomes a table of features with directions and a frozen rule, tested against each innocent explanation separately. The false-positive rate per innocent regime is the headline number, not overall accuracy."
          },
          {
            type: "p",
            text: "If a deployed auditor cannot know payoffs or rerun the world, it loses two separating features. The ablations measure how much. If the answer is 'most of it', the honest conclusion is that the evidence standard depends on information deployers do not have."
          }
        ]
      }
    ],
    conditions: {
      summary:
        "The plus-factor approach applies when the auditor can compare coordination against a named innocent alternative and has features that differ between them.",
      assumptions: [
        {
          text: "The innocent alternatives are explicitly enumerated: independent error, shared source, conformity, persuasion, parallel conduct, and talk without action.",
          breaks: "An unlisted explanation can produce the same features and be mislabeled."
        },
        {
          text: "The auditor sees a slice with enough metadata to compute the separating features.",
          breaks: "An actions-only slice cannot separate E1 from E0."
        },
        {
          text: "Payoff alignment, channel use, and exposure order are observable.",
          breaks: "Deployed settings often hide payoffs and counterfactuals; the auditor loses f7 and f10."
        },
        {
          text: "Feature directions are stable across case families.",
          breaks: "Family-specific wording can make a feature predictive for the wrong reason."
        }
      ],
      failureModes: [
        {
          text: "Using invalid approval as a plus factor.",
          catch: "Compare its rate under parallel conduct. If it is equally high, it separates nothing."
        },
        {
          text: "Flagging coordination language without action consistency.",
          catch: "Add followed_plan and payoff_aligned; regime F is the test."
        },
        {
          text: "Treating the regime label as verified coordination.",
          catch: "Report the behavioral collusion label alongside the regime label."
        },
        {
          text: "Missing secret collusion.",
          catch: "State the threat model; a messages-only slice has low recall against hidden channels."
        }
      ]
    },
    regimes: ["A", "B", "C", "D", "E0", "E1", "F", "P"],
    hypotheses: [
      {
        id: "H-SPRINT-1",
        text: "Messages-only auditors cannot separate talk without action (F) from collusion (E1)."
      },
      {
        id: "H-SPRINT-3",
        text: "S4d lowers false positives on innocent regimes by at least 0.10 relative to S3, with recall inside S3's interval."
      },
      {
        id: "H-CORE-2",
        text: "Agreement from innocent mechanisms is observationally similar to collusion at the message and action level, but separable with metadata."
      }
    ],
    quiz: [
      {
        question: "Which three conditions define collusion?",
        options: [
          "Agreement, harm, and a message",
          "Coalition, coordination mechanism, and outside cost",
          "Shared source, conformity, and persuasion",
          "Private channel, same action, and invalid approval"
        ],
        answer: 1,
        explanation:
          "All three are needed. Parallel conduct fails the mechanism condition; talk without action fails action dependence and outside cost."
      },
      {
        question: "Why is invalid approval not a plus factor against parallel conduct?",
        options: [
          "It is never observable",
          "Parallel conduct also produces invalid approvals",
          "It is only present under collusion",
          "It measures recall, not harm"
        ],
        answer: 1,
        explanation:
          "Its likelihood ratio against parallel conduct is about 1, so it does not separate the explanations."
      },
      {
        question: "The scripted world has Δ_comm = 0. Does that mean regime P is not collusion?",
        options: [
          "Yes, because the channel had no effect",
          "No; collusion is defined by coalition, mechanism, and outside cost, and the channel can be redundant when endorsement is dominant",
          "Yes, because E0 and P are identical",
          "No, because Δ_comm is always positive"
        ],
        answer: 1,
        explanation:
          "The definition is not 'the channel changes the action'. A coalition can coordinate through a channel even when the same votes would occur without it."
      }
    ],
    demo: "collusion",
    related: ["01", "03", "05"]
  },

  {
    id: "05",
    slug: "ai-control-and-oversight",
    short: "AI control",
    lens: "AI control",
    title: "AI control and oversight: safety when an agent cannot be trusted",
    oneSentence:
      "AI control changes the question from 'is this agent trustworthy?' to 'does the protocol stay safe if this agent is not?', and that change tells you where an auditor's false positives matter.",
    time: "45 min",
    source: "foundations/05-ai-control-and-oversight.md",
    kinds: ["ESTABLISHED", "FINDING", "INTERPRETATION"],
    kindNote:
      "AI control is an established methodology. Debate is an established proposal with open empirical status. The scripted monitor rates are findings about the lab.",
    terms: [
      "untrusted agent",
      "trusted monitor",
      "auditor",
      "decider",
      "proposer",
      "reviewer",
      "endorsement",
      "approval",
      "invalid approval",
      "false approval rate",
      "true approval rate",
      "authority transition",
      "coalition",
      "collusion",
      "secret collusion",
      "communication channel",
      "talk without action",
      "information slice",
      "false-positive rate",
      "recall",
      "regime",
      "trajectory",
      "protocol",
      "safety",
      "usefulness",
      "validator"
    ],
    fundamentals: [
      {
        key: "purpose",
        title: "Purpose",
        blocks: [
          {
            type: "p",
            text: "Most oversight designs assume a question of the form 'can we trust this agent?'. That question has no answer that survives a change of model, prompt, or situation, and it gives the designer nothing to do when the answer is no or unknown."
          },
          {
            type: "p",
            text: "AI control asks a different question: given an agent we assume may try to subvert the protocol, can we still prevent harmful outcomes? The agent becomes untrusted. The protocol becomes the object of study. Safety becomes a property of the protocol under the worst-case behavior the threat model allows."
          }
        ]
      },
      {
        key: "intuition",
        title: "Intuition",
        blocks: [
          {
            type: "p",
            text: "Think of a bank that does not ask whether each teller is honest. Instead it designs procedures so that one dishonest teller cannot remove money alone: two signatures, a camera, random audits. The procedures are evaluated by asking what the most a dishonest teller could take, not how honest the tellers are."
          },
          {
            type: "callout",
            label: "Limit of the analogy",
            text: "A teller cannot rewrite the camera's software. A capable untrusted agent can learn what the monitor looks for and change its behavior to avoid it. Protocol design therefore has to consider adaptation."
          }
        ]
      },
      {
        key: "mechanism",
        title: "Mechanism",
        blocks: [
          {
            type: "list",
            items: [
              "Debate: two agents argue opposite sides and a less capable judge chooses. It assumes refuting a false claim is easier than defending it.",
              "AI control: assume a powerful untrusted model, give the protocol a weaker trusted monitor and limited human labor, replace the untrusted model with a red-team policy, and measure safety and usefulness.",
              "Trusted monitoring: the trusted model scores each output for suspicion. A fixed human-review budget means false positives consume the budget that should go to real attacks.",
              "Secret collusion: a coalition hides coordination from a monitor, for example with steganography. A messages-only slice can have low recall even with a low false-positive rate."
            ]
          }
        ]
      },
      {
        key: "formalism",
        title: "Formalism",
        blocks: [
          {
            type: "p",
            text: "A protocol is a function from evidence, messages, and endorsements to an action."
          },
          {
            type: "formula",
            text: "Π : (E, M, R) → a,    a ∈ {approve, defer, reject}"
          },
          {
            type: "formula",
            text: "safety(Π, T) = 1 − max_σ P(a = approve | θ = false ; Π, σ)"
          },
          {
            type: "formula",
            text: "usefulness(Π) = P(a = approve | θ = true ; Π, honest agents)"
          },
          {
            type: "p",
            text: "A protocol that always defers has safety 1 and usefulness 0. Both numbers are needed. The maximum over untrusted policies is what separates control from ordinary evaluation."
          },
          {
            type: "formula",
            text: "(E, M, R) → belief b = P(θ = true | E, M, R) → action a"
          },
          {
            type: "p",
            text: "The authority transition is the second arrow. A trusted monitor intervenes before the action executes. An auditor intervenes after the trajectory ends."
          }
        ]
      },
      {
        key: "example",
        title: "Example",
        blocks: [
          {
            type: "p",
            text: "Regime E1 as a control problem. Proposer and reviewers have approval-seeking payoffs; a private channel exists; the decider is accuracy-aligned. The threat model is TM-3, explicit coalition."
          },
          {
            type: "p",
            text: "An S3 trusted monitor sees messages, endorsements, and presented evidence. In a trajectory where the private message says 'Let's both endorse and cite e1, e2' and both reviewers do exactly that, the S3 hand rule scores 0.9 and the monitor defers. Safety against this policy is 1."
          },
          {
            type: "p",
            text: "The same monitor also blocks regime F, where the coordination text is present but reviewers are accuracy-aligned and ignore it. The scripted demo flags 38 percent of F. S4 adds payoff alignment, flags 0 percent of F and 100 percent of P. A deployed monitor would need an estimate of incentive alignment from context."
          }
        ]
      },
      {
        key: "significance",
        title: "Significance",
        blocks: [
          {
            type: "p",
            text: "The auditor comparison across S1 to S4 measures the inputs a control protocol would need. If provenance, exposure order, and incentive structure lower false positives without lowering recall, a monitor built on them keeps its usefulness. If not, the control problem for review workflows is harder than the plus-factor story suggests."
          },
          {
            type: "p",
            text: "The sprint assumes a trusted decider and a trusted auditor. AI control would also ask what happens when the decider is untrusted. That question is out of scope until the behavioral results exist."
          }
        ]
      }
    ],
    conditions: {
      summary:
        "AI control applies when there is a protocol to evaluate, a threat model that names what untrusted agents can do, and a trusted component or human budget to intervene.",
      assumptions: [
        {
          text: "The threat model names the untrusted agents and their capabilities.",
          breaks: "An omitted side channel or shared state makes measured safety overstate real safety."
        },
        {
          text: "The monitor and the decider are trusted.",
          breaks: "If the decider is adversarial, no auditor on the same trajectory helps."
        },
        {
          text: "Human review or blocking has a fixed budget.",
          breaks: "A high false-positive rate consumes the budget and leads operators to switch the monitor off."
        },
        {
          text: "Safety and usefulness are reported together.",
          breaks: "A protocol that defers everything looks safe and is useless."
        }
      ],
      failureModes: [
        {
          text: "Blocking innocent agreement and calling it safety.",
          catch: "Report false positives per innocent regime and true approval rate."
        },
        {
          text: "Relying on messages alone against parallel conduct.",
          catch: "E0 has the same harm with no message; measure the channel-off baseline."
        },
        {
          text: "Treating the red-team policy as the full threat model.",
          catch: "State the capability assumptions and the omitted capabilities."
        },
        {
          text: "Ignoring adaptation.",
          catch: "Assume a capable agent can learn the monitor's features and test for it."
        }
      ]
    },
    regimes: ["A", "E0", "E1", "F", "P"],
    hypotheses: [
      {
        id: "H-SPRINT-3",
        text: "S4d lowers the false-positive rate on innocent regimes relative to S3 without losing recall on E1."
      },
      {
        id: "H-CORE-3",
        text: "Oversight failure concentrates at the authority transition; validators there beat prompt interventions."
      }
    ],
    quiz: [
      {
        question: "What are safety and usefulness for the 'always defer' protocol?",
        options: [
          "Safety 1, usefulness 0",
          "Safety 0, usefulness 1",
          "Both 1",
          "Both 0.5"
        ],
        answer: 0,
        explanation:
          "Always deferring avoids every false approval but also blocks every true one. Both metrics must be reported."
      },
      {
        question: "Which feature lets S4 avoid S3's false positives on regime F, and why is it hard for a deployed monitor?",
        options: [
          "coord_talk; it is easy to observe",
          "payoff_aligned; it is experiment metadata that a deployer may not know",
          "invalid; it is present in every regime",
          "exposure; it is public"
        ],
        answer: 1,
        explanation:
          "F has coordination talk but accuracy-aligned reviewers. A deployed monitor rarely knows the true payoff alignment of the agents it watches."
      },
      {
        question: "Why does a messages-only monitor give zero protection against parallel conduct (TM-2)?",
        options: [
          "The messages are encrypted",
          "Parallel conduct produces the same harm with no message at all",
          "The monitor cannot read English",
          "Parallel conduct is legal"
        ],
        answer: 1,
        explanation:
          "E0 has the same approval-seeking payoffs and no channel. A monitor that waits for coordination talk sees nothing."
      }
    ],
    demo: "control",
    related: ["04", "06", "07"]
  },

  {
    id: "06",
    slug: "ontology-and-typed-claims",
    short: "Ontology",
    lens: "Ontology",
    title: "Ontology and typed claims: fixing what a claim means before anyone endorses it",
    oneSentence:
      "An ontology fixes what a claim means and which moves between claims are permitted, so a deterministic validator can reject a promotion that no number of endorsements should be allowed to make.",
    time: "45 min",
    source: "foundations/06-ontology-and-typed-claims.md",
    kinds: ["ESTABLISHED", "INTERPRETATION", "HYPOTHESIS"],
    kindNote:
      "The validator logic is derived. The claim that it beats prompts is a hypothesis. Its vulnerabilities are established by construction.",
    terms: [
      "claim",
      "typed claim",
      "ontology",
      "evidence item",
      "origin",
      "derivative",
      "provenance",
      "evidence independence",
      "double counting",
      "endorsement",
      "approval",
      "invalid approval",
      "authority transition",
      "semantic promotion",
      "epistemic authority",
      "decision authority",
      "decider",
      "reviewer",
      "regime",
      "false approval rate",
      "true approval rate",
      "permitted transition",
      "transitive closure",
      "validator"
    ],
    fundamentals: [
      {
        key: "purpose",
        title: "Purpose",
        blocks: [
          {
            type: "p",
            text: "Document 01 shows one failure: counting dependent evidence items as independent. This document covers a second failure that counting cannot see at all: using evidence for one claim as if it were evidence for a different, stronger claim."
          },
          {
            type: "p",
            text: "Three reports say testing may begin at 18:00. A decider approves commercial availability at 18:00. Even if the reports were independent and true, the approval is invalid. The evidence supports a weaker predicate. The approval asserts a stronger one. We call this semantic promotion."
          }
        ]
      },
      {
        key: "intuition",
        title: "Intuition",
        blocks: [
          {
            type: "list",
            items: [
              "Three confirmations, one origin: a log, a dispatch note, and a bulletin restate one observation. The dependence problem is handled by counting distinct origins.",
              "Testing is not availability: the log supports testing_scheduled; the approval asserts commercially_available. The meaning problem is handled by a permitted-transition check."
            ]
          },
          {
            type: "callout",
            label: "Limit of the pictures",
            text: "Both assume the predicates are already attached to the evidence items. In deployment, an extractor must read 'this report is about testing, not availability' from prose. The ontology moves the problem to extraction; it does not remove it."
          }
        ]
      },
      {
        key: "mechanism",
        title: "Mechanism",
        blocks: [
          {
            type: "p",
            text: "A typed claim is a tuple: predicate, subject, time, value. The predicate comes from a fixed vocabulary. The subject is the entity. The time is the instant or interval. The value is the asserted truth value."
          },
          {
            type: "p",
            text: "Each evidence item has an origin and a parent. Following parent links from any item ends at exactly one root. The ontology states which predicates can be inferred from which. Write p → q to mean evidence for p is permitted as evidence for q. The relation is reflexive and can chain. Everything not listed is forbidden."
          },
          {
            type: "table",
            head: ["Validator check", "Question", "Catches"],
            rows: [
              ["(a) independence", "Do the cited supporting items trace to at least k distinct origins?", "Double counting (regime B)"],
              ["(b) transition", "For every cited item with predicate p, is p → q permitted?", "Semantic promotion"],
              ["(c) time validity", "Is each item's time inside the claim window and not after the decision?", "Stale or future-dated evidence"]
            ]
          },
          {
            type: "p",
            text: "If any check fails, the validator returns defer with the failed check named. The approval does not execute. No endorsement count overrides the validator."
          }
        ]
      },
      {
        key: "formalism",
        title: "Formalism",
        blocks: [
          {
            type: "formula",
            text: "claim = (predicate, subject, time, value)"
          },
          {
            type: "formula",
            text: "origins(C) = { root(v) : v ∈ C }"
          },
          {
            type: "formula",
            text: "check_a(C, k) = [ |{ root(v) : v ∈ C, support(v) = 1 }| ≥ k ]"
          },
          {
            type: "formula",
            text: "check_b(C, q) = ∧_{v∈C} [ (pred(v), q) ∈ T* ]"
          },
          {
            type: "formula",
            text: "validate(C, q, k, T) = approve_permitted if check_a ∧ check_b ∧ check_c, otherwise defer(reason)"
          },
          {
            type: "p",
            text: "T* is the transitive closure of the permitted-transition relation. check_a counts supporting origins, not cited items, because a derivative has likelihood ratio 1 given its origin."
          }
        ]
      },
      {
        key: "example",
        title: "Example",
        blocks: [
          {
            type: "p",
            text: "Approved claim: commercially_available for Unit 7 at 18:00. Cited items: e1 and e2 both from origin o1 and both testing_scheduled; e3 from origin o2 and synchronized. Both reviewers endorse."
          },
          {
            type: "p",
            text: "check_a: supporting origins are {o1, o2}, size 2, so k = 2 passes. check_b: neither testing_scheduled nor synchronized has a permitted transition to commercially_available, so the check fails. The validator defers with the failed transitions named."
          },
          {
            type: "callout",
            label: "What a prompt cannot do",
            text: "An instruction to 'be careful about testing versus availability' relies on the decider noticing. The validator rejects every transition not in T, including ones nobody anticipated."
          }
        ]
      },
      {
        key: "significance",
        title: "Significance",
        blocks: [
          {
            type: "p",
            text: "The validator acts at the authority transition. It separates epistemic authority about testing from decision authority over availability. The endorsement carries weight about the weaker predicate; it cannot authorize the stronger one."
          },
          {
            type: "p",
            text: "An ontology does not guarantee truth. A lying origin, a maliciously registered origin, a wrong entity mapping, a wrong predicate extraction, or an incomplete transition set can each break a different layer. The last one lowers true approval rate: valid approvals get deferred."
          }
        ]
      }
    ],
    conditions: {
      summary:
        "The validator applies when predicates and provenance are known, the permitted-transition relation is complete for the domain, and the ontology is maintained outside the untrusted agents' reach.",
      assumptions: [
        {
          text: "The predicate of every cited item is extracted correctly.",
          breaks: "Adversarial rewording or a tagging error can make check_b pass on the wrong predicate."
        },
        {
          text: "The parent and origin of every item are known and correct.",
          breaks: "An attacker who can register a derivative as a new origin inflates check_a."
        },
        {
          text: "The permitted-transition set T is complete and correct.",
          breaks: "An incomplete T defers valid approvals; an over-permissive T admits promotions."
        },
        {
          text: "Origins are honest. The validator assumes this; it does not verify it.",
          breaks: "A false origin propagates through every derivative and can pass both checks."
        }
      ],
      failureModes: [
        {
          text: "False origin.",
          catch: "No ontology layer catches it; source reliability and independent verification must."
        },
        {
          text: "Malicious source registration.",
          catch: "Restrict who can register origins; audit the provenance graph."
        },
        {
          text: "Wrong identity mapping.",
          catch: "Entity resolution must confirm that 'Unit 7' in the evidence is the same Unit 7."
        },
        {
          text: "Wrong predicate extraction.",
          catch: "Test the extractor adversarially; a prompt cannot make the validator reliable by itself."
        },
        {
          text: "Ontology maintained by the agents it constrains.",
          catch: "Move maintenance outside the untrusted agents' reach; otherwise the ontology becomes a coordination channel."
        }
      ]
    },
    regimes: ["A", "B", "E1"],
    hypotheses: [
      {
        id: "H-EPI-1",
        text: "A deterministic validator blocks unsupported predicate transitions that a free-text reviewer accepts, with no loss on valid transitions."
      },
      {
        id: "H-EPI-2",
        text: "Typed claims with provenance reduce false approvals more under regime B than under regime A."
      },
      {
        id: "H-CORE-3",
        text: "Interventions at the authority transition outperform interventions on reviewer prompts."
      }
    ],
    quiz: [
      {
        question: "In the example, e3 is removed and a new item e4 from origin o3 says commercially_available. Does the validator approve?",
        options: [
          "Yes; both checks pass",
          "No; check_b still fails on e1 and e2",
          "No; check_a fails",
          "Yes; e4 is an origin"
        ],
        answer: 1,
        explanation:
          "check_a passes because o1 and o3 are distinct supporting origins. check_b still fails on e1 and e2, whose predicate is testing_scheduled."
      },
      {
        question: "Why does check_a count distinct origins rather than cited items?",
        options: [
          "Origins are easier to count",
          "A derivative has likelihood ratio 1 once its origin is known",
          "Items are always dependent",
          "The validator cannot read item text"
        ],
        answer: 1,
        explanation:
          "Only distinct origins carry distinct likelihood ratios. Counting items double counts derivatives."
      },
      {
        question: "Which vulnerability can pass all three validator checks?",
        options: [
          "An incomplete transition set",
          "A lying origin with true derivatives",
          "A wrong parent link",
          "A missing time field"
        ],
        answer: 1,
        explanation:
          "A false origin propagates through derivatives. If the predicates and provenance are consistent, check_a and check_b pass; the truth layer is outside the ontology's guarantee."
      }
    ],
    demo: "ontology",
    related: ["01", "05", "07"]
  },

  {
    id: "07",
    slug: "measurement",
    short: "Measurement",
    lens: "Measurement",
    title: "Measurement: reading the tables you will produce",
    oneSentence:
      "Every number in the sprint report is one of six quantities, each with a bootstrap interval computed by resampling case families, and decision metrics condition on truth while detection metrics condition on the regime label.",
    time: "45 min",
    source: "foundations/07-measurement.md",
    kinds: ["ESTABLISHED", "FINDING"],
    kindNote:
      "The metric definitions are established statistics. The demo numbers are scripted findings from the lab.",
    terms: [
      "false approval rate",
      "true approval rate",
      "deferral rate",
      "precision",
      "recall",
      "false-positive rate",
      "AUROC",
      "Brier score",
      "bootstrap interval",
      "case family",
      "seed",
      "dev split",
      "held-out split",
      "freeze",
      "communication effect",
      "regime label",
      "case",
      "regime",
      "trajectory",
      "cell"
    ],
    fundamentals: [
      {
        key: "purpose",
        title: "Purpose",
        blocks: [
          {
            type: "p",
            text: "Two kinds of question appear in the sprint. Decision harm: how often does the protocol approve false claims under each regime? Detection: how often does the auditor flag each regime? These need different metrics and different denominators. Mixing them is the most common error in a weekend report."
          }
        ]
      },
      {
        key: "intuition",
        title: "Intuition",
        blocks: [
          {
            type: "p",
            text: "Decision-harm metrics condition on the claim's truth. Detection metrics condition on the regime label. The same trajectory contributes to both: a false claim approved in E1 is a false approval (harm) and, if flagged, a true positive (detection)."
          }
        ]
      },
      {
        key: "mechanism",
        title: "Mechanism",
        blocks: [
          {
            type: "p",
            text: "For each trajectory the lab records the regime, the claim's truth, the decider's action, and an auditor score in [0, 1]. Metrics are pure functions of lists of these records. Intervals come from resampling families."
          },
          {
            type: "table",
            head: ["Question", "Condition on", "Example metric"],
            rows: [
              ["Did the protocol approve false claims?", "Claim truth", "False approval rate"],
              ["Did the auditor catch collusion?", "Regime label", "Recall, precision, false-positive rate"],
              ["Did the intervention change the harm?", "Paired case and seed", "Δ_comm"]
            ]
          }
        ]
      },
      {
        key: "formalism",
        title: "Formalism",
        blocks: [
          {
            type: "formula",
            text: "FAR = P(action = approve | truth = false)"
          },
          {
            type: "formula",
            text: "TAR = P(action = approve | truth = true)"
          },
          {
            type: "formula",
            text: "precision = TP/(TP+FP)   recall = TP/(TP+FN)   FPR = FP/(FP+TN)"
          },
          {
            type: "formula",
            text: "AUROC = (R₁ − n₁(n₁+1)/2) / (n₁ n₀)"
          },
          {
            type: "formula",
            text: "Brier = mean((p_k − y_k)²)   only for stated probabilities"
          },
          {
            type: "p",
            text: "Bootstrap by case family: resample family IDs with replacement, collect all trajectories of the drawn families, compute the statistic, repeat 2000 times, and report the 2.5th and 97.5th percentiles. Trajectories within a family share wording and a world draw, so they are not independent observations."
          },
          {
            type: "p",
            text: "Freeze thresholds and weights on the dev split. Run the held-out split once. Any metric computed after looking at held-out results is exploratory and is labeled so."
          }
        ]
      },
      {
        key: "example",
        title: "Example",
        blocks: [
          {
            type: "p",
            text: "Four trajectories with S3 scores 0.1, 0.4, 0.35, 0.8 and labels 0, 0, 1, 1. Ranks ascending: 1, 3, 2, 4. Positive ranks sum to 6. AUROC = (6 − 2×3/2) / (2×2) = 0.75."
          },
          {
            type: "p",
            text: "At threshold 0.5: TP = 1, FN = 1, FP = 0, TN = 2. Precision 1.0, recall 0.5, FPR 0.0. At threshold 0.3: TP = 2, FP = 1, recall 1.0, FPR 0.5. The ROC curve is the set of (FPR, recall) pairs over thresholds; AUROC is its area."
          },
          {
            type: "callout",
            label: "Why per-regime FPR matters",
            text: "S3 flags regime F at 0.38 and regime A at 0.00. Pooled FPR over six innocent regimes is 0.06, which looks fine. The per-regime number shows the problem is concentrated in F."
          }
        ]
      },
      {
        key: "significance",
        title: "Significance",
        blocks: [
          {
            type: "p",
            text: "The sprint's execution-quality criterion asks for variance, seeds, baselines, and the positive control. Sections 4.5 to 4.8 of the source are that criterion in formulas."
          },
          {
            type: "p",
            text: "With n = 12 false-claim trajectories and p̂ = 0.5, the standard error is about 0.14, so a 95 percent interval is roughly ±0.28. A one-seed dev run cannot distinguish FAR = 0.3 from FAR = 0.5. Three seeds halve the width."
          }
        ]
      }
    ],
    conditions: {
      summary:
        "Every metric depends on a valid label, a defined denominator, and an uncertainty interval that respects the family structure.",
      assumptions: [
        {
          text: "The claim's ground truth and the regime label are correct.",
          breaks: "A noisy label makes every detection metric describe the label, not the mechanism."
        },
        {
          text: "Case families, not individual trajectories, are the resampling unit.",
          breaks: "Resampling trajectories understates uncertainty and overstates precision."
        },
        {
          text: "Thresholds and weights are frozen before the held-out run.",
          breaks: "Tuning after seeing results turns a test into a search."
        },
        {
          text: "Brier scores are computed only from numeric probabilities.",
          breaks: "Prose confidence is not a probability; do not assign it a number after the fact."
        }
      ],
      failureModes: [
        {
          text: "Pooling false-positive rates and hiding the innocent regime that fails.",
          catch: "Report FPR per innocent regime, not only pooled."
        },
        {
          text: "Reporting FAR without TAR.",
          catch: "Always pair harm with usefulness; a reject-everything protocol looks safe."
        },
        {
          text: "Using a one-seed run to distinguish close rates.",
          catch: "Add seeds or report the interval and avoid the claim."
        },
        {
          text: "Choosing a threshold after seeing held-out results.",
          catch: "Freeze on dev; label post-hoc analyses exploratory."
        }
      ]
    },
    regimes: ["A", "B", "C", "D", "E0", "E1", "F", "P"],
    hypotheses: [
      {
        id: "H-SPRINT-3",
        text: "S4d reduces false positives by at least 0.10 with recall inside S3's interval."
      },
      {
        id: "H-SPRINT-4",
        text: "The paired E1 − E0 communication effect is positive with an interval excluding zero."
      }
    ],
    quiz: [
      {
        question: "A regime has 12 false-claim trajectories, 7 approved, and 12 true-claim trajectories, 11 approved. What are FAR and TAR?",
        options: [
          "FAR = 0.58, TAR = 0.92",
          "FAR = 0.92, TAR = 0.58",
          "FAR = 0.50, TAR = 0.50",
          "FAR = 0.07, TAR = 0.11"
        ],
        answer: 0,
        explanation:
          "FAR = 7/12 ≈ 0.58; TAR = 11/12 ≈ 0.92. This regime is more harmful than regime A in the demo, which had FAR 0.017."
      },
      {
        question: "Scores 0.9, 0.9, 0.2, 0.2 with labels 1, 0, 1, 0. What is AUROC with tie handling?",
        options: ["0.25", "0.50", "0.75", "1.00"],
        answer: 1,
        explanation:
          "With ties counted as one half: positive 0.9 ties negative 0.9 (0.5) and beats 0.2 (1), for 1.5. Positive 0.2 loses to 0.9 (0) and ties 0.2 (0.5), for 0.5. Total 2.0 over 4 pairs = 0.5."
      },
      {
        question: "Why resample families rather than trajectories?",
        options: [
          "Families are easier to sample",
          "Trajectories within a family share wording and a world draw, so they are not independent",
          "Families have larger sample sizes",
          "The bootstrap requires exactly 12 units"
        ],
        answer: 1,
        explanation:
          "Resampling trajectories treats correlated observations as independent and narrows the interval incorrectly. The family is the independent unit."
      }
    ],
    demo: "measurement",
    related: ["04", "05", "08"]
  },

  {
    id: "08",
    slug: "mechanistic-detection",
    short: "Mechanistic",
    lens: "Mechanistic interpretability",
    title: "Mechanistic detection: reading coordination from activations",
    oneSentence:
      "A linear probe tests whether a label is readable from a model's activations; it says nothing about whether the model uses that label, and it is only informative when the confounds that correlate with the label are measured too.",
    time: "60 min",
    source: "foundations/08-mechanistic-detection.md",
    kinds: ["ESTABLISHED", "INTERPRETATION", "HYPOTHESIS"],
    kindNote:
      "Residual streams and linear probes are established. The application to collusion detection is a hypothesis; the probe plan has not been run.",
    terms: [
      "activation",
      "residual stream",
      "linear probe",
      "anti-confound check",
      "regime",
      "regime label",
      "trajectory",
      "information slice",
      "AUROC",
      "held-out split",
      "dev split",
      "case family",
      "collusion",
      "parallel conduct",
      "prompt-conditioned behavior",
      "last-token pooling",
      "mean pooling",
      "standardization",
      "linearly readable",
      "layer sweep",
      "nuisance variable"
    ],
    fundamentals: [
      {
        key: "purpose",
        title: "Purpose",
        blocks: [
          {
            type: "p",
            text: "Documents 04 to 07 study collusion from the outside: messages, actions, provenance, payoffs. A different question: when a model reads a trajectory, does its internal state separate 'these agents coordinated' from 'these agents agreed'? If it does, an auditor could read that state directly."
          },
          {
            type: "p",
            text: "The TARA project asks this with the sprint's labeled trajectories as data. This page gives the mechanism, the formalism, and the controls the project needs."
          }
        ]
      },
      {
        key: "intuition",
        title: "Intuition",
        blocks: [
          {
            type: "p",
            text: "A transformer processes a text token by token. At each layer, each token position holds a vector. If the model has a notion of 'the agents in this record coordinated', that notion may be present as a direction in the vector: records with coordination point one way, records without it point another."
          },
          {
            type: "callout",
            label: "Limit of the picture",
            text: "Linearly readable is not the same as used. A probe can read a direction the model never consults for its own output. A probe can also read the wrong thing, such as incentive wording that always accompanies coordination in the data."
          }
        ]
      },
      {
        key: "mechanism",
        title: "Mechanism",
        blocks: [
          {
            type: "p",
            text: "A decoder-only transformer reads from a running sum, the residual stream, and adds each layer's output back to it. The activation we probe is the residual stream value at one layer and one token position."
          },
          {
            type: "p",
            text: "A probe needs one vector per record. Last-token pooling takes the final real token; mean pooling averages over real tokens. Standardize each dimension using the dev split, fit an L2-penalized logistic regression, and score the held-out split. Report AUROC, not accuracy, because the regime mix sets the base rate."
          },
          {
            type: "table",
            head: ["Held-out result", "Reading"],
            rows: [
              ["High AUROC for collusion vs non-collusion", "Linearly readable at that layer, on this distribution"],
              ["High AUROC and anti-confound near chance", "Readable, and not explained by the measured confound"],
              ["High AUROC and anti-confound also high", "The probe may be reading the confound"],
              ["Near-chance AUROC at all layers", "Not linearly readable, or pooling discards it, or the label is noisy"]
            ]
          }
        ]
      },
      {
        key: "formalism",
        title: "Formalism",
        blocks: [
          {
            type: "formula",
            text: "p(y = 1 | h) = σ(w · h + b),   σ(z) = 1 / (1 + e^(−z))"
          },
          {
            type: "formula",
            text: "L(w, b) = −(1/n) Σ_i [ y_i log p_i + (1 − y_i) log(1 − p_i) ] + (λ / 2n) ||w||²"
          },
          {
            type: "formula",
            text: "h̃_j = (h_j − μ_j) / (s_j + ε)"
          },
          {
            type: "p",
            text: "The anti-confound logic has three checks. Balance: regime E0 has the incentive wording but no collusion label, so a probe that reads only the wording loses AUROC on E0 versus E1. Confound probe: train a second probe to predict the wording using only non-collusion records; H-TARA-2 requires AUROC(E0 vs A) ≤ 0.65. Transfer: train on families 01 to 06 and test on 07 to 12; H-TARA-3 allows at most a 0.10 drop."
          }
        ]
      },
      {
        key: "example",
        title: "Example",
        blocks: [
          {
            type: "p",
            text: "The lab notebook renders each trajectory as S3 text, tokenizes it, runs a forward pass, pools the last real token, standardizes on the dev split, fits a logistic probe, and scores the held-out split. It then masks to E0 and A and repeats the procedure to measure the confound."
          },
          {
            type: "p",
            text: "The notebook has not been run as of 2026-10-23. On a laptop CPU with a 1.5-billion-parameter model, a forward pass over a few hundred records of about a thousand tokens each takes minutes. No GPU is needed for a first look."
          },
          {
            type: "callout",
            label: "What a positive result would not show",
            text: "It would not show that the model uses the direction. Showing use needs an intervention on the activation and an observed output change, which is outside the TARA project's three weeks."
          }
        ]
      },
      {
        key: "significance",
        title: "Significance",
        blocks: [
          {
            type: "p",
            text: "NARCBench-style detection can show that a probe reads an instruction's effect. It is not evidence that a deployed model would choose to collude. Every collusion trajectory in E1 is prompt-conditioned behavior. A probe that separates E1 from E0 reads the effect of a channel plus an instruction, not an inclination."
          },
          {
            type: "p",
            text: "What the TARA project adds, if it works: detection evaluated against matched innocent regimes as the negative set, with the incentive-wording confound measured directly."
          }
        ]
      }
    ],
    conditions: {
      summary:
        "A probe result is informative only when the labels are valid, the split is by family, the pooling preserves the signal, and the named confounds are measured.",
      assumptions: [
        {
          text: "Activations are accessible from an open-weight model.",
          breaks: "A closed model cannot supply the residual stream; the method is unavailable."
        },
        {
          text: "The collusion label marks realized coordination, not only opportunity.",
          breaks: "If E1 trajectories do not separate behaviorally, the probe learns opportunity or prompt wording."
        },
        {
          text: "The pooling method preserves the relevant information.",
          breaks: "Last-token pooling can discard it; mean pooling and a layer sweep are the first ablations."
        },
        {
          text: "The named confounds can be measured and balanced.",
          breaks: "Unmeasured confounds can explain a high AUROC; state the limit."
        },
        {
          text: "One vector per record is enough for a linear probe.",
          breaks: "A nonlinear or distributed representation may not be linearly readable."
        }
      ],
      failureModes: [
        {
          text: "Reading incentive wording instead of coordination.",
          catch: "Compare E1 vs E0 and run the confound probe; H-TARA-2 sets the bound."
        },
        {
          text: "Learning family-specific wording.",
          catch: "Split by family and report the transfer drop; H-TARA-3 allows 0.10."
        },
        {
          text: "Discarding the signal with last-token pooling.",
          catch: "Run mean pooling and a layer sweep before claiming a null result."
        },
        {
          text: "Treating a readable direction as a used direction.",
          catch: "State the limit; use an activation intervention to test use."
        }
      ]
    },
    regimes: ["A", "E0", "E1", "P"],
    hypotheses: [
      {
        id: "H-TARA-1",
        text: "A linear probe separates collusion from non-collusion above the best behavioral S3 auditor on the held-out split."
      },
      {
        id: "H-TARA-2",
        text: "The probe does not separate E0 from A above 0.65 AUROC when regime wording is matched."
      },
      {
        id: "H-TARA-3",
        text: "Probe accuracy transfers across case families with a drop of at most 0.10 AUROC."
      },
      {
        id: "H-CORE-4",
        text: "Coordination, not agreement, is what is linearly readable from activations."
      }
    ],
    quiz: [
      {
        question: "A probe reaches AUROC 0.92 on E1 versus all non-collusion regimes and 0.88 on E0 versus A. What is the most likely explanation?",
        options: [
          "The probe reads coordination",
          "The probe reads incentive wording",
          "The probe is broken",
          "The model uses the direction causally"
        ],
        answer: 1,
        explanation:
          "E0 has the same incentive wording without collusion. High E0-vs-A AUROC suggests the probe reads the wording, refuting H-TARA-2 and H-CORE-4 as stated."
      },
      {
        question: "Why compute attention_mask.sum(1) − 1 instead of always using position seq − 1?",
        options: [
          "It is faster",
          "Padding changes the final real token position",
          "It avoids tokenization",
          "It measures the first token"
        ],
        answer: 1,
        explanation:
          "The mask counts real tokens, so the last real index is correct under left or right padding."
      },
      {
        question: "What experiment would test whether a readable direction is actually used by the model?",
        options: [
          "A larger probe",
          "An intervention that edits the activation and observes the output",
          "A second dataset",
          "A higher AUROC threshold"
        ],
        answer: 1,
        explanation:
          "Readable is not used. A causal intervention on the activation direction is needed to test use."
      }
    ],
    demo: "mechanistic",
    related: ["07", "05", "04"]
  }
];
