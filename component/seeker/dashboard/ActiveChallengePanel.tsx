import Link from "next/link";

type ChallengeStatus = "open" | "expert" | "pitching";

interface ActiveChallenge {
  id: string;
  title: string;
  company: string;
  status: ChallengeStatus;
  participants: number;
}

const CHALLENGES: ActiveChallenge[] = [
  { id: "c1", title: "Inovasi AI untuk Monitoring Jaringan Fiber Optik", company: "Infrastruktur", status: "open",     participants: 83  },
  { id: "c2", title: "Platform Manajemen Energi Terbarukan Smart Grid",  company: "Energi",        status: "expert",   participants: 41  },
  { id: "c3", title: "Solusi Logistik Last-Mile Berbasis Computer Vision",company: "Logistik",      status: "pitching", participants: 12  },
  { id: "c4", title: "Digitalisasi Layanan Pelanggan Berbasis NLP",       company: "Digital",       status: "open",     participants: 156 },
];

const STATUS_MAP: Record<ChallengeStatus, { label: string; dotColor: string; bg: string; text: string }> = {
  open:     { label: "Challenge Dibuka",  dotColor: "#54D67A", bg: "#143520",              text: "#54D67A" },
  expert:   { label: "Penjurian Ahli",    dotColor: "#D8C83A", bg: "#393713",              text: "#D8C83A" },
  pitching: { label: "Pitching Final",    dotColor: "#E30000", bg: "rgba(227,0,0,0.12)",   text: "#FF8A8A" },
};

export default function ActiveChallengePanel() {
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
          Kelola Challenge
        </Link>
      </div>

      {/* List */}
      <div
        className="rounded-[18px]"
        style={{ background: "#171717", border: "1px solid #373737", padding: "16px 18px" }}
      >
        {CHALLENGES.map((c, i) => {
          const s = STATUS_MAP[c.status];
          const isLast = i === CHALLENGES.length - 1;
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
              <div className="min-w-0">
                <p
                  className="text-white font-semibold leading-[1.3] truncate"
                  style={{ fontSize: "15px" }}
                >
                  {c.title}
                </p>
                <p className="text-[12px] mt-0.5 truncate" style={{ color: "#737373" }}>
                  {c.company}
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
                <p className="font-bold text-white leading-none" style={{ fontSize: "25px" }}>
                  {c.participants}
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: "#737373" }}>
                  peserta
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}