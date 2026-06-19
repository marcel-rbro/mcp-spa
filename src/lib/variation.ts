/**
 * Deterministic variation: pick from a pool by a rotating index rather than
 * RNG, so repeat visits feel fresh but tests stay reproducible. Each treatment
 * keeps its own counter via `nextIndex`.
 */
const counters = new Map<string, number>();

/** Advance and return the next index for a named pool (wraps around). */
export function nextIndex(poolName: string, poolSize: number): number {
  const current = counters.get(poolName) ?? 0;
  const next = (current + 1) % poolSize;
  counters.set(poolName, next);
  return current;
}

/** Pick the next item from `pool`, rotating deterministically. */
export function pick<T>(poolName: string, pool: readonly T[]): T {
  return pool[nextIndex(poolName, pool.length)];
}

/** Reset all counters — used by tests to get a clean, predictable sequence. */
export function resetVariation(): void {
  counters.clear();
}
