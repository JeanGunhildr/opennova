"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import ChallengeHero from "./ChallengeHero";
import type { HeroStatus } from "./ChallengeHero";
import ChallengeMetadata from "./ChallengeMetadata";
import ChallengeTabs from "./ChallengeTabs";
import ChallengeContentArea from "./ChallengeContentArea";
import SeekerInfoCard from "./SeekerInfoCard";
import ChallengeActionWidget, {
  type ChallengeActionState,
  type CaptainTeamOption
} from "./ChallengeActionWidget";
import ScorePanel, { type ScoreCriterion } from "./ScorePanel";
import type { ObjectiveItem, RequirementItem, CriterionItem, TimelineItem } from "./ChallengeContentArea";
import type { DiscussionComment } from "@/lib/actions/discussion";

export interface ChallengeDetailClientProps {
  id: string;
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
  thumbnailPath?: string | null;
  objectives?: ObjectiveItem[];
  requirements?: RequirementItem[];
  criteria?: CriterionItem[];
  timelines?: TimelineItem[];
  discussions?: DiscussionComment[];
  expertWeight?: number;
  pitchWeight?: number;
  verified?: boolean;
  // Seeker profile fields
  jenisPerusahaan?: string | null;
  deskripsiPerusahaan?: string | null;
  alamatDomain?: string | null;
  // Participation & Action widget props
  userParticipationState?: ChallengeActionState;
  userTeamName?: string;
  captainTeams?: CaptainTeamOption[];
  existingSubmissionUrl?: string | null;
  // Score panel props
  scoreCriteria?: ScoreCriterion[];
  isFullyJudged?: boolean;
}

export default function ChallengeDetailClient({
  id,
  category,
  title,
  company,
  companyInitials,
  companyAbout,
  companyIndustry,
  companyWebsite,
  reward,
  deadline,
  participantCount,
  status,
  description,
  heroStatus,
  thumbnailPath,
  objectives = [],
  requirements = [],
  criteria = [],
  timelines = [],
  discussions = [],
  expertWeight = 50,
  pitchWeight = 50,
  verified = false,
  jenisPerusahaan,
  deskripsiPerusahaan,
  alamatDomain,
  userParticipationState = "ACTIVE_NOT_JOINED",
  userTeamName = "",
  captainTeams = [],
  existingSubmissionUrl = "",
  scoreCriteria = [],
  isFullyJudged = false,
}: ChallengeDetailClientProps) {
  const [activeTab, setActiveTab] = useState<string>("Deskripsi");
  const [discussionCount, setDiscussionCount] = useState<number>(discussions.length);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-9">
      {/* Breadcrumb / Top Bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-500 font-medium">Jelajah</span>
          <span className="text-[13px] text-gray-400">/</span>
          <span className="text-[13px] font-bold text-gray-800 truncate max-w-[320px]">
            {title}
          </span>
        </div>

        <Link
          href="/solver"
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white border border-gray-300 text-[12px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
        >
          <ArrowLeft size={13} strokeWidth={2} />
          Kembali
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start max-w-[1160px]">
        {/* Left Column — min-h-0 ensures proper overflow for sticky to work */}
        <div className="flex flex-col gap-4 min-w-0 min-h-0">
          <ChallengeHero
            id={id}
            category={category}
            title={title}
            company={company}
            companyInitials={companyInitials}
            verified
            heroStatus={heroStatus}
            thumbnailPath={thumbnailPath}
          />

          <ChallengeMetadata
            reward={reward}
            deadline={deadline}
            participantCount={participantCount}
            status={status}
          />

          {/* Tabs */}
          <ChallengeTabs
            discussionCount={discussionCount}
            onTabChange={(tab) => setActiveTab(tab)}
          />

          {/* Content Area filtered by activeTab */}
          <ChallengeContentArea
            challengeId={id}
            description={description}
            activeTab={activeTab}
            objectives={objectives}
            requirements={requirements}
            criteria={criteria}
            timelines={timelines}
            discussions={discussions}
            expertWeight={expertWeight}
            pitchWeight={pitchWeight}
            onDiscussionCountChange={setDiscussionCount}
          />
        </div>

        {/* Right Column (Sticky Sidebar) — top-8 so it stops 32px from viewport top */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-8 self-start">
          {/* Seeker Information & Hadiah Card */}
          <SeekerInfoCard
            companyName={company}
            companyInitials={companyInitials}
            industry={companyIndustry}
            about={companyAbout}
            website={companyWebsite}
            verified={verified}
            reward={reward}
            deadline={deadline}
            jenisPerusahaan={jenisPerusahaan}
            deskripsiPerusahaan={deskripsiPerusahaan}
            alamatDomain={alamatDomain}
          />

          {/* Join / Submission Interactive Action Widget (placed below per request) */}
          <ChallengeActionWidget
            challengeId={id}
            initialState={userParticipationState}
            teamName={userTeamName}
            captainTeams={captainTeams}
            existingSubmissionUrl={existingSubmissionUrl}
          />

          {/* Render ScorePanel below ChallengeActionWidget if solver has submitted */}
          {Boolean(existingSubmissionUrl) && scoreCriteria.length > 0 && (
            <ScorePanel
              criteria={scoreCriteria}
              expertWeight={expertWeight}
              pitchWeight={pitchWeight}
              isFullyJudged={isFullyJudged}
            />
          )}

          {/* Alert Notice Box matching screenshot for Team Members */}
          {userParticipationState === "ACTIVE_JOINED_TEAM_MEMBER" && (
            <div className="bg-[#FFF8E6] border border-[#FBE3B5] rounded-[14px] p-4 flex items-start gap-3 text-[12px] text-[#8C6210] leading-[1.5]">
              <AlertCircle size={18} className="text-[#D9822B] flex-shrink-0 mt-0.5" />
              <p>
                Anda sedang mengikuti challenge ini sebagai Anggota Tim. Submission hanya dapat dilakukan oleh Ketua Tim.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
