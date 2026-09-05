// ─────────────────────────────────────────────────────────
// OpenNova Seeker - Kelola Challenge: Penilaian & Pemenang
// Source of truth for lifecycle stages and mock submissions
// ─────────────────────────────────────────────────────────

export type SeekerLifecycleStage =
  | "CHALLENGE_DIBUKA"
  | "PENJURIAN_AHLI"
  | "PITCHING_FINAL"
  | "PENGUMUMAN_PEMENANG";

export const CURRENT_SEEKER_STAGE: SeekerLifecycleStage = "PENJURIAN_AHLI";

export interface CriterionDefinition {
  id: string;
  label: string;
  description: string;
}

export const EXPERT_CRITERIA: CriterionDefinition[] = [
  {
    id: "technical-feasibility",
    label: "Kelayakan Teknis",
    description: "Kemungkinan dan kematangan teknis solusi untuk diimplementasikan.",
  },
  {
    id: "innovation-originality",
    label: "Inovasi & Orisinalitas",
    description: "Keunikan pendekatan dan kebaruan dari solusi yang diajukan.",
  },
  {
    id: "impact-scalability",
    label: "Dampak & Skalabilitas",
    description: "Potensi manfaat dan potensi solusi diperluas ke wilayah lain.",
  },
];

export const PITCHING_CRITERIA: CriterionDefinition[] = [
  {
    id: "cost-resources",
    label: "Biaya & Sumber Daya",
    description: "Kelayakan biaya serta kecukupan sumber daya implementasi.",
  },
  {
    id: "implementation-readiness",
    label: "Kesiapan Implementasi",
    description: "Kesiapan pendekatan untuk diterapkan dalam kondisi nyata.",
  },
  {
    id: "model-clarity",
    label: "Kejelasan Model",
    description: "Kejelasan model, pendekatan, dan mekanisme solusi.",
  },
];

export interface ExpertSubmission {
  id: string;
  solverName: string;
  avatar: string;
  registrationType: "Individu" | "Tim";
  driveUrl: string;
  status: "notRated" | "rated";
  scores: Record<string, number>;
}

export interface PitchingSubmission {
  id: string;
  solverName: string;
  avatar: string;
  registrationType: "Individu" | "Tim";
  driveUrl: string;
  email: string;
  isAssessed: boolean;
  scores: Record<string, number>;
}

export interface WinnerData {
  id: string;
  solverName: string;
  avatar: string;
  registrationType: "Individu" | "Tim";
  driveUrl: string;
  email: string;
  expertScores: Record<string, number>;
  pitchingScores: Record<string, number>;
  finalScore: number;
}

export const MOCK_EXPERT_SUBMISSIONS: ExpertSubmission[] = [
  {
    id: "sub-exp-1",
    solverName: "Farhan Yudha Pratama",
    avatar: "FY",
    registrationType: "Individu",
    driveUrl: "https://drive.google.com/drive/folders/1aBcD_InovasiAI_2026",
    status: "rated",
    scores: {
      "technical-feasibility": 88,
      "innovation-originality": 85,
      "impact-scalability": 90,
    },
  },
  {
    id: "sub-exp-2",
    solverName: "Nova Vanguard Team",
    avatar: "NV",
    registrationType: "Tim",
    driveUrl: "https://drive.google.com/drive/folders/1bCdE_EdgeInovasi_2026",
    status: "rated",
    scores: {
      "technical-feasibility": 92,
      "innovation-originality": 89,
      "impact-scalability": 91,
    },
  },
  {
    id: "sub-exp-3",
    solverName: "Bambang Pamungkas",
    avatar: "BP",
    registrationType: "Individu",
    driveUrl: "https://drive.google.com/drive/folders/1cDeF_SinyalOptik_2026",
    status: "notRated",
    scores: {},
  },
  {
    id: "sub-exp-4",
    solverName: "Blater Child",
    avatar: "BC",
    registrationType: "Tim",
    driveUrl: "https://drive.google.com/drive/folders/1dEfG_AIOptik_2026",
    status: "notRated",
    scores: {},
  },
  {
    id: "sub-exp-5",
    solverName: "Ahmad Dahlan",
    avatar: "AD",
    registrationType: "Individu",
    driveUrl: "https://drive.google.com/drive/folders/1eFgH_NOCPrediksi_2026",
    status: "notRated",
    scores: {},
  },
];

export const MOCK_PITCHING_SUBMISSIONS: PitchingSubmission[] = [
  {
    id: "sub-pitch-1",
    solverName: "Farhan Yudha Pratama",
    avatar: "FY",
    registrationType: "Individu",
    driveUrl: "https://drive.google.com/drive/folders/1aBcD_InovasiAI_2026",
    email: "farhan.yudha@alumni.itb.ac.id",
    isAssessed: true,
    scores: {
      "cost-resources": 85,
      "implementation-readiness": 90,
      "model-clarity": 88,
    },
  },
  {
    id: "sub-pitch-2",
    solverName: "Nova Vanguard Team",
    avatar: "NV",
    registrationType: "Tim",
    driveUrl: "https://drive.google.com/drive/folders/1bCdE_EdgeInovasi_2026",
    email: "contact@novavanguard.id",
    isAssessed: false,
    scores: {},
  },
  {
    id: "sub-pitch-3",
    solverName: "Blater Child",
    avatar: "BC",
    registrationType: "Tim",
    driveUrl: "https://drive.google.com/drive/folders/1dEfG_AIOptik_2026",
    email: "team.blater@inovator.org",
    isAssessed: false,
    scores: {},
  },
];

export const MOCK_WINNER_DATA: WinnerData = {
  id: "winner-1",
  solverName: "Farhan Yudha Pratama",
  avatar: "FY",
  registrationType: "Individu",
  driveUrl: "https://drive.google.com/drive/folders/1aBcD_InovasiAI_2026",
  email: "farhan.yudha@alumni.itb.ac.id",
  expertScores: {
    "technical-feasibility": 92,
    "innovation-originality": 90,
    "impact-scalability": 94,
  },
  pitchingScores: {
    "cost-resources": 90,
    "implementation-readiness": 95,
    "model-clarity": 92,
  },
  finalScore: 92.5,
};

export interface SeekerChallengeSummary {
  id: string;
  title: string;
  category: string;
  reward: string;
  solverCount: number;
  coverImage: string;
  isSpecialCollaboration: boolean;
}

export const MOCK_SEEKER_CHALLENGE_SUMMARY: SeekerChallengeSummary = {
  id: "dc-1",
  title: "Solusi Monitoring Infrastruktur Jaringan Berbasis AI Real-Time",
  category: "Teknologi & Rekayasa",
  reward: "Rp 50.000.000",
  solverCount: 148,
  coverImage:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
  isSpecialCollaboration: true,
};
