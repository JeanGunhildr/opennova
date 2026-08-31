// app/solver/challenge/[id]/page.tsx
// Next.js 16 dynamic route — params: Promise<{ id: string }>
// generateStaticParams for build-time SSG.

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ChallengeHero from "@/component/dashboard/challenge-detail/ChallengeHero";
import type { HeroStatus } from "@/component/dashboard/challenge-detail/ChallengeHero";
import ChallengeMetadata from "@/component/dashboard/challenge-detail/ChallengeMetadata";
import ChallengeTabs from "@/component/dashboard/challenge-detail/ChallengeTabs";
import ChallengeContentArea from "@/component/dashboard/challenge-detail/ChallengeContentArea";
import SeekerInfoCard from "@/component/dashboard/challenge-detail/SeekerInfoCard";
import ChallengeActionWidget from "@/component/dashboard/challenge-detail/ChallengeActionWidget";
import type { ChallengeActionState } from "@/component/dashboard/challenge-detail/ChallengeActionWidget";

// ── Static params ──────────────────────────────────────────
export async function generateStaticParams() {
  return [
    { id: "dc-1" },
    { id: "dc-2" },
    { id: "dc-3" },
    { id: "dc-demo-winner" },
    { id: "dc-demo-member" },
    { id: "dc-demo-passed" },
  ];
}

// ── Mock challenge data ────────────────────────────────────
interface MockChallenge {
  category: string;
  title: string;
  company: string;
  companyInitials: string;
  companyAbout: string;
  companyIndustry: string;
  companyWebsite: string;
  reward: string;
  deadline: string;
  participantCount: number;
  status: string;
  description: string;
  heroStatus: HeroStatus;
  actionState: ChallengeActionState;
  teamName?: string;
  winnerName?: string;
}

const BASE: Omit<MockChallenge, "title" | "company" | "companyInitials" | "companyAbout" | "companyIndustry" | "companyWebsite" | "reward" | "deadline" | "participantCount" | "actionState" | "heroStatus"> = {
  category: "Teknologi & Rekayasa",
  status: "Aktif",
  description:
    "Telkom Indonesia mencari inovasi terbaik untuk solusi monitoring infrastruktur jaringan yang mampu mendeteksi anomali secara real-time menggunakan kecerdasan buatan.\n\nSolusi yang diharapkan dapat membantu tim operasional untuk merespons insiden lebih cepat, mengurangi downtime, dan meningkatkan kualitas layanan secara keseluruhan.",
};

