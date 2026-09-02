import type { Metadata } from "next";

import { redirect } from "next/navigation";

import Hero from "@/component/landing/Hero";
import CollaborationSection from "@/component/landing/CollaborationSection";
import ChallengeSection from "@/component/landing/ChallengeSection";
import IncentiveSection from "@/component/landing/IncentiveSection";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";

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

export default async function LandingPage() {
  const user = getCurrentUser();

  return (
    <>
      <Hero />
      <CollaborationSection />
      <ChallengeSection />
      <IncentiveSection />
    </>
  );
}