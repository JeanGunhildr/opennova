import Link from "next/link";
import { Inbox, Plus } from "lucide-react";

export type ActiveChallengeStatus = "open" | "expert" | "pitching";

export interface ActiveChallengeItem {
  id: string;
  title: string;
  category: string;
  status: ActiveChallengeStatus;
  participants: number;
}

const STATUS_MAP: Record<
  ActiveChallengeStatus,
  { label: string; dotColor: string; bg: string; text: string }
> = {
  open:     { label: "Challenge Dibuka",  dotColor: "#54D67A", bg: "#143520",            text: "#54D67A" },
  expert:   { label: "Penjurian Ahli",    dotColor: "#D8C83A", bg: "#393713",            text: "#D8C83A" },
  pitching: { label: "Pitching Final",    dotColor: "#E30000", bg: "rgba(227,0,0,0.12)", text: "#FF8A8A" },
};

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
            const s = STATUS_MAP[c.status] || STATUS_MAP.open;
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
                  style={{ background: s.dotColor }}
                />

                {/* Title + meta */}
                <div className="min-w-0 pr-2">
                  <p
                    className="text-white font-semibold leading-[1.3] truncate"
                    style={{ fontSize: "15px" }}
                  >
                    {c.title}
                  </p>
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