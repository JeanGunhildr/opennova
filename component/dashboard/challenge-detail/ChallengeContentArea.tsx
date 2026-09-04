"use client";

import { FileText, Target, FileCheck, BarChart3, Calendar, CheckCircle2, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

export interface ObjectiveItem {
  id?: string;
  content: string;
}

export interface RequirementItem {
  id?: string;
  content: string;
}

export interface CriterionItem {
  id?: string;
  stage: string;
  name: string;
  description: string | null;
}

export interface TimelineItem {
  id?: string;
  title: string;
  description?: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface ChallengeContentAreaProps {
  description: string;
  activeTab?: string;
  objectives?: ObjectiveItem[];
  requirements?: RequirementItem[];
  criteria?: CriterionItem[];
  timelines?: TimelineItem[];
  expertWeight?: number;
  pitchWeight?: number;
}

/**
 * Returns template description for linimasa stage title if description is not explicitly provided.
 */
function getTimelineStageDescription(title: string, customDesc?: string | null): string {
  if (customDesc && customDesc.trim().length > 0) {
    return customDesc;
  }

  const t = title.toLowerCase().trim();

  if (t.includes("dibuka") || t.includes("buka") || t.includes("pendaftaran") || t.includes("registrasi")) {
    return "Challenge dipublikasikan dan dapat mulai dikerjakan oleh Solver.";
  }
  if (t.includes("penjurian") || t.includes("evaluasi") || t.includes("screening") || t.includes("ahli")) {
    return "Dewan juri dari pihak Seeker menilai solusi & inovasi yang diajukan.";
  }
  if (t.includes("pitching") || t.includes("presentasi") || t.includes("final")) {
    return "Beberapa Solver terpilih mempresentasikan solusinya langsung di hadapan Seeker.";
  }
  if (t.includes("pengumuman") || t.includes("pemenang") || t.includes("hadiah")) {
    return "Hasil akhir diumumkan dan hadiah dicairkan ke pemenang challenge.";
  }

  return "Tahap pelaksanaan kegiatan sesuai dengan jadwal yang telah ditentukan oleh Seeker.";
}

function SectionHeading({ icon: Icon, title }: { icon: typeof FileText; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-2.5">
      <div className="w-[28px] h-[28px] rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-primary-500" strokeWidth={1.8} />
      </div>
      <h2 className="text-[16px] font-bold text-gray-900">{title}</h2>
    </div>
  );
}

/**
 * Formats date string to 'D MMMM YYYY' with full Indonesian month name (e.g. 15 Oktober 2026)
 */
function formatTimelineDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";

  const MONTHS_ID_FULL = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Handle YYYY-MM-DD or ISO timestamp
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = match[1];
    const monthIndex = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${day} ${MONTHS_ID_FULL[monthIndex]} ${year}`;
    }
  }

  // Try parsing standard JS Date
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const day = d.getDate();
    const month = MONTHS_ID_FULL[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }

  return dateStr;
}

export default function ChallengeContentArea({
  description,
  activeTab = "Deskripsi",
  objectives = [],
  requirements = [],
  criteria = [],
  timelines = [],
  expertWeight = 50,
  pitchWeight = 50,
}: ChallengeContentAreaProps) {
  const [discussionInput, setDiscussionInput] = useState("");
  const [comments, setComments] = useState([
    {
      id: "c1",
      author: "Rizky Pratama",
      role: "Solver",
      time: "2 hari yang lalu",
      text: "Apakah pengumpulan berkas proposal wajib menyertakan arsitektur sistem lengkap?",
    },
    {
      id: "c2",
      author: "Tim Seeker",
      role: "Seeker",
      time: "1 hari yang lalu",
      text: "Halo Rizky! Ya, arsitektur sistem cukup dicantumkan pada bagian lampiran proposal PDF.",
    },
  ]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionInput.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        author: "Saya",
        role: "Solver",
        time: "Baru saja",
        text: discussionInput.trim(),
      },
    ]);
    setDiscussionInput("");
  };

  // Determine section visibility
  const showAll = activeTab === "Deskripsi";
  const showKetentuan = showAll || activeTab === "Ketentuan";
  const showKriteria = showAll || activeTab === "Kriteria Penilaian";
  const showLinimasa = showAll || activeTab === "Linimasa";
  const showDiskusi = activeTab.toLowerCase().includes("diskusi");

  // Fallbacks if arrays are empty
  const defaultObjectives = objectives.length > 0 ? objectives : [
    { content: "Pemantauan suhu real-time pada unit penyimpanan vaksin di puskesmas dan posyandu wilayah 3T." },
    { content: "Notifikasi dini saat suhu keluar dari ambang aman, dikirim ke tenaga kesehatan setempat maupun dinas kesehatan." },
    { content: "Biaya implementasi rendah dan dapat diproduksi/dirawat menggunakan komponen yang mudah didapat di Indonesia." },
  ];

  const defaultRequirements = requirements.length > 0 ? requirements : [
    { content: "Dokumen proposal teknis dalam format PDF, maksimal 15 halaman." },
    { content: "Prototipe, mockup, atau simulasi dapat dilampirkan dalam format ZIP (opsional)." },
    { content: "Ukuran total berkas maksimal 25MB per pengajuan." },
    { content: "Solusi wajib merupakan karya orisinal dan belum pernah dipublikasikan atau diikutsertakan pada challenge lain." },
  ];

  const expertCriteria = criteria.filter(
    (c) =>
      c.stage?.toLowerCase() === "expert" ||
      c.stage?.toLowerCase().includes("expert") ||
      c.stage?.toLowerCase().includes("ahli")
  );

  const pitchCriteria = criteria.filter(
    (c) =>
      c.stage?.toLowerCase() === "pitch" ||
      c.stage?.toLowerCase().includes("pitch") ||
      c.stage?.toLowerCase().includes("final")
  );

  const defaultExpertCriteria = expertCriteria.length > 0 ? expertCriteria : [
    { name: "Kelayakan Teknis", description: "Kematangan teknis dan kemungkinan solusi untuk diimplementasikan." },
    { name: "Inovasi & Orisinalitas", description: "Keunikan pendekatan dan kebaruan dari solusi yang diajukan." },
    { name: "Dampak & Skalabilitas", description: "Potensi manfaat bagi wilayah 3T dan potensi diperluas ke daerah lain." },
  ];

  const defaultPitchCriteria = pitchCriteria.length > 0 ? pitchCriteria : [
    { name: "Biaya & Sumber Daya", description: "Kematangan teknis dan kemungkinan solusi untuk diimplementasikan." },
    { name: "Kesiapan Implementasi", description: "Keunikan pendekatan dan kebaruan dari solusi yang diajukan." },
    { name: "Kejelasan Model", description: "Potensi manfaat bagi wilayah 3T dan potensi diperluas ke daerah lain." },
  ];

  const defaultTimelines: TimelineItem[] = timelines.length > 0 ? timelines : [
    { title: "Challenge Dibuka", start_date: "2026-08-01", end_date: "2026-09-05" },
    { title: "Penjurian Ahli", start_date: "2026-09-06", end_date: "2026-10-12" },
    { title: "Pitching Final", start_date: "2026-10-13", end_date: "2026-10-31" },
    { title: "Pengumuman Pemenang", start_date: "2026-11-01", end_date: "2026-11-20" },
  ];

  return (
    <div className="flex flex-col gap-4 mt-1">
      {/* ── Deskripsi / Tentang Challenge ──────────────────────── */}
      {(showAll || activeTab === "Deskripsi") && !showDiskusi && (
        <section className="bg-white border border-gray-200 rounded-[16px] p-5 shadow-2xs">
          <SectionHeading icon={FileText} title="Tentang Challenge" />
          <div className="flex flex-col gap-2.5 text-gray-600 leading-[1.65] text-[13.5px]">
            {description.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Tujuan Inovasi */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <Target size={14} className="text-primary-500" />
              </div>
              <h3 className="text-[15px] font-bold text-gray-900">Tujuan Inovasi</h3>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              {defaultObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-primary-500 flex-shrink-0 mt-0.5" strokeWidth={2.2} />
                  <span className="text-[13.5px] text-gray-700 leading-[1.55]">{obj.content}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Ketentuan Pengumpulan ────────────────────────────── */}
      {showKetentuan && !showDiskusi && (
        <section className="bg-white border border-gray-200 rounded-[16px] p-5 shadow-2xs">
          <SectionHeading icon={FileCheck} title="Ketentuan Pengumpulan" />
          <ul className="flex flex-col gap-2 list-disc pl-5 text-[13.5px] text-gray-700 leading-[1.55]">
            {defaultRequirements.map((req, i) => (
              <li key={i}>{req.content}</li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Kriteria Penilaian ─────────────────────────────── */}
      {showKriteria && !showDiskusi && (
        <section className="bg-white border border-gray-200 rounded-[16px] p-5 shadow-2xs">
          <SectionHeading icon={BarChart3} title="Kriteria Penilaian" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3">
            {/* Penjurian Ahli */}
            <div className="bg-gray-50 border border-gray-200 rounded-[12px] p-3.5">
              <div className="flex items-center justify-between mb-2.5 border-b border-gray-200 pb-1.5">
                <h3 className="text-[13.5px] font-bold text-primary-500">
                  Penjurian Ahli
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                  Bobot: {expertWeight}%
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {defaultExpertCriteria.map((item, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                      <span className="text-[13.5px] font-bold text-gray-900">{item.name}</span>
                    </div>
                    {item.description && (
                      <p className="text-[11.5px] text-gray-500 pl-3.5 leading-[1.35]">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pitching Final */}
            <div className="bg-gray-50 border border-gray-200 rounded-[12px] p-3.5">
              <div className="flex items-center justify-between mb-2.5 border-b border-gray-200 pb-1.5">
                <h3 className="text-[13.5px] font-bold text-primary-500">
                  Pitching Final
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                  Bobot: {pitchWeight}%
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {defaultPitchCriteria.map((item, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                      <span className="text-[13.5px] font-bold text-gray-900">{item.name}</span>
                    </div>
                    {item.description && (
                      <p className="text-[11.5px] text-gray-500 pl-3.5 leading-[1.35]">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Linimasa Challenge ────────────────────────────── */}
      {showLinimasa && !showDiskusi && (
        <section className="bg-white border border-gray-200 rounded-[16px] p-5 shadow-2xs">
          <SectionHeading icon={Calendar} title="Linimasa Challenge" />
          <div className="relative pl-[24px] mt-4">
            {/* Vertical timeline line */}
            <div className="absolute left-[6px] top-[6px] bottom-[6px] w-[2px] bg-red-200" />

            {defaultTimelines.map((item, idx) => {
              const formattedStart = formatTimelineDate(item.start_date);
              const formattedEnd = formatTimelineDate(item.end_date);
              const dateRange = formattedEnd
                ? `${formattedStart || ""} - ${formattedEnd}`
                : formattedStart || "Selesai";

              const stageDescription = getTimelineStageDescription(item.title, item.description);

              return (
                <div key={idx} className="relative pb-5 last:pb-0">
                  {/* Timeline dot */}
                  <div className="absolute w-[12px] h-[12px] rounded-full border-2 border-primary-500 bg-white left-[-24px] top-[3px]" />

                  <p className="text-[11px] font-bold text-primary-500 tracking-wide uppercase mb-0.5">
                    {dateRange}
                  </p>
                  <p className="text-[14.5px] font-bold text-gray-900 leading-tight">{item.title}</p>
                  <p className="text-[12px] text-gray-600 mt-1 leading-[1.45]">
                    {stageDescription}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Diskusi / Comments Section ──────────────────────── */}
      {showDiskusi && (
        <section className="bg-white border border-gray-200 rounded-[16px] p-5 shadow-2xs">
          <SectionHeading icon={MessageSquare} title="Diskusi & Tanya Jawab" />

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="flex gap-2.5 mb-5 mt-3">
            <input
              type="text"
              value={discussionInput}
              onChange={(e) => setDiscussionInput(e.target.value)}
              placeholder="Tanyakan sesuatu tentang challenge ini..."
              className="flex-1 h-[42px] px-4 rounded-full border border-gray-300 bg-gray-50 text-[13.5px] text-gray-900 outline-none focus:border-primary-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="h-[42px] px-5 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-[13px] font-semibold flex items-center gap-2 transition-colors"
            >
              <Send size={14} />
              Kirim
            </button>
          </form>

          {/* Comment List */}
          <div className="flex flex-col gap-3">
            {comments.map((c) => (
              <div key={c.id} className="p-3.5 bg-gray-50 border border-gray-100 rounded-[12px]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-bold text-gray-900">{c.author}</span>
                    <span className="text-[10.5px] font-medium px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                      {c.role}
                    </span>
                  </div>
                  <span className="text-[11.5px] text-gray-400">{c.time}</span>
                </div>
                <p className="text-[13px] text-gray-700 mt-1">{c.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}