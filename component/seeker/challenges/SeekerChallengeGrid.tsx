"use client";

import Link from "next/link";
import { Plus, Inbox } from "lucide-react";
import type { SeekerChallenge } from "./SeekerChallengeCard";
import SeekerChallengeCard from "./SeekerChallengeCard";
import type { TabId } from "./ChallengeTabs";

const ACTIVE_LIFECYCLES = new Set(["open", "expert", "pitching"]);
const COMPLETED_LIFECYCLES = new Set(["winner"]);

interface SeekerChallengeGridProps {
  activeTab: TabId;
  challenges: SeekerChallenge[];
}

export default function SeekerChallengeGrid({ activeTab, challenges }: SeekerChallengeGridProps) {
  const filtered = challenges.filter((c) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return ACTIVE_LIFECYCLES.has(c.lifecycle);
    if (activeTab === "completed") return COMPLETED_LIFECYCLES.has(c.lifecycle);
    return true;
  });

  if (filtered.length === 0) {
    const isAll = activeTab === "all";
    const isActive = activeTab === "active";

    return (
      <div
        className="flex flex-col items-center justify-center py-20 px-6 rounded-[18px] mt-7 text-center"
        style={{ background: "#191919", border: "1px solid #373737" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: "#232323", border: "1px solid #373737" }}
        >
          <Inbox size={24} className="text-[#737373]" strokeWidth={1.7} />
        </div>

        <p className="text-white font-bold text-[18px]">
          {isAll
            ? "Belum Ada Challenge"
            : isActive
            ? "Tidak Ada Challenge Aktif"
            : "Tidak Ada Challenge Selesai"}
        </p>

        <p className="text-[14px] mt-1.5 max-w-[420px] leading-[1.5]" style={{ color: "#737373" }}>
          {isAll
            ? "Anda belum mempublikasikan challenge apa pun. Mulai buat challenge pertama Anda untuk menemukan solusi terbaik dari inovator."
            : isActive
            ? "Saat ini tidak ada challenge yang sedang berlangsung di tahap pembukaan atau penjurian."
            : "Belum ada challenge yang telah menyelesaikan seluruh tahapan penilaian akhir."}
        </p>

        {isAll && (
          <Link
            href="/seeker/challenges/new"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-white text-[13px] font-semibold bg-[#E30000] hover:bg-[#CC0000] transition-colors mt-6 shadow-[0_4px_14px_rgba(227,0,0,0.3)]"
          >
            <Plus size={16} strokeWidth={2.2} />
            Buat Challenge Pertama
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
      {filtered.map((c) => (
        <SeekerChallengeCard key={c.id} challenge={c} />
      ))}
    </div>
  );
}