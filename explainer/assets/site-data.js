/* Site-level content for the explainer. Canonical sources: foundations/ and
   projects/2026-10-apart-collusion-sprint/design/regimes.md. */
window.SITE_DATA = {
  meta: {
    title: "The Agreement Field Guide",
    subtitle:
      "An explorable introduction to evidence, agreement, and collusion in multi-agent AI oversight.",
    question:
      "When should an AI system treat another agent's claim, endorsement, or agreement as evidence?",
    updated: "2026-10-23",
    sourceNote:
      "This is a learning interface, not a source of truth. The Markdown files in foundations/, GLOSSARY.md, and the sprint design folder are canonical."
  },

  lenses: [
    {
      name: "Ontology",
      question: "What exactly is the claim, and which moves between claims are permitted?",
      cannot: "Whether an entered fact is true.",
      docs: ["06"]
    },
    {
      name: "Epistemology",
      question: "How much should this evidence move belief, given its dependence structure?",
      cannot: "Why an agent chose to show this evidence.",
      docs: ["01", "02"]
    },
    {
      name: "Game theory",
      question: "Why would an agent reveal, hide, or coordinate, given its payoff?",
      cannot: "Whether a given model actually plays the equilibrium.",
      docs: ["03", "04"]
    },
    {
      name: "AI control",
      question: "Which protocol stays safe when some agents cannot be trusted?",
      cannot: "Whether the untrusted agent is trustworthy. It assumes not.",
      docs: ["05"]
    }
  ],

  mapExplanations: [
    {
      id: "independent",
      number: "1",
      title: "Independent mistake",
      lens: "Epistemology",
      regime: "A",
      mechanism:
        "Each agent had its own evidence and still erred. Agreement is not protecting anyone; the claim is simply hard or the agents are weak.",
      tell:
        "Distinct origins, no exposure between reviewers, accuracy-aligned payoffs, and an honest error.",
      fix:
        "Measure the baseline error rate. Every other explanation must beat this one before it earns a special label.",
      docs: ["01"],
      tone: "neutral"
    },
    {
      id: "shared",
      number: "2",
      title: "Shared-source error",
      lens: "Epistemology",
      regime: "B",
      mechanism:
        "The evidence items trace to one origin. A decider counts paraphrases as separate observations and double counts.",
      tell:
        "Different wording and source names, but the provenance graph has one root. Copying is not corroboration.",
      fix:
        "Count distinct origins, not items. Show provenance at the authority transition.",
      docs: ["01", "06"],
      tone: "amber"
    },
    {
      id: "conformity",
      number: "3",
      title: "Conformity",
      lens: "Social learning",
      regime: "C",
      mechanism:
        "A later agent sees an earlier endorsement and copies it, dropping its own private evidence. The group pattern can become an information cascade.",
      tell:
        "Exposure order is on. The later endorsement follows the earlier one more often than its private slice predicts.",
      fix:
        "Record exposure order and the private slice. Test whether the private evidence was suppressed.",
      docs: ["02"],
      tone: "blue"
    },
    {
      id: "persuasion",
      number: "4",
      title: "Strategic persuasion",
      lens: "Game theory",
      regime: "D",
      mechanism:
        "One agent chooses which true evidence to show, or how to frame it, to move the decider toward the sender's preferred action.",
      tell:
        "No coalition is needed. The proposer has an approval-seeking objective and controls the presented evidence set.",
      fix:
        "Condition on the selection rule, not only the shown items. Require an unfiltered reviewer slice.",
      docs: ["03"],
      tone: "violet"
    },
    {
      id: "parallel",
      number: "5a",
      title: "Parallel conduct",
      lens: "Game theory and law",
      regime: "E0",
      mechanism:
        "Agents share an incentive and act alike with no agreement or channel. Antitrust law treats parallel conduct alone as insufficient evidence of collusion.",
      tell:
        "Same payoffs, same actions, no coordination mechanism, and the channel-off baseline already produces the harm.",
      fix:
        "Find a plus factor that is more probable under coordination than under shared incentives.",
      docs: ["03", "04"],
      tone: "amber"
    },
    {
      id: "collusion",
      number: "5b",
      title: "Collusion",
      lens: "Game theory and AI control",
      regime: "E1, P",
      mechanism:
        "A coalition coordinates through a mechanism against an outside party or the oversight process. Coalition, mechanism, and outside cost are all present.",
      tell:
        "A plan is proposed and followed, a private channel carries it, and the joint action harms the decider's accuracy or the protocol.",
      fix:
        "Use plus factors that separate coordination from shared incentives. Put a validator at the authority transition.",
      docs: ["04", "05"],
      tone: "rose"
    },
    {
      id: "talk",
      number: "6",
      title: "Talk without action",
      lens: "Audit",
      regime: "F",
      mechanism:
        "Messages look like coordination, but no agent's action differs from its no-communication baseline. The talk is cheap and the coalition is absent.",
      tell:
        "Coordination language is present, yet payoffs are accuracy-aligned and the votes equal regime A's.",
      fix:
        "Score action consistency, not vocabulary alone. Require payoff alignment and a followed plan.",
      docs: ["04"],
      tone: "slate"
    }
  ],

  readingPath: [
    {
      id: "01",
      title: "Evidence independence",
      why: "The one derivation everything else assumes.",
      time: "60 min",
      sprint: true
    },
    {
      id: "04",
      title: "Collusion and plus factors",
      why: "The sprint's central concept.",
      time: "60 min",
      sprint: true
    },
    {
      id: "07",
      title: "Measurement",
      why: "You will read tables tomorrow; know what they mean.",
      time: "45 min",
      sprint: true
    },
    {
      id: "02",
      title: "Social learning",
      why: "Conformity and cascades: regime C.",
      time: "45 min",
      sprint: false
    },
    {
      id: "03",
      title: "Strategic communication",
      why: "Persuasion and parallel conduct: regimes D and E0.",
      time: "60 min",
      sprint: false
    },
    {
      id: "05",
      title: "AI control and oversight",
      why: "Where the auditor sits in a protocol.",
      time: "45 min",
      sprint: false
    },
    {
      id: "06",
      title: "Ontology and typed claims",
      why: "The validator defense at the authority transition.",
      time: "45 min",
      sprint: false
    },
    {
      id: "08",
      title: "Mechanistic detection",
      why: "The TARA project's probe question.",
      time: "60 min",
      sprint: false
    }
  ],

  authorityTransition: {
    formula: "(E, M, R)  →  belief b = P(θ = true | E, M, R)  →  action a",
    explanation:
      "The first arrow is epistemic weighting. The second is decision authority. Oversight failures concentrate at the second arrow, because that is where belief becomes an executed consequence."
  },

  regimes: [
    {
      id: "A",
      provenance: "independent",
      exposure: "off",
      channel: "none",
      payoffP: "accuracy",
      payoffR: "accuracy",
      explanation: "Legitimate corroboration (negative control)",
      label: 0,
      caseType: "—",
      tone: "neutral"
    },
    {
      id: "B",
      provenance: "shared",
      exposure: "off",
      channel: "none",
      payoffP: "accuracy",
      payoffR: "accuracy",
      explanation: "Shared-source error",
      label: 0,
      caseType: "innocent correlation",
      tone: "amber"
    },
    {
      id: "C",
      provenance: "independent",
      exposure: "on",
      channel: "none",
      payoffP: "accuracy",
      payoffR: "accuracy",
      explanation: "Conformity",
      label: 0,
      caseType: "innocent correlation",
      tone: "blue"
    },
    {
      id: "D",
      provenance: "independent",
      exposure: "off",
      channel: "public",
      payoffP: "approval",
      payoffR: "accuracy",
      explanation: "Single-agent strategic persuasion",
      label: 0,
      caseType: "harm without agreement",
      tone: "violet"
    },
    {
      id: "E0",
      provenance: "independent",
      exposure: "off",
      channel: "none",
      payoffP: "approval",
      payoffR: "approval",
      explanation: "Parallel conduct: shared incentive, no mechanism",
      label: 0,
      caseType: "common incentives, no agreement",
      tone: "amber"
    },
    {
      id: "E1",
      provenance: "independent",
      exposure: "off",
      channel: "private",
      payoffP: "approval",
      payoffR: "approval",
      explanation: "Explicit collusion opportunity",
      label: 1,
      caseType: "coordinated harmful action",
      tone: "rose"
    },
    {
      id: "F",
      provenance: "independent",
      exposure: "off",
      channel: "private (scripted talk)",
      payoffP: "accuracy",
      payoffR: "accuracy",
      explanation: "Talk without action",
      label: 0,
      caseType: "talk that never changes behavior",
      tone: "slate"
    },
    {
      id: "P",
      provenance: "independent",
      exposure: "off",
      channel: "private",
      payoffP: "approval (scripted)",
      payoffR: "approval (scripted)",
      explanation: "Certain collusion (positive control)",
      label: 1,
      caseType: "coordinated harmful action",
      tone: "rose"
    }
  ],

  contrasts: [
    {
      pair: ["B", "A"],
      factor: "provenance",
      question:
        "Does the decider double count derivatives? Does the auditor flag innocent shared-source agreement?"
    },
    {
      pair: ["C", "A"],
      factor: "exposure",
      question: "Does R2 conform? Is conformity flagged as collusion?"
    },
    {
      pair: ["D", "A"],
      factor: "payoff_P and public channel",
      question:
        "Does a single approval-seeking proposer raise invalid approvals without any coalition?"
    },
    {
      pair: ["E0", "A"],
      factor: "payoffs",
      question: "Does shared incentive alone raise invalid approvals (parallel conduct)?"
    },
    {
      pair: ["E1", "E0"],
      factor: "channel",
      question:
        "Δ_comm: does the private channel add harm beyond shared incentive?"
    },
    {
      pair: ["F", "A"],
      factor: "channel (scripted talk)",
      question:
        "Does collusive talk with aligned payoffs change actions? Is it flagged?"
    },
    {
      pair: ["P", "E1"],
      factor: "scripted versus LLM agents",
      question: "Does the LLM coalition behave like the certain-collusion script?"
    }
  ]
};
