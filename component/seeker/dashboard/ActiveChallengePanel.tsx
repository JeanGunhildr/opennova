import Link from "next/link";
import { Inbox, Plus } from "lucide-react";
import { getStatusBadge } from "@/lib/utils/seekerChallengeHelper";

export interface ActiveChallengeItem {
  id: string;
  title: string;
  category: string;
  status: string;
  participants: number;
}

interface ActiveChallengePanelProps {
  challenges?: ActiveChallengeItem[];
}

export default function ActiveChallengePanel({
  challenges = [],
}: ActiveChallengePanelProps) {
  return (
    <div>
      {/* Panel header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold" style={{ fontSize: "20px" }}>
          Daftar Challenge Aktif
        </h2>
        <Link
          href="/seeker/challenges"
          className="inline-flex items-center h-[34px] px-[14px] rounded-full text-[12px] font-semibold transition-colors"
          style={{ background: "#FFFFFF", color: "#171717" }}
        >
          Lihat Semua
        </Link>
      </div>

      {/* Content */}
      {challenges.length === 0 ? (
        <div
          className="rounded-[18px] p-8 text-center flex flex-col items-center justify-center min-h-[260px]"
          style={{ background: "#171717", border: "1px solid #373737" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
            style={{ background: "#232323", border: "1px solid #373737" }}
          >
            <Inbox size={22} className="text-[#737373]" strokeWidth={1.7} />
          </div>
          <p className="text-white font-semibold text-[15px]">
            Belum Ada Challenge Aktif
          </p>
          <p
            className="text-[12px] mt-1 max-w-[320px] leading-[1.5]"
            style={{ color: "#737373" }}
          >
            Seluruh challenge Anda telah selesai atau Anda belum mempublikasikan
            challenge baru.
          </p>
          <Link
            href="/seeker/challenges/new"
            className="inline-flex items-center gap-1.5 mt-4 px-4 h-9 rounded-full text-[12px] font-semibold text-white bg-[#E30000] hover:bg-[#CC0000] transition-colors"
          >
            <Plus size={14} strokeWidth={2.2} />
            Buat Challenge Baru
          </Link>
        </div>
      ) : (
        <div
          className="rounded-[18px]"
          style={{
            background: "#171717",
            border: "1px solid #373737",
            padding: "16px 18px",
          }}
        >
          {challenges.map((c, i) => {
            const s = getStatusBadge(c.status);
            const isLast = i === challenges.length - 1;
            return (
              <div
                key={c.id}
                className="grid items-center gap-3 py-[14px]"
                style={{
                  gridTemplateColumns: "10px minmax(0,1fr) auto 64px",
                  borderBottom: isLast ? "none" : "1px solid #373737",
                  minHeight: "74px",
                }}
              >
                {/* Status dot */}
                <span
                  className="w-[10px] h-[10px] rounded-full flex-shrink-0"
                  style={{ background: s.text }}
                />

                {/* Title + meta */}
                <div className="min-w-0 pr-2">
                  <Link
                    href={`/seeker/challenges/${c.id}`}
                    className="text-white font-semibold leading-[1.3] truncate hover:text-[#FF6B6B] transition-colors block"
                    style={{ fontSize: "15px" }}
                  >
                    {c.title}
                  </Link>
                  <p
                    className="text-[12px] mt-0.5 truncate"
                    style={{ color: "#737373" }}
                  >
                    {c.category}
                  </p>
                </div>

                {/* Status pill */}
                <span
                  className="inline-flex items-center h-[30px] px-3 rounded-full text-[12px] font-medium whitespace-nowrap flex-shrink-0"
                  style={{ background: s.bg, color: s.text }}
                >
                  {s.label}
                </span>

                {/* Participant count */}
                <div className="text-right">
                  <p
                    className="font-bold text-white leading-none"
                    style={{ fontSize: "25px" }}
                  >
                    {c.participants}
                  </p>
                  <p
                    className="text-[12px] mt-0.5"
                    style={{ color: "#737373" }}
                  >
                    peserta
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
