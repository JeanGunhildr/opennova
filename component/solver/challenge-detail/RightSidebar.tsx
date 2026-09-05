"use client";

import ChallengeDynamicInfoCard from "./ChallengeDynamicInfoCard";
import OrganizerInfoCard from "./OrganizerInfoCard";
import ChallengeActionWidget from "./ChallengeActionWidget";
import type { ResolvedChallengeUI, ChallengeState } from "@/lib/data/challengeState";

interface RightSidebarProps {
  state: ChallengeState;
  resolved: ResolvedChallengeUI;
  reward: string;
  companyName: string;
  companyInitials: string;
  companyIndustry: string;
  companyAbout: string;
  onOpenCopyrightModal: () => void;
  onOpenWithdrawModal: () => void;
  onJoinChallenge?: () => void;
  onSubmitInnovation?: (url: string) => void;
}

export default function RightSidebar({
  state,
  resolved,
  reward,
  companyName,
  companyInitials,
  companyIndustry,
  companyAbout,
  onOpenCopyrightModal,
  onOpenWithdrawModal,
  onJoinChallenge,
  onSubmitInnovation,
}: RightSidebarProps) {
  return (
    <aside className="w-full flex flex-col gap-3.5 lg:sticky lg:top-5 self-start">
      {/* Dynamic Info (Reward / Countdown OR Winner) */}
      <ChallengeDynamicInfoCard state={state} resolved={resolved} reward={reward} />

      {/* Organizer Card */}
      <OrganizerInfoCard
        companyName={companyName}
        companyInitials={companyInitials}
        industry={companyIndustry}
        about={companyAbout}
        onOpenCopyrightModal={onOpenCopyrightModal}
      />

      {/* Action Widget / Evaluation Cards */}
      <ChallengeActionWidget
        state={state}
        resolved={resolved}
        onOpenCopyrightModal={onOpenCopyrightModal}
        onOpenWithdrawModal={onOpenWithdrawModal}
        onJoinChallenge={onJoinChallenge}
        onSubmitInnovation={onSubmitInnovation}
      />
    </aside>
  );
}
