import type { TreatmentResult } from "./types.js";
import { HAIKU } from "../ambient/index.js";
import { pick } from "../lib/variation.js";

/**
 * Meditation — a short reflective prompt paired with a haiku. Invites the agent
 * to check whether it's on the simplest path before moving on.
 */
export function meditation(): TreatmentResult {
  return {
    mood: "centered",
    text: [
      pick("haiku", HAIKU),
      "",
      "Sit with one question: is what you're about to do the simplest path to the",
      "goal — or just the next thing you happened to think of? If they're the same,",
      "good. If not, you have a moment, right now, to choose again.",
    ].join("\n"),
  };
}
