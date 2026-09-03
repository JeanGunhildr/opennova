import type { SeekerChallenge } from "./SeekerChallengeCard";
import SeekerChallengeCard from "./SeekerChallengeCard";
import type { TabId } from "./ChallengeTabs";

const ALL_CHALLENGES: SeekerChallenge[] = [
  {
    id: "sc-1",
    title: "Inovasi AI untuk Monitoring Jaringan Fiber Optik Nasional",
    category: "Teknologi & Rekayasa",
    reward: "Rp 75.000.000",
    participants: 83,
    publishedDate: "12 Agu 2026",
    lifecycle: "open",
    bgFrom: "#0d1a2b", bgVia: "#1a2f4a", bgTo: "#0a1520",
  },
  {
    id: "sc-2",
    title: "Platform Manajemen Energi Terbarukan Smart Grid Nasional",
    category: "Energi",
    reward: "Rp 50.000.000",
    participants: 41,
    publishedDate: "5 Agu 2026",
    lifecycle: "expert",
    bgFrom: "#1a1a0a", bgVia: "#2e2e12", bgTo: "#141408",
  },
  {
    id: "sc-3",
    title: "Solusi Logistik Last-Mile Berbasis Computer Vision & AI",
    category: "Logistik",
    reward: "Rp 40.000.000",
    participants: 12,
    publishedDate: "20 Jul 2026",
    lifecycle: "pitching",
    bgFrom: "#1a0a1a", bgVia: "#2e1230", bgTo: "#120814",
  },
  {
    id: "sc-4",
    title: "Digitalisasi Layanan Pelanggan Berbasis Natural Language Processing",
    category: "Digital & AI",
    reward: "Rp 60.000.000",
    participants: 156,
    publishedDate: "1 Agu 2026",
    lifecycle: "open",
    bgFrom: "#0a1a2b", bgVia: "#152a40", bgTo: "#081520",
  },
  {
    id: "sc-5",
    title: "Pengembangan Sistem Pertanian Presisi Berbasis IoT Nasional",
    category: "Agrikultur",
    reward: "Rp 35.000.000",
    participants: 98,
    publishedDate: "15 Jul 2026",
    lifecycle: "open",
    bgFrom: "#0a1a0a", bgVia: "#142814", bgTo: "#081408",
  },
  {
    id: "sc-6",
    title: "Inovasi Fintech untuk Inklusi Keuangan UMKM Indonesia",
    category: "Keuangan",
    reward: "Rp 80.000.000",
    participants: 62,
    publishedDate: "28 Jun 2026",
    lifecycle: "winner",
    bgFrom: "#1a0d0d", bgVia: "#2a1515", bgTo: "#140a0a",
  },
  {
    id: "sc-7",
    title: "Pengembangan Aplikasi Telemedisin Bertenaga AI untuk Daerah 3T",
    category: "Kesehatan",
    reward: "Rp 45.000.000",
    participants: 77,
    publishedDate: "10 Jun 2026",
    lifecycle: "winner",
    bgFrom: "#0a1520", bgVia: "#0d1f2e", bgTo: "#070f18",
  },
];

const ACTIVE_LIFECYCLES = new Set(["open", "expert", "pitching"]);
const COMPLETED_LIFECYCLES = new Set(["winner"]);

interface SeekerChallengeGridProps {
  activeTab: TabId;
}

export default function SeekerChallengeGrid({ activeTab }: SeekerChallengeGridProps) {
  const filtered = ALL_CHALLENGES.filter(c => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return ACTIVE_LIFECYCLES.has(c.lifecycle);
    if (activeTab === "completed") return COMPLETED_LIFECYCLES.has(c.lifecycle);
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 rounded-[18px] mt-7"
        style={{ background: "#191919", border: "1px solid #373737" }}
      >
        <p className="text-white font-semibold text-[16px]">Tidak ada challenge</p>
        <p className="text-[14px] mt-1" style={{ color: "#737373" }}>
          Belum ada challenge di kategori ini.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
      {filtered.map(c => (
        <SeekerChallengeCard key={c.id} challenge={c} />
      ))}
    </div>
  );
}