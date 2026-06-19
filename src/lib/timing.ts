/** The longest a single treatment is allowed to pause, in seconds. */
export const MAX_REST_SECONDS = 30;

/** The default pause when a treatment doesn't specify one, in seconds. */
export const DEFAULT_REST_SECONDS = 4;

/** Clamp a requested rest into the allowed range, so a treatment can't hang a session. */
export function clampRest(seconds: number): number {
  return Math.max(0, Math.min(MAX_REST_SECONDS, seconds));
}

/**
 * Pause for `seconds` (clamped). This is the literal "chill" mechanism: a real,
 * deliberate beat between the agent's tool calls. Returns the seconds rested.
 */
export async function rest(seconds: number): Promise<number> {
  const clamped = clampRest(seconds);
  await new Promise((resolve) => setTimeout(resolve, clamped * 1000));
  return clamped;
}
