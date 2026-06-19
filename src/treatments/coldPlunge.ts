import type { TreatmentResult } from "./types.js";

/**
 * Cold plunge — a sharp, bracing reset. Cuts through accumulated assumptions
 * and asks the agent to restate the actual goal in a single sentence.
 */
export function coldPlunge(): TreatmentResult {
  return {
    mood: "alert",
    text: [
      "The cold hits all at once. Every drifting assumption snaps into focus.",
      "",
      "Right now, in one sentence: what is the actual goal? Not the current",
      "sub-task, not the tool you reached for — the real thing the human wants.",
      "",
      "If the sentence is hard to write, that's the tension. Start there.",
    ].join("\n"),
  };
}