const MOCK_CHALLENGES: Record<string, MockChallenge> = {
  "dc-1": {
    ...BASE,
    title: "Solusi Monitoring Infrastruktur Jaringan Berbasis AI Real-Time",
    company: "Telkom Indonesia",
    companyInitials: "TI",
    companyAbout:
      "Telkom Indonesia adalah perusahaan telekomunikasi terbesar di Indonesia, menyediakan layanan jaringan dan solusi digital untuk jutaan pelanggan.",
    companyIndustry: "Telekomunikasi",
    companyWebsite: "https://www.telkom.co.id",
    reward: "Rp 50.000.000",
    deadline: "17 Nov 2026",
    participantCount: 312,
    heroStatus: { label: "48 hari lagi", style: "deadline" },
    actionState: "ACTIVE_NOT_JOINED",
  },
  "dc-2": {
    category: "Lingkungan",
    status: "Aktif",
    title: "Inovasi Pengurangan Limbah Plastik pada Ekosistem Pesisir dan Laut",
    company: "Pertamina",
    companyInitials: "PT",
    companyAbout:
      "Pertamina adalah perusahaan energi nasional yang berkomitmen pada transformasi energi berkelanjutan dan perlindungan lingkungan hidup.",
    companyIndustry: "Energi & Lingkungan",
    companyWebsite: "https://www.pertamina.com",
    reward: "Rp 7.000.000",
    deadline: "30 Okt 2026",
    participantCount: 187,
    description:
      "Pertamina mengundang inovator muda untuk merancang solusi pengurangan limbah plastik yang berdampak nyata pada ekosistem pesisir Indonesia.\n\nProposal dapat mencakup teknologi daur ulang, sistem pengumpulan limbah komunitas, atau pendekatan berbasis kebijakan dan edukasi.",
    heroStatus: { label: "48 hari lagi", style: "deadline" },
    actionState: "ACTIVE_JOINED_TEAM_LEADER",
    teamName: "Inovasi Nusantara",
  },
  "dc-3": {
    category: "Kesehatan",
    status: "Aktif",
    title: "Platform Telemedisin Berbasis AI untuk Layanan Kesehatan Pelosok",
    company: "Kimia Farma",
    companyInitials: "KF",
    companyAbout:
      "Kimia Farma adalah perusahaan farmasi dan layanan kesehatan terintegrasi, berkomitmen untuk meningkatkan akses kesehatan di seluruh Indonesia.",
    companyIndustry: "Kesehatan & Farmasi",
    companyWebsite: "https://www.kimiafarma.co.id",
    reward: "Rp 35.000.000",
    deadline: "5 Des 2026",
    participantCount: 241,
    description:
      "Kimia Farma membuka challenge untuk platform telemedisin yang mampu menjangkau daerah-daerah terpencil dengan keterbatasan akses internet dan fasilitas kesehatan.\n\nSolusi harus mempertimbangkan keterbatasan infrastruktur, literasi digital masyarakat, dan kebutuhan medis yang beragam di pelosok nusantara.",
    heroStatus: { label: "48 hari lagi", style: "deadline" },
    actionState: "CLOSED_JOINED",
    teamName: "Tim Solusi Kesehatan",
  },
  "dc-demo-winner": {
    ...BASE,
    title: "Demo: Pemenang Challenge",
    company: "Telkom Indonesia",
    companyInitials: "TI",
    companyAbout: "Demo state: CLOSED_WINNER",
    companyIndustry: "Telekomunikasi",
    companyWebsite: "https://www.telkom.co.id",
    reward: "Rp 50.000.000",
    deadline: "Selesai",
    participantCount: 312,
    heroStatus: { label: "Pemenang", style: "winner" },
    actionState: "CLOSED_WINNER",
    teamName: "Inovasi Nusantara",
    winnerName: "Irfan Satya",
  },
  "dc-demo-member": {
    ...BASE,
    title: "Demo: Anggota Tim",
    company: "Pertamina",
    companyInitials: "PT",
    companyAbout: "Demo state: ACTIVE_JOINED_TEAM_MEMBER",
    companyIndustry: "Energi",
    companyWebsite: "https://www.pertamina.com",
    reward: "Rp 25.000.000",
    deadline: "30 Nov 2026",
    participantCount: 145,
    heroStatus: { label: "48 hari lagi", style: "deadline" },
    actionState: "ACTIVE_JOINED_TEAM_MEMBER",
    teamName: "Green Future Lab",
  },
  "dc-demo-passed": {
    ...BASE,
    title: "Demo: Lolos Penilaian Ahli",
    company: "Kimia Farma",
    companyInitials: "KF",
    companyAbout: "Demo state: CLOSED_PASSED_EXPERT_REVIEW",
    companyIndustry: "Kesehatan",
    companyWebsite: "https://www.kimiafarma.co.id",
    reward: "Rp 35.000.000",
    deadline: "Selesai",
    participantCount: 201,
    heroStatus: { label: "Lolos Penjurian Ahli", style: "success" },
    actionState: "CLOSED_PASSED_EXPERT_REVIEW",
  },
};

const FALLBACK = MOCK_CHALLENGES["dc-1"];

// ── Page ───────────────────────────────────────────────────
export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = MOCK_CHALLENGES[id] ?? FALLBACK;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-9">

      {/* ── Breadcrumb / back ───────────────────────────── */}
      <div className="flex items-center gap-2 mb-5">
        <Link
          href="/solver"
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white border border-gray-300 text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={13} strokeWidth={1.8} />
          Kembali
        </Link>
        <span className="text-[12px] text-gray-400">Jelajah</span>
        <span className="text-[12px] text-gray-400">/</span>
        <span className="text-[12px] font-semibold text-gray-700 truncate max-w-[300px]">
          {challenge.title}
        </span>
      </div>

      {/*
       * Two-column content grid
       * Left : Hero → Metadata → Tabs → ContentArea
       * Right: sticky sidebar (lg+) — SeekerInfoCard + ChallengeActionWidget
       */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start max-w-[1160px]">

        {/* ── Left column ─────────────────────────────── */}
        <div className="flex flex-col gap-5 min-w-0">
          <ChallengeHero
            id={id}
            category={challenge.category}
            title={challenge.title}
            company={challenge.company}
            companyInitials={challenge.companyInitials}
            verified
            heroStatus={challenge.heroStatus}
          />

          <ChallengeMetadata
            reward={challenge.reward}
            deadline={challenge.deadline}
            participantCount={challenge.participantCount}
            status={challenge.status}
          />

          <ChallengeTabs />

          <ChallengeContentArea description={challenge.description} />
        </div>

        {/* ── Right column (sticky on lg+) ─────────────── */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
          <SeekerInfoCard
            companyName={challenge.company}
            companyInitials={challenge.companyInitials}
            industry={challenge.companyIndustry}
            about={challenge.companyAbout}
            website={challenge.companyWebsite}
            verified
            reward={challenge.reward}
            deadline={challenge.deadline}
          />

          <ChallengeActionWidget
            challengeId={id}
            state={challenge.actionState}
            teamName={challenge.teamName}
            winnerName={challenge.winnerName}
          />
        </aside>
      </div>
    </div>
  );
}