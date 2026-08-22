import type { Metadata } from "next";
import Hero from "@/component/landing/Hero";
import CollaborationSection from "@/component/landing/CollaborationSection";
import ChallengeSection from "@/component/landing/ChallengeSection";
import IncentiveSection from "@/component/landing/IncentiveSection";

export const metadata: Metadata = {
  title: "OpenNova — Platform Inovasi Terbuka untuk Solver Indonesia",
  description:
    "OpenNova menghubungkan solver terbaik Indonesia dengan tantangan nyata dari perusahaan-perusahaan terkemuka. Temukan challenge, kirim solusi inovatif, dan raih hadiah hingga ratusan juta rupiah.",
  keywords: [
    "inovasi",
    "challenge",
    "solver",
    "hackathon",
    "hadiah",
    "kolaborasi",
    "startup",
    "indonesia",
  ],
  openGraph: {
    title: "OpenNova — Platform Inovasi Terbuka",
    description:
      "Bergabunglah dengan ribuan solver Indonesia dan selesaikan tantangan nyata dari perusahaan-perusahaan terkemuka.",
    type: "website",
    locale: "id_ID",
  },
};

/**
 * OpenNova Solver Landing Page  (/  route)
 *
 * Sections (in order):
 *  1. Hero            — dominant visual thesis, CTAs, partner strip
 *  2. Collaboration   — how the marketplace works (2-col explainer)
 *  3. Challenges      — live challenge card grid (browse surface)
 *  4. Incentives      — financial, certificate, and partnership rewards
 *
 * Navbar and Footer are rendered by the parent (public) layout.
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <CollaborationSection />
      <ChallengeSection />
      <IncentiveSection />
    </>
  );
}