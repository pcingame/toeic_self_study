// Official TOEIC Writing timing for the full-test flow: Part 1's five
// sentences share ONE timer, unlike standalone practice which times each
// sentence separately (see time_limit_sec on each question row).
export const WRITING_PART1_GROUP_SEC = 8 * 60;

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
