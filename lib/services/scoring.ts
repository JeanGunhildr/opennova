// lib/services/scoring.ts
// Centralized scoring helpers for competition phase automation.
// Pure functions — no Supabase calls, easy to unit-test.

// ============================================================
// TYPES
// ============================================================

export interface CriterionScoreRow {
  criterion_id: string;
  score: number; // 0-100 per criterion
}

export interface CriterionRow {
  id: string;
  stage: "expert_judging" | "final_pitch";
}

export interface EntryWithScores {
  entryId: string;
  solverUserId: string | null;  // null for team entries
  teamId: string | null;
  submittedAt: string | null;   // ISO string — for tie-breaking
  scores: CriterionScoreRow[];
  expertAvg?: number;           // Computed
  pitchAvg?: number;            // Computed
  finalScore?: number;          // Computed
}

// ============================================================
// SCORE CALCULATIONS
// ============================================================

/**
 * Calculate the average score for a given stage across all criteria.
 * Returns { avg: number, hasScores: boolean }.
 * Sums score per criterion divided by total criteria in that stage.
 */
export function calculateStageScore(
  scores: CriterionScoreRow[],
  criteria: CriterionRow[],
  stage: "expert_judging" | "final_pitch",
): { avg: number; hasScores: boolean } {
  const stageCriteria = criteria.filter((c) => c.stage === stage);
  if (stageCriteria.length === 0) return { avg: 0, hasScores: false };

  const scoreMap = new Map(scores.map((s) => [s.criterion_id, s.score]));

  let total = 0;
  let scoredCount = 0;

  for (const c of stageCriteria) {
    if (scoreMap.has(c.id)) {
      total += scoreMap.get(c.id)!;
      scoredCount++;
    }
  }

  if (scoredCount === 0) {
    return { avg: 0, hasScores: false };
  }

  return { avg: total / stageCriteria.length, hasScores: true };
}

/** Legacy alias returning pure numeric avg for backward compatibility */
export function calculateAverageStageScore(
  scores: CriterionScoreRow[],
  criteria: CriterionRow[],
  stage: "expert_judging" | "final_pitch",
): number {
  return calculateStageScore(scores, criteria, stage).avg;
}

/**
 * Calculate final score as simple average between expert and pitch scores.
 * - If only expert judging available: final = expertAvg
 * - If only final pitch available: final = pitchAvg
 * - If both available: final = (expertAvg + pitchAvg) / 2
 */
export function calculateFinalScore(
  expertAvg: number,
  pitchAvg: number,
  hasExpert: boolean = true,
  hasPitch: boolean = true,
): number {
  if (hasExpert && hasPitch) {
    return (expertAvg + pitchAvg) / 2;
  }
  if (hasExpert) {
    return expertAvg;
  }
  if (hasPitch) {
    return pitchAvg;
  }
  return 0;
}

// ============================================================
// FINALIST SELECTION
// ============================================================

/**
 * Select the top N finalists from a list of entries based on expert judging score.
 * Tie-breaking order:
 *   1. expertAvg DESC  (higher is better)
 *   2. submittedAt ASC (earlier submission wins tie)
 *   3. entryId ASC     (deterministic UUID-based final tiebreak)
 *
 * Returns at most `n` entries. If fewer entries exist (e.g. 1 or 2), all valid entries are returned.
 */
export function selectTopFinalists(
  entries: EntryWithScores[],
  n: number = 3,
): EntryWithScores[] {
  const sorted = [...entries].sort((a, b) => {
    const aScore = a.expertAvg ?? 0;
    const bScore = b.expertAvg ?? 0;

    if (bScore !== aScore) return bScore - aScore; // Higher score first

    // Tie-breaker 1: submitted_at ASC (earlier is better)
    const aTime = a.submittedAt ? new Date(a.submittedAt).getTime() : Infinity;
    const bTime = b.submittedAt ? new Date(b.submittedAt).getTime() : Infinity;
    if (aTime !== bTime) return aTime - bTime;

    // Tie-breaker 2: entry_id ASC (alphabetical UUID)
    return a.entryId.localeCompare(b.entryId);
  });

  return sorted.slice(0, n);
}

/**
 * Enrich entries with computed scores using simple average logic.
 */
export function enrichEntriesWithScores(
  entries: EntryWithScores[],
  criteria: CriterionRow[],
  _legacyExpertWeight: number = 50,
  _legacyPitchWeight: number = 50,
): EntryWithScores[] {
  return entries.map((entry) => {
    const expertRes = calculateStageScore(entry.scores, criteria, "expert_judging");
    const pitchRes = calculateStageScore(entry.scores, criteria, "final_pitch");
    const finalScore = calculateFinalScore(
      expertRes.avg,
      pitchRes.avg,
      expertRes.hasScores,
      pitchRes.hasScores,
    );
    return {
      ...entry,
      expertAvg: expertRes.avg,
      pitchAvg: pitchRes.avg,
      finalScore,
    };
  });
}

/**
 * Determine winner ranking from finalist entries using simple average final score.
 * Tie-breaking order:
 *   1. finalScore DESC
 *   2. submittedAt ASC
 *   3. entryId ASC
 * Returns entries sorted with rank assigned (1 = winner).
 */
export function rankFinalists(
  finalists: EntryWithScores[],
): Array<EntryWithScores & { rank: number }> {
  const sorted = [...finalists].sort((a, b) => {
    const aScore = a.finalScore ?? 0;
    const bScore = b.finalScore ?? 0;

    if (bScore !== aScore) return bScore - aScore;

    const aTime = a.submittedAt ? new Date(a.submittedAt).getTime() : Infinity;
    const bTime = b.submittedAt ? new Date(b.submittedAt).getTime() : Infinity;
    if (aTime !== bTime) return aTime - bTime;

    return a.entryId.localeCompare(b.entryId);
  });

  return sorted.map((entry, index) => ({ ...entry, rank: index + 1 }));
}
