// Unified progress calculation utility
export function getPercent(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

export function calculateProgressFromSteps(completedSteps: number, totalSteps: number): number {
  return getPercent(completedSteps, totalSteps);
}

export function calculateProgressFromIndex(currentIndex: number, totalSteps: number): number {
  return getPercent(currentIndex + 1, totalSteps);
}