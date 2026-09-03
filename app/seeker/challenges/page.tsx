"use client";

import { useState } from "react";
import ChallengeHeader from "@/component/seeker/challenges/ChallengeHeader";
import ChallengeTabs from "@/component/seeker/challenges/ChallengeTabs";
import type { TabId } from "@/component/seeker/challenges/ChallengeTabs";
import SeekerChallengeGrid from "@/component/seeker/challenges/SeekerChallengeGrid";

export default function SeekerChallengesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");

  return (
    <div className="min-h-screen pt-14 lg:pt-0" style={{ background: "#171717" }}>
      <div className="w-full max-w-[1160px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-8 lg:py-8 xl:py-10">
        <ChallengeHeader />
        <ChallengeTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <SeekerChallengeGrid activeTab={activeTab} />
      </div>
    </div>
  );
}