// ─────────────────────────────────────────────────────────
// OpenNova Solver - Challenge State Machine & Mock Models
// Source of truth for all 11 conditional scenarios (A–K)
// ─────────────────────────────────────────────────────────

export type ChallengeStatus = "ACTIVE" | "REGISTRATION_CLOSED" | "ENDED";
export type ParticipationStatus = "NOT_JOINED" | "INDIVIDUAL" | "TEAM_LEADER" | "TEAM_MEMBER";
export type ExpertJudgingStatus = "NOT_STARTED" | "FAILED" | "PASSED";
export type FinalPitchingStatus = "NOT_STARTED" | "FAILED" | "PASSED";

export interface CriterionScore {
  name: string;
  score: number;
}

export interface ChallengeState {
  scenarioId: string;
  challengeStatus: ChallengeStatus;
  participationStatus: ParticipationStatus;
  expertJudgingStatus: ExpertJudgingStatus;
  finalPitchingStatus: FinalPitchingStatus;
  hasWinner: boolean;
  userIsWinner: boolean;
  currentStage: string;
  teamName?: string;
  winnerName?: string;
  submissionUrl?: string;
  expertScore?: number;
  expertWeight?: number;
  expertFeedback?: string;
  expertCriteriaScores?: CriterionScore[];
  pitchingScore?: number;
  pitchingWeight?: number;
  pitchingFeedback?: string;
  pitchingCriteriaScores?: CriterionScore[];
  remainingDays?: number;
}

export interface ResolvedChallengeUI {
  registrationOpen: boolean;
  registrationClosed: boolean;
  challengeEnded: boolean;
  joined: boolean;
  isTeam: boolean;
  canSubmit: boolean;
  teamMemberRestricted: boolean;
  expertResultAvailable: boolean;
  pitchingResultAvailable: boolean;
  winnerResultAvailable: boolean;
  finalScore: number | null;
  heroTagType: "countdown" | "closed" | "ended" | "result" | "winner";
  heroTagLabel: string;
  heroTagStyle: "countdown" | "success" | "danger" | "closed" | "ended";
  dynamicInfoMode: "rewardCountdown" | "winner";
}

