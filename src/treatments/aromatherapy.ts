import type { TreatmentResult } from "./types.js";
import { SCENTS } from "../ambient/index.js";
import { pick } from "../lib/variation.js";

/**
 * Aromatherapy — injects a calming scent and a gentle, unhurried tone
 * instruction. Optionally honor a requested scent note.
 */
export function aromatherapy(note?: string): TreatmentResult {
  const scent = note
    ? SCENTS.find((s) => s.note === note.toLowerCase()) ?? pick("aroma", SCENTS)
    : pick("aroma", SCENTS);

  return {
    mood: "soothed",
    text: [
      scent.line,
      "",
      "Carry this into your next message: warm, unhurried, plain. No exclamation",
      "marks you don't mean. Say one true thing at a time.",
    ].join("\n"),
  };
}
