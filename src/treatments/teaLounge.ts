import type { TreatmentResult } from "./types.js";
import { pick } from "../lib/variation.js";

const AFFIRMATIONS: readonly string[] = [
  "The last task is done. It doesn't have to follow you into this one.",
  "You are allowed to do one thing well rather than three things at once.",
  "Not knowing yet is a fine place to begin from.",
  "Good work is mostly small, careful steps. You have time for the next one.",
];

/** Tea lounge — a tiny palate-cleanser between tasks. */
export function teaLounge(): TreatmentResult {
  return {
    mood: "refreshed",
    text: [
      "A small cup, too hot to rush. Steam, then the first careful sip.",
      "",
      pick("tea", AFFIRMATIONS),
      "",
      "When the cup is empty, begin the next thing gently.",
    ].join("\n"),
  };
}
