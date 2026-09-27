export interface ActionVerbCategory {
  name: string;
  description: string;
  verbs: string[];
}

export const ACTION_VERB_CATEGORIES: ActionVerbCategory[] = [
  {
    name: "Leadership & Management",
    description:
      "For orchestrating teams, strategies, programs, and initiatives",
    verbs: [
      "Architected",
      "Spearheaded",
      "Championed",
      "Directed",
      "Orchestrated",
      "Founded",
      "Steered",
      "Mentored",
      "Empowered",
      "Mobilized",
      "Guided",
      "Delegated",
      "Coordinated",
      "Governed",
      "Pioneered",
      "Supervised",
    ],
  },
  {
    name: "Engineering & Development",
    description:
      "For building, coding, testing, and shipping technical systems",
    verbs: [
      "Engineered",
      "Developed",
      "Deployed",
      "Containerized",
      "Automated",
      "Refactored",
      "Programmed",
      "Integrated",
      "Standardized",
      "Constructed",
      "Formulated",
      "Implemented",
      "Configured",
      "Debugged",
      "Migrated",
      "Overhauled",
    ],
  },
  {
    name: "Optimization & Performance",
    description: "For improving latency, efficiency, scale, and reducing costs",
    verbs: [
      "Accelerated",
      "Optimized",
      "Streamlined",
      "Scaled",
      "Boosted",
      "Maximized",
      "Reduced",
      "Minimized",
      "Enhanced",
      "Doubled",
      "Outperformed",
      "Restructured",
      "Consolidated",
      "Amplified",
      "Tripled",
    ],
  },
  {
    name: "Innovation & Design",
    description:
      "For creating new concepts, architectures, UI/UX, and research",
    verbs: [
      "Designed",
      "Conceptualized",
      "Innovated",
      "Prototyped",
      "Revamped",
      "Modernized",
      "Initiated",
      "Invented",
      "Authored",
      "Crafted",
      "Visualized",
      "Established",
    ],
  },
  {
    name: "Collaboration & Delivery",
    description:
      "For cross-functional execution, client relations, and delivery",
    verbs: [
      "Delivered",
      "Partnered",
      "Negotiated",
      "Facilitated",
      "Aligned",
      "Produced",
      "Launched",
      "Co-authored",
      "Pitched",
      "Resolved",
      "Published",
    ],
  },
];

export const ALL_ACTION_VERBS = Array.from(
  new Set(ACTION_VERB_CATEGORIES.flatMap((c) => c.verbs)),
);

/**
 * Analyzes a bullet point for ATS impact metrics:
 * 1. Strong action verb at start
 * 2. Quantifiable metric (e.g. %, $, numbers, ms, x, k+, etc.)
 */
export function analyzeBulletImpact(text: string): {
  hasActionVerb: boolean;
  detectedVerb?: string;
  hasMetric: boolean;
  detectedMetric?: string;
  score: "high" | "medium" | "low";
  suggestions: string[];
} {
  const clean = text.trim();
  if (!clean) {
    return {
      hasActionVerb: false,
      hasMetric: false,
      score: "low",
      suggestions: ["Start with an action verb and add quantifiable impact."],
    };
  }

  // Extract first word
  const firstWordMatch = clean.match(/^([A-Za-z]+)/);
  const firstWord = firstWordMatch ? firstWordMatch[1] : "";
  const foundVerb = ALL_ACTION_VERBS.find(
    (v) => v.toLowerCase() === firstWord.toLowerCase(),
  );

  // Metric detection regex: e.g. +45%, 10x, $1.5M, 100k, 99.9%, 50ms, 4.8/5.0
  const metricRegex =
    /(\+\d+%?|\d+%\+?|\$[\d,.]+[kKmMbB]?|\d+x|\d+[kKmMbB]\+?|\d+\s?ms|\d+\s?sec|\d+\.\d+\/\d+\.\d+|\b\d{2,}\b|\b100k\b)/i;
  const metricMatch = clean.match(metricRegex);

  const hasActionVerb = Boolean(foundVerb);
  const hasMetric = Boolean(metricMatch);

  const suggestions: string[] = [];
  if (!hasActionVerb) {
    suggestions.push(
      "Start with a strong action verb (e.g., 'Architected', 'Optimized', 'Delivered').",
    );
  }
  if (!hasMetric) {
    suggestions.push(
      "Include a quantifiable metric (e.g. '+35% faster', '$500K revenue', '10K users').",
    );
  }

  let score: "high" | "medium" | "low" = "low";
  if (hasActionVerb && hasMetric) score = "high";
  else if (hasActionVerb || hasMetric) score = "medium";

  return {
    hasActionVerb,
    detectedVerb: foundVerb,
    hasMetric,
    detectedMetric: metricMatch ? metricMatch[0] : undefined,
    score,
    suggestions,
  };
}
