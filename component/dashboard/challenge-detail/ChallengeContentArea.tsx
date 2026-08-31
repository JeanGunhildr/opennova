// ChallengeContentArea.tsx — Styled per JSONC spec
// Section headings with circular icon, description paragraphs,
// 2-col criteria cards, and vertical timeline.

import { FileText, BarChart3, Calendar, CheckCircle2 } from "lucide-react";

export interface ChallengeContentAreaProps {
  description: string;
}

// ── Sub-components ─────────────────────────────────────────

function SectionHeading({ icon: Icon, title }: { icon: typeof FileText; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <div className="w-[30px] h-[30px] rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-primary-500" strokeWidth={1.8} />
      </div>
      <h2 className="text-[17px] font-bold text-gray-900">{title}</h2>
    </div>
  );
}

const CRITERIA = [
  {
    header: "Inovasi & Orisinalitas",
    items: [
      { title: "Kebaruan Solusi", desc: "Seberapa baru dan unik pendekatan yang diusulkan dibanding solusi yang ada." },
      { title: "Tingkat Inovasi", desc: "Kemampuan solusi untuk menjawab masalah dengan cara yang belum pernah dicoba." },
      { title: "Diferensiasi", desc: "Apa yang membuat solusi ini berbeda dari alternatif yang sudah ada di pasar." },
    ],
  },
  {
    header: "Kelayakan & Dampak",
    items: [
      { title: "Implementasi Teknis", desc: "Ketepatan teknologi yang dipilih dan kejelasan rencana implementasi." },
      { title: "Skalabilitas", desc: "Kemampuan solusi untuk berkembang dan menjangkau pengguna yang lebih luas." },
      { title: "Dampak Sosial & Ekonomi", desc: "Manfaat nyata yang dapat dirasakan oleh pengguna akhir dan masyarakat." },
    ],
  },
];

const TIMELINE = [
  { date: "1 Sep 2026", title: "Pembukaan Pendaftaran", desc: "Periode pendaftaran peserta dibuka untuk semua solver yang memenuhi syarat.", active: false, done: true },
  { date: "17 Nov 2026", title: "Pengumpulan Submission", desc: "Batas akhir pengiriman solusi dan dokumen pendukung.", active: true, done: false },
  { date: "1 Des 2026", title: "Seleksi & Penilaian Ahli", desc: "Tim juri ahli menilai submission yang masuk secara menyeluruh.", active: false, done: false },
  { date: "15 Des 2026", title: "Pitching Final", desc: "Finalis terpilih mempresentasikan solusi langsung kepada panel juri.", active: false, done: false },
  { date: "31 Des 2026", title: "Pengumuman Pemenang", desc: "Hasil akhir dan pemenang challenge diumumkan secara resmi.", active: false, done: false },
];

export default function ChallengeContentArea({ description }: ChallengeContentAreaProps) {
  return (
    <div className="flex flex-col gap-8">

      {/* ── Deskripsi ──────────────────────────────────────── */}
      <section>
        <SectionHeading icon={FileText} title="Deskripsi Challenge" />
        <div className="flex flex-col gap-3" style={{ maxWidth: "680px" }}>
          {description.split("\n\n").map((para, i) => (
            <p key={i} className="text-[13px] leading-[1.7] text-gray-600">{para}</p>
          ))}

          {/* Bullet goals */}
          <div className="flex flex-col gap-2.5 mt-2">
            {[
              "Mengembangkan solusi berbasis AI/ML yang dapat di-deploy di lingkungan enterprise.",
              "Menyediakan dashboard monitoring real-time dengan alerting otomatis.",
              "Menjamin skalabilitas untuk jaringan skala nasional dengan ribuan node.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 size={14} className="text-primary-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-[13px] text-gray-600 leading-[1.6]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kriteria Penilaian ─────────────────────────────── */}
      <section>
        <SectionHeading icon={BarChart3} title="Kriteria Penilaian" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
          {CRITERIA.map((card) => (
            <div key={card.header} className="bg-white border border-gray-200 rounded-[14px] overflow-hidden">
              <div className="px-3.5 py-3 border-b border-gray-200">
                <p className="text-[13px] font-semibold text-primary-500">{card.header}</p>
              </div>
              <div className="px-3.5 py-3 flex flex-col gap-2.5">
                {card.items.map((item) => (
                  <div key={item.title} className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                      <span className="text-[13px] font-semibold text-gray-800">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-[1.4] pl-3">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Linimasa / Timeline ────────────────────────────── */}
      <section>
        <SectionHeading icon={Calendar} title="Linimasa" />
        <div className="relative pl-[22px]">
          {/* Vertical line */}
          <div className="absolute left-[5px] top-[10px] bottom-[10px] w-px bg-gray-300" />

          {TIMELINE.map((item, idx) => (
            <div key={idx} className="relative pb-[17px] last:pb-0">
              {/* Marker */}
              <div
                className={[
                  "absolute rounded-full",
                  item.active || item.done
                    ? "border-2 border-primary-500 bg-white"
                    : "border-2 border-gray-300 bg-white",
                ].join(" ")}
                style={{ width: "10px", height: "10px", left: "-21px", top: "2px" }}
              />

              <p
                className={[
                  "text-[11px] font-bold leading-none mb-0.5",
                  item.active || item.done ? "text-primary-500" : "text-gray-400",
                ].join(" ")}
              >
                {item.date}
              </p>
              <p className="text-[13px] font-semibold text-gray-800 leading-tight">{item.title}</p>
              <p className="text-[11px] text-gray-500 leading-[1.4] mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}