"use client";

import { useLandingMode } from "@/component/landing/LandingModeContext";
import CollaborationSection from "@/component/landing/CollaborationSection";
import ChallengeSection from "@/component/landing/ChallengeSection";
import IncentiveSection from "@/component/landing/IncentiveSection";
import InnovationCategories from "@/component/landing/InnovationCategories";
import SeekerTestimonials from "@/component/landing/SeekerTestimonials";
import SeekerFinalCTA from "@/component/landing/SeekerFinalCTA";

export default function LandingSections() {
  const { isSeeker } = useLandingMode();

  return (
    <>
      {/* Workflow steps section: adapts copy & id to Seeker or Solver */}
      <CollaborationSection />

      {/* ── Solver Mode Sections ────────────────────── */}
      {!isSeeker && (
        <>
          <ChallengeSection />
          <IncentiveSection />
        </>
      )}

      {/* ── Seeker Mode Sections ────────────────────── */}
      {isSeeker && (
        <div className="w-full">
          {/* 15 Categories infinite marquee */}
          <InnovationCategories />

          {/* Testimonials & Final CTA */}
          <div className="px-5 sm:px-6 md:px-8 lg:px-10">
            <SeekerTestimonials />
            <SeekerFinalCTA />
          </div>
        </div>
      )}
    </>
  );
}
