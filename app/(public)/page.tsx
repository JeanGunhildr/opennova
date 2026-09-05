import type { Metadata } from "next";
import Hero from "@/component/landing/Hero";
import CollaborationSection from "@/component/landing/CollaborationSection";
import ChallengeSection from "@/component/landing/ChallengeSection";
import IncentiveSection from "@/component/landing/IncentiveSection";

import { redirect } from "next/navigation";
import { getCurrentRole, getCurrentUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "OpenNova — Platform Open Innovation Nomor 1 di Indonesia",

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
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();
  // console.log(role);
  if (profile?.role == "solver") {
    redirect("/solver");
  } else if (profile?.role == "seeker") {
    redirect("seeker");
  }

  return (
    <>
      <Hero />
      <CollaborationSection />
      <ChallengeSection />
      <IncentiveSection />
    </>
  );
}