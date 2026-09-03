import { FileText } from "lucide-react";

export default function LegalHeader() {
  return (
    <div className="flex flex-col gap-1 mb-[22px]">
      {/* Eyebrow */}
      <div className="inline-flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full flex-shrink-0"
          style={{ background: "#FFFFFF", border: "6px solid #5C5C5C" }}
        />
        <span className="text-[14px] font-semibold text-white">Pengelolaan Administrasi</span>
      </div>

      {/* Title */}
      <h1
        className="mt-1 font-bold text-white leading-[1.1]"
        style={{ fontSize: "40px", letterSpacing: "-0.025em" }}
      >
        Legal &amp; Dokumen
      </h1>

      {/* Description */}
      <p className="text-[15px] leading-[1.5] max-w-[860px]" style={{ color: "#A4A4A4" }}>
        Kelola dokumen kesepakatan hak cipta inovasi dan berkas resmi untuk penerbitan sertifikat penghargaan.
      </p>
    </div>
  );
}