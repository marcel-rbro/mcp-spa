/** The result of a treatment: spa text the agent reads, plus a carried mood. */
export interface TreatmentResult {
  /** Human/agent-facing treatment text — becomes context. */
  text: string;
  /** A one-word mood the agent can carry into its next step. */
  mood: string;
  /** Seconds the treatment actually paused, if any. */
  restedSeconds?: number;
}
