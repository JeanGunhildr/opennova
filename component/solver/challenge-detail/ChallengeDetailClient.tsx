"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import {
  MOCK_CHALLENGE_STATES,
  CURRENT_STATE_KEY,
  resolveChallengeState,
  type ChallengeState,
} from "@/lib/data/challengeState";

import ChallengeHero from "./ChallengeHero";
import ChallengeMetricGrid from "./ChallengeMetricGrid";
import LeftContent from "./LeftContent";
import RightSidebar from "./RightSidebar";
import CopyrightAgreementModal from "./modals/CopyrightAgreementModal";
import WithdrawConfirmationModal from "./modals/WithdrawConfirmationModal";

interface ChallengeDetailClientProps {
  id: string;
}

export default function ChallengeDetailClient({ id }: ChallengeDetailClientProps) {
  // Scenario state initialized from CURRENT_STATE_KEY
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>(CURRENT_STATE_KEY);
  const activeState: ChallengeState =
    MOCK_CHALLENGE_STATES[selectedScenarioKey] ?? MOCK_CHALLENGE_STATES.ACTIVE_NOT_JOINED;

  // Resolve state to UI boolean flags
  const resolved = resolveChallengeState(activeState);

  // Modals state
  const [copyrightModalOpen, setCopyrightModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  // Fallback challenge presentation data
  const challengeData = {
    id: id || "dc-1",
    title: "Solusi Monitoring Infrastruktur Jaringan Berbasis AI Real-Time",
    company: "Telkom Indonesia",
    companyInitials: "TI",
    companyIndustry: "Telekomunikasi & Digital",
    companyAbout:
      "Telkom Indonesia adalah BUMN telekomunikasi terdepan di Indonesia yang mengoperasikan jaringan serat optik nasional, backbone satelit, dan pusat data enterprise.",
    category: "Teknologi & Rekayasa",
    reward: "Rp 50.000.000",
    deadline: "17 Nov 2026",
    participantCount: 312,
    description:
      "Telkom Indonesia mengundang para Solver untuk menciptakan solusi cerdas berbasis AI yang mampu memonitor dan mendeteksi anomali pada infrastruktur kabel optik secara presisi.\n\nSolusi ini dirancang untuk mendeteksi degradasi sinyal secara proaktif sebelum terjadi pemutusan total (downtime), sehingga tim NOC dapat mengalihkan rute traffic dan melakukan maintenance prediktif dengan cepat.",
  };

  const handleJoinChallenge = () => {
    setSelectedScenarioKey("ACTIVE_JOINED_INDIVIDUAL");
  };

  const handleWithdrawConfirm = () => {
    setWithdrawModalOpen(false);
    setSelectedScenarioKey("ACTIVE_NOT_JOINED");
  };

  return (
    <div className="w-full bg-[#F6F8FA] min-h-screen">
      <div className="w-full max-w-[1160px] mx-auto px-7 lg:px-8 pb-16 pt-5">
        {/* ── Top Utility Bar: Breadcrumb + Scenario Switcher ───────── */}
        <div className="h-[34px] flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <Link
              href="/solver"
              className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50 text-[11px] font-medium text-gray-700 transition-colors shadow-sm"
            >
              <ArrowLeft size={12} strokeWidth={1.8} />
              Kembali
            </Link>
            <span className="text-gray-400">Jelajah</span>
            <span className="text-gray-400">/</span>
            <span className="text-[11px] font-semibold text-gray-800 truncate max-w-[220px] sm:max-w-[340px]">
              {challengeData.title}
            </span>
          </div>

          {/* Developer Scenario Switcher */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 h-[30px] shadow-sm self-center">
            <SlidersHorizontal size={12} className="text-gray-500 flex-shrink-0" />
            <label htmlFor="scenario-select" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Skenario:
            </label>
            <select
              id="scenario-select"
              value={selectedScenarioKey}
              onChange={(e) => setSelectedScenarioKey(e.target.value)}
              className="bg-transparent text-[11px] font-semibold text-[#E30000] focus:outline-none cursor-pointer pr-1"
            >
              <option value="ACTIVE_NOT_JOINED">1. Active: Not Joined</option>
              <option value="ACTIVE_JOINED_TEAM_LEADER">2. Active: Joined (Leader)</option>
              <option value="ACTIVE_JOINED_INDIVIDUAL">3. Active: Joined (Individu)</option>
              <option value="CLOSED_NOT_JOINED">4. Closed: Not Joined</option>
              <option value="ENDED_NOT_JOINED_HAS_WINNER">5. Ended: Has Winner</option>
              <option value="ACTIVE_TEAM_MEMBER_RESTRICTED">6. Active: Team Member</option>
              <option value="CLOSED_AWAITING_JUDGING">7. Closed: Awaiting Judging</option>
              <option value="CLOSED_EXPERT_FAILED">8. Closed: Expert Failed</option>
              <option value="CLOSED_EXPERT_PASSED_AWAITING_PITCHING">9. Closed: Expert Passed</option>
              <option value="CLOSED_PITCHING_FAILED">10. Closed: Pitching Failed</option>
              <option value="CLOSED_WINNER">11. Closed: Winner (Anda)</option>
            </select>
          </div>
        </div>

        {/* ── 1. Header Hero Card ───────────────────────────── */}
        <ChallengeHero
          category={challengeData.category}
          title={challengeData.title}
          company={challengeData.company}
          companyInitials={challengeData.companyInitials}
          resolved={resolved}
          isSpecialCollaboration={true}
        />

        {/* ── 2. Metric Cards Grid (4 Cards) ───────────────── */}
        <ChallengeMetricGrid
          reward={challengeData.reward}
          deadline={challengeData.deadline}
          participantCount={challengeData.participantCount}
          resolved={resolved}
        />

        {/* ── 3. Master-Detail Layout Architecture ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start mt-5">
          {/* Left Column (Standard Document Flow) */}
          <LeftContent description={challengeData.description} />

          {/* Right Column (Sticky Contextual Rail) */}
          <RightSidebar
            state={activeState}
            resolved={resolved}
            reward={challengeData.reward}
            companyName={challengeData.company}
            companyInitials={challengeData.companyInitials}
            companyIndustry={challengeData.companyIndustry}
            companyAbout={challengeData.companyAbout}
            onOpenCopyrightModal={() => setCopyrightModalOpen(true)}
            onOpenWithdrawModal={() => setWithdrawModalOpen(true)}
            onJoinChallenge={handleJoinChallenge}
          />
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────── */}
      {copyrightModalOpen && (
        <CopyrightAgreementModal onClose={() => setCopyrightModalOpen(false)} />
      )}
      {withdrawModalOpen && (
        <WithdrawConfirmationModal
          onClose={() => setWithdrawModalOpen(false)}
          onConfirm={handleWithdrawConfirm}
        />
      )}
    </div>
  );
}
