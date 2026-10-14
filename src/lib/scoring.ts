export const HINT_PENALTIES: Record<number, number> = {
  1: 5,
  2: 10,
  3: 20,
  4: 40,
};

export function calculateScore(
  usedHintLevels: number[],
  isLiveRoom = false,
  remainingSec = 0,
  totalDurationSec = 900
): number {
  const uniqueLevels = Array.from(new Set(usedHintLevels));
  const totalPenalty = uniqueLevels.reduce((acc, lvl) => acc + (HINT_PENALTIES[lvl] || 0), 0);
  const baseScore = Math.max(10, 100 - totalPenalty);

  if (!isLiveRoom || totalDurationSec <= 0) return baseScore;
  const speedBonus = Math.round(Math.max(0, Math.min(20, (remainingSec / totalDurationSec) * 20)));
  return baseScore + speedBonus;
}