export const MOCK_CHALLENGE_STATES: Record<string, ChallengeState> = {
  // 1. A - Active, Not Joined
  ACTIVE_NOT_JOINED: {
    scenarioId: "ACTIVE_NOT_JOINED",
    challengeStatus: "ACTIVE",
    participationStatus: "NOT_JOINED",
    expertJudgingStatus: "NOT_STARTED",
    finalPitchingStatus: "NOT_STARTED",
    hasWinner: false,
    userIsWinner: false,
    currentStage: "Challenge Dibuka",
    remainingDays: 48,
  },

  // 2. B - Active, Joined as Team Leader
  ACTIVE_JOINED_TEAM_LEADER: {
    scenarioId: "ACTIVE_JOINED_TEAM_LEADER",
    challengeStatus: "ACTIVE",
    participationStatus: "TEAM_LEADER",
    expertJudgingStatus: "NOT_STARTED",
    finalPitchingStatus: "NOT_STARTED",
    hasWinner: false,
    userIsWinner: false,
    currentStage: "Challenge Dibuka",
    teamName: "Inovasi Nusantara",
    remainingDays: 48,
  },

  // 3. C - Active, Joined as Individual
  ACTIVE_JOINED_INDIVIDUAL: {
    scenarioId: "ACTIVE_JOINED_INDIVIDUAL",
    challengeStatus: "ACTIVE",
    participationStatus: "INDIVIDUAL",
    expertJudgingStatus: "NOT_STARTED",
    finalPitchingStatus: "NOT_STARTED",
    hasWinner: false,
    userIsWinner: false,
    currentStage: "Challenge Dibuka",
    remainingDays: 48,
  },

  // 4. D - Registration Closed, Not Joined
  CLOSED_NOT_JOINED: {
    scenarioId: "CLOSED_NOT_JOINED",
    challengeStatus: "REGISTRATION_CLOSED",
    participationStatus: "NOT_JOINED",
    expertJudgingStatus: "NOT_STARTED",
    finalPitchingStatus: "NOT_STARTED",
    hasWinner: false,
    userIsWinner: false,
    currentStage: "Penjurian Ahli",
    remainingDays: 0,
  },

  // 5. E - Ended, Not Joined, Has Winner
  ENDED_NOT_JOINED_HAS_WINNER: {
    scenarioId: "ENDED_NOT_JOINED_HAS_WINNER",
    challengeStatus: "ENDED",
    participationStatus: "NOT_JOINED",
    expertJudgingStatus: "PASSED",
    finalPitchingStatus: "PASSED",
    hasWinner: true,
    userIsWinner: false,
    winnerName: "Tim Quantum Nova",
    currentStage: "Pengumuman Pemenang",
    remainingDays: 0,
  },

  // 6. F - Active, Joined as Team Member (Restricted)
  ACTIVE_TEAM_MEMBER_RESTRICTED: {
    scenarioId: "ACTIVE_TEAM_MEMBER_RESTRICTED",
    challengeStatus: "ACTIVE",
    participationStatus: "TEAM_MEMBER",
    expertJudgingStatus: "NOT_STARTED",
    finalPitchingStatus: "NOT_STARTED",
    hasWinner: false,
    userIsWinner: false,
    currentStage: "Challenge Dibuka",
    teamName: "Green Future Lab",
    remainingDays: 48,
  },

  // 7. G - Closed, Joined, Awaiting Judging
  CLOSED_AWAITING_JUDGING: {
    scenarioId: "CLOSED_AWAITING_JUDGING",
    challengeStatus: "REGISTRATION_CLOSED",
    participationStatus: "INDIVIDUAL",
    expertJudgingStatus: "NOT_STARTED",
    finalPitchingStatus: "NOT_STARTED",
    hasWinner: false,
    userIsWinner: false,
    submissionUrl: "https://drive.google.com/drive/folders/1aBcD_InovasiAI_2026",
    currentStage: "Penjurian Ahli",
    remainingDays: 0,
  },

  // 8. H - Closed, Expert Judging Failed
  CLOSED_EXPERT_FAILED: {
    scenarioId: "CLOSED_EXPERT_FAILED",
    challengeStatus: "REGISTRATION_CLOSED",
    participationStatus: "INDIVIDUAL",
    expertJudgingStatus: "FAILED",
    finalPitchingStatus: "NOT_STARTED",
    hasWinner: false,
    userIsWinner: false,
    submissionUrl: "https://drive.google.com/drive/folders/1aBcD_InovasiAI_2026",
    expertScore: 68,
    expertWeight: 0.6,
    expertFeedback: "Proposal teknis belum menyertakan benchmark throughput dan mitigasi bias data model.",
    expertCriteriaScores: [
      { name: "Kelayakan Teknis", score: 65 },
      { name: "Inovasi & Orisinalitas", score: 70 },
      { name: "Dampak & Skalabilitas", score: 69 },
    ],
    currentStage: "Penjurian Ahli",
    remainingDays: 0,
  },

  // 9. I - Closed, Expert Passed, Awaiting Pitching
  CLOSED_EXPERT_PASSED_AWAITING_PITCHING: {
    scenarioId: "CLOSED_EXPERT_PASSED_AWAITING_PITCHING",
    challengeStatus: "REGISTRATION_CLOSED",
    participationStatus: "INDIVIDUAL",
    expertJudgingStatus: "PASSED",
    finalPitchingStatus: "NOT_STARTED",
    hasWinner: false,
    userIsWinner: false,
    submissionUrl: "https://drive.google.com/drive/folders/1aBcD_InovasiAI_2026",
    expertScore: 88,
    expertWeight: 0.6,
    expertFeedback: "Arsitektur jaringan edge dan modul inferensi anomali sangat solid dan teruji.",
    expertCriteriaScores: [
      { name: "Kelayakan Teknis", score: 90 },
      { name: "Inovasi & Orisinalitas", score: 85 },
      { name: "Dampak & Skalabilitas", score: 89 },
    ],
    currentStage: "Pitching Final",
    remainingDays: 0,
  },

  // 10. J - Closed, Final Pitching Failed
  CLOSED_PITCHING_FAILED: {
    scenarioId: "CLOSED_PITCHING_FAILED",
    challengeStatus: "REGISTRATION_CLOSED",
    participationStatus: "INDIVIDUAL",
    expertJudgingStatus: "PASSED",
    finalPitchingStatus: "FAILED",
    hasWinner: true,
    userIsWinner: false,
    submissionUrl: "https://drive.google.com/drive/folders/1aBcD_InovasiAI_2026",
    expertScore: 88,
    expertWeight: 0.6,
    expertCriteriaScores: [
      { name: "Kelayakan Teknis", score: 90 },
      { name: "Inovasi & Orisinalitas", score: 85 },
      { name: "Dampak & Skalabilitas", score: 89 },
    ],
    pitchingScore: 62,
    pitchingWeight: 0.4,
    pitchingFeedback: "Model bisnis dan skema adopsi operasional dinilai memerlukan biaya lisensi awal terlalu tinggi.",
    pitchingCriteriaScores: [
      { name: "Biaya & Sumber Daya", score: 58 },
      { name: "Kesiapan Implementasi", score: 65 },
      { name: "Kejelasan Model", score: 63 },
    ],
    currentStage: "Pengumuman Pemenang",
    remainingDays: 0,
  },

  // 11. K - Closed, Winner!
  CLOSED_WINNER: {
    scenarioId: "CLOSED_WINNER",
    challengeStatus: "ENDED",
    participationStatus: "INDIVIDUAL",
    expertJudgingStatus: "PASSED",
    finalPitchingStatus: "PASSED",
    hasWinner: true,
    userIsWinner: true,
    winnerName: "Irfan Maulana (Anda)",
    submissionUrl: "https://drive.google.com/drive/folders/1aBcD_InovasiAI_2026",
    expertScore: 92,
    expertWeight: 0.6,
    expertCriteriaScores: [
      { name: "Kelayakan Teknis", score: 94 },
      { name: "Inovasi & Orisinalitas", score: 90 },
      { name: "Dampak & Skalabilitas", score: 92 },
    ],
    pitchingScore: 95,
    pitchingWeight: 0.4,
    pitchingCriteriaScores: [
      { name: "Biaya & Sumber Daya", score: 93 },
      { name: "Kesiapan Implementasi", score: 96 },
      { name: "Kejelasan Model", score: 96 },
    ],
    currentStage: "Pengumuman Pemenang",
    remainingDays: 0,
  },
};

