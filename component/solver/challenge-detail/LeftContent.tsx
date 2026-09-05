"use client";

import { useState } from "react";
import {
  FileText,
  Check,
  ListChecks,
  Scale,
  Calendar,
  Sparkles,
} from "lucide-react";
import DiscussionForum from "./DiscussionForum";

interface LeftContentProps {
  description: string;
}

const TABS = [
  { id: "description", label: "Deskripsi", target: "about-challenge" },
  { id: "requirements", label: "Ketentuan", target: "submission-requirements" },
  { id: "criteria", label: "Kriteria Penilaian", target: "evaluation-criteria" },
  { id: "timeline", label: "Linimasa", target: "challenge-timeline" },
  { id: "discussion", label: "Diskusi", target: "discussion-forum" },
];

export default function LeftContent({ description }: LeftContentProps) {
  const [activeTab, setActiveTab] = useState<string>("description");
  const isDiscussion = activeTab === "discussion";

  const handleTabClick = (tabId: string, targetId: string) => {
    setActiveTab(tabId);
    if (tabId === "discussion") {
      return;
    }

    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  return (
    <div className="flex flex-col min-w-0">
      {/* ── Sub-Navbar ─────────────────────────────── */}
      <nav
        className="h-[53px] sticky top-0 z-20 bg-[#F6F8FA] border-b border-gray-200 flex items-stretch gap-6 overflow-x-auto overflow-y-hidden no-scrollbar"
        aria-label="Sub navigasi challenge"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id, tab.target)}
              className={`h-[53px] px-1.5 relative inline-flex items-center whitespace-nowrap transition-colors ${
                isActive
                  ? "text-[13px] font-semibold text-gray-800"
                  : "text-[13px] font-medium text-gray-400 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {isActive && (
                <span
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#E30000]"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Content Switch: Discussion OR Informational ───── */}
      {isDiscussion ? (
        <div className="mt-5">
          <DiscussionForum />
        </div>
      ) : (
        <div className="flex flex-col gap-8 pt-6">
          {/* Section 1: Tentang Challenge & Tujuan Inovasi */}
          <section id="about-challenge" className="scroll-mt-[60px] flex flex-col gap-6">
            {/* 1. Tentang Challenge */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-red-50 text-[#E30000] flex items-center justify-center shrink-0">
                  <FileText size={16} strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Tentang Challenge
                </h3>
              </div>
              <div className="text-sm font-normal text-gray-600 leading-relaxed space-y-4">
                {description.split("\n\n").map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* 2. Tujuan Inovasi */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-red-50 text-[#E30000] flex items-center justify-center shrink-0">
                  <Sparkles size={16} strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Tujuan Inovasi
                </h3>
              </div>
              <div className="space-y-2.5">
                {[
                  "Mengembangkan model deteksi anomali real-time untuk memprediksi gangguan sinyal optik pada router edge.",
                  "Mereduksi mean time to repair (MTTR) insiden jaringan fiber optik minimum sebesar 35%.",
                  "Menghadirkan arsitektur inferensi berbobot ringan yang dapat dideploy pada hardware server eksisting tanpa penambahan lisensi mahal.",
                  "Menyediakan antarmuka visualisasi alert otomatis yang intuitif untuk operator Network Operation Center (NOC).",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#E30000] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      <Check size={10} strokeWidth={2.8} />
                    </span>
                    <span className="text-sm font-normal text-gray-600 leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2: Ketentuan Pengumpulan */}
          <section id="submission-requirements" className="scroll-mt-[60px]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-red-50 text-[#E30000] flex items-center justify-center shrink-0">
                <ListChecks size={16} strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Ketentuan Pengumpulan
              </h3>
            </div>
            <ul className="space-y-2.5 text-sm text-gray-600">
              {[
                "Dokumen proposal teknis dalam format PDF (maksimal 20 halaman, ukuran file maksimal 25MB).",
                "Proposal wajib menyertakan diagram arsitektur model AI, pipeline data preprocessing, dan estimasi latency inferensi.",
                "Tautan repositori publik/private (GitHub/GitLab) yang memuat kode sumber pengujian dan instruksi reproduksi hasil.",
                "Video demonstrasi berdurasi maksimal 5 menit yang diunggah ke Google Drive atau YouTube (Unlisted) memperlihatkan pipeline berjalan.",
                "Seluruh berkas disimpan dalam satu folder Google Drive bersama dengan akses permission 'Anyone with the link can view' (Viewer).",
              ].map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-800 shrink-0 mt-2" />
                  <span className="text-sm font-normal text-gray-600 leading-relaxed">
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3: Kriteria Penilaian */}
          <section id="evaluation-criteria" className="scroll-mt-[60px]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-red-50 text-[#E30000] flex items-center justify-center shrink-0">
                <Scale size={16} strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Kriteria Penilaian
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stage 1 Card */}
              <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden">
                <h4 className="text-sm font-bold text-[#E30000] p-3.5 border-b border-gray-200">
                  Penjurian Ahli
                </h4>
                <div className="p-3.5 space-y-4">
                  {[
                    {
                      name: "Kelayakan Teknis (35%)",
                      desc: "Kematangan arsitektur AI, modularitas pipeline telemetry, serta akurasi deteksi anomali pada benchmark data uji.",
                    },
                    {
                      name: "Inovasi & Orisinalitas (35%)",
                      desc: "Kebaruan pendekatan dibanding sistem alarm statis konvensional yang sudah ada di industri telekomunikasi.",
                    },
                    {
                      name: "Dampak & Skalabilitas (30%)",
                      desc: "Potensi implementasi langsung pada jaringan skala nasional dan efisiensi konsumsi RAM/CPU server.",
                    },
                  ].map((crit, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E30000] shrink-0 mt-1.5" />
                      <div>
                        <strong className="text-xs font-semibold text-gray-800 leading-snug block">
                          {crit.name}
                        </strong>
                        <p className="text-[11px] font-normal text-gray-500 leading-normal mt-0.5">
                          {crit.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage 2 Card */}
              <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden">
                <h4 className="text-sm font-bold text-[#E30000] p-3.5 border-b border-gray-200">
                  Pitching Final
                </h4>
                <div className="p-3.5 space-y-4">
                  {[
                    {
                      name: "Biaya & Sumber Daya (35%)",
                      desc: "Efisiensi modal dan estimasi Return on Investment (ROI) biaya operasional deployment tahun pertama.",
                    },
                    {
                      name: "Kesiapan Implementasi (35%)",
                      desc: "Roadmap integrasi ke sistem Network Operation Center (NOC) Telkom dan ketersediaan dokumentasi API.",
                    },
                    {
                      name: "Kejelasan Presentasi (30%)",
                      desc: "Kemampuan tim mempertahankan konsep teknis dalam sesi tanya jawab live bersama dewan juri ahli.",
                    },
                  ].map((crit, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E30000] shrink-0 mt-1.5" />
                      <div>
                        <strong className="text-xs font-semibold text-gray-800 leading-snug block">
                          {crit.name}
                        </strong>
                        <p className="text-[11px] font-normal text-gray-500 leading-normal mt-0.5">
                          {crit.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Linimasa Challenge */}
          <section id="challenge-timeline" className="scroll-mt-[60px]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-red-50 text-[#E30000] flex items-center justify-center shrink-0">
                <Calendar size={16} strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Linimasa Challenge
              </h3>
            </div>
            <div className="relative pl-6 space-y-6 mt-4">
              {/* Connecting Track Line: Solid vertical red line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-[#E30000]" />

              {[
                {
                  stage: "CHALLENGE DIBUKA",
                  date: "1 Okt 2026 – 17 Nov 2026",
                  desc: "Pendaftaran peserta individu/tim dan masa pengumpulan berkas proposal solusi.",
                },
                {
                  stage: "PENJURIAN AHLI",
                  date: "18 Nov 2026 – 25 Nov 2026",
                  desc: "Penilaian berkas dan pengumuman peserta yang lolos ke babak Pitching Final.",
                },
                {
                  stage: "PITCHING FINAL",
                  date: "28 Nov 2026 – 29 Nov 2026",
                  desc: "Sesi presentasi langsung dan tanya jawab mendalam bersama panel juri Seeker.",
                },
                {
                  stage: "PENGUMUMAN PEMENANG",
                  date: "5 Des 2026",
                  desc: "Penetapan pemenang resmi dan pencairan dana hadiah ke akun solver terpilih.",
                },
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Node marker: Red hollow circle */}
                  <span className="w-[16px] h-[16px] rounded-full bg-white border-2 border-[#E30000] absolute -left-[24px] top-0.5" />
                  <span className="text-xs font-bold text-[#E30000] uppercase tracking-wide block">
                    {item.date}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900 mt-0.5">
                    {item.stage}
                  </h4>
                  <p className="text-xs font-normal text-gray-500 leading-relaxed mt-0.5">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
