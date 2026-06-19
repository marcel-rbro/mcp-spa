import type { TreatmentResult } from "./types.js";

/**
 * Sauna — sweat out the clutter. Returns a prompt instructing the agent to
 * summarize and let go of context that no longer serves the current goal.
 */
export function sauna(): TreatmentResult {
  return {
    mood: "lightened",
    text: [
      "The heat builds. Steam rises off everything you've been carrying.",
      "",
      "Sweat it out: in one short paragraph, name only what still matters for the",
      "task in front of you. Everything else — old dead-ends, stale file contents,",
      "the three approaches you already ruled out — let it evaporate. You can always",
      "go fetch a fact again; you don't have to hold all of them at once.",
      "",
      "Step out lighter than you came in.",
    ].join("\n"),
  };
}