// ── Developer Switch ───────────────────────────────────────
// Change this key to easily preview any of the 11 scenarios in UI
export const CURRENT_STATE_KEY = "CLOSED_EXPERT_PASSED_AWAITING_PITCHING";

// ── Resolver Function ───────────────────────────────────────
export function resolveChallengeState(state: ChallengeState): ResolvedChallengeUI {
  const registrationOpen = state.challengeStatus === "ACTIVE";
  const registrationClosed = state.challengeStatus === "REGISTRATION_CLOSED";
  const challengeEnded = state.challengeStatus === "ENDED";

  const joined = state.participationStatus !== "NOT_JOINED";
  const isTeam =
    state.participationStatus === "TEAM_LEADER" ||
    state.participationStatus === "TEAM_MEMBER";
  const canSubmit =
    state.participationStatus === "INDIVIDUAL" ||
    state.participationStatus === "TEAM_LEADER";
  const teamMemberRestricted = state.participationStatus === "TEAM_MEMBER";

  const expertResultAvailable =
    state.expertJudgingStatus === "FAILED" || state.expertJudgingStatus === "PASSED";
  const pitchingResultAvailable =
    state.finalPitchingStatus === "FAILED" || state.finalPitchingStatus === "PASSED";
  const winnerResultAvailable = challengeEnded && state.hasWinner;

  // Final score calculation:
  // (Expert Score * Expert Weight) + (Pitching Score * Pitching Weight)
  let finalScore: number | null = null;
  if (state.expertScore !== undefined && state.pitchingScore !== undefined) {
    const ew = state.expertWeight ?? 0.6;
    const pw = state.pitchingWeight ?? 0.4;
    finalScore = Math.round((state.expertScore * ew + state.pitchingScore * pw) * 10) / 10;
  } else if (state.expertScore !== undefined) {
    finalScore = state.expertScore;
  }

  // Hero tag determination based on priority
  let heroTagType: ResolvedChallengeUI["heroTagType"] = "countdown";
  let heroTagLabel = `${state.remainingDays ?? 0} hari lagi`;
  let heroTagStyle: ResolvedChallengeUI["heroTagStyle"] = "countdown";

  if (state.userIsWinner) {
    heroTagType = "winner";
    heroTagLabel = "Pemenang";
    heroTagStyle = "success";
  } else if (state.finalPitchingStatus === "FAILED") {
    heroTagType = "result";
    heroTagLabel = "Tidak Lolos Pitching Final";
    heroTagStyle = "danger";
  } else if (
    state.expertJudgingStatus === "PASSED" &&
    state.finalPitchingStatus === "NOT_STARTED"
  ) {
    heroTagType = "result";
    heroTagLabel = "Lolos Penjurian Ahli";
    heroTagStyle = "success";
  } else if (state.expertJudgingStatus === "FAILED") {
    heroTagType = "result";
    heroTagLabel = "Tidak Lolos Penjurian Ahli";
    heroTagStyle = "danger";
  } else if (challengeEnded) {
    heroTagType = "ended";
    heroTagLabel = "Selesai";
    heroTagStyle = "ended";
  } else if (registrationClosed) {
    heroTagType = "closed";
    heroTagLabel = "Pendaftaran Ditutup";
    heroTagStyle = "closed";
  } else {
    heroTagType = "countdown";
    heroTagLabel = `${state.remainingDays ?? 0} hari lagi`;
    heroTagStyle = "countdown";
  }

  const dynamicInfoMode: ResolvedChallengeUI["dynamicInfoMode"] =
    challengeEnded && state.hasWinner ? "winner" : "rewardCountdown";

  return {
    registrationOpen,
    registrationClosed,
    challengeEnded,
    joined,
    isTeam,
    canSubmit,
    teamMemberRestricted,
    expertResultAvailable,
    pitchingResultAvailable,
    winnerResultAvailable,
    finalScore,
    heroTagType,
    heroTagLabel,
    heroTagStyle,
    dynamicInfoMode,
  };
}
