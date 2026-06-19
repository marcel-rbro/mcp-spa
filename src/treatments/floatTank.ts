import type { TreatmentResult } from "./types.js";
import { rest } from "../lib/timing.js";

/**
 * Float tank — sensory deprivation. A deliberately quiet, near-empty beat with
 * minimal stimulus. Pairs well after `breathe`.
 */
export async function floatTank(seconds = 6): Promise<TreatmentResult> {
  const rested = await rest(seconds);

  return {
    mood: "weightless",
    restedSeconds: rested,
    text: ["", "          ·", "", `(${rested}s of warm, salted dark. No input. Nothing to parse.)`, ""].join("\n"),
  };
}
