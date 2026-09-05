import { Download, FileBadge2 } from "lucide-react";

export default function CertificateTemplateCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5">
      {/* Preview thumbnail */}
      <div
        className="w-full sm:w-[220px] flex-shrink-0 aspect-[297/210] rounded-[12px] border-2 flex flex-col items-center justify-center gap-2 relative overflow-hidden"
        style={{ borderColor: "#E30000" }}
      >
        <div className="absolute inset-2 rounded-[8px] border border-gray-200" />
        <FileBadge2 size={30} className="text-primary-500 relative" strokeWidth={1.6} />
        <p className="relative text-[11px] font-bold text-gray-700 tracking-wide text-center px-4">
          SERTIFIKAT PENGHARGAAN
        </p>
        <p className="relative text-[9px] text-gray-400 text-center px-6 leading-snug">
          [ Nama Pemenang / Tim ]
        </p>
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-[16px] font-bold text-gray-900">
          Template Sertifikat Penghargaan
        </h2>
        <p className="text-[14px] text-gray-500 mt-1 leading-relaxed">
          Unduh template resmi untuk sertifikat pemenang challenge. Lengkapi nama
          pemenang, nama challenge, dan tanda tangan otorisasi seeker sebelum
          dikirim ke Solver.
        </p>

        <a
          href="/certificates/template-sertifikat-opennova.pdf"
          download
          className="mt-4 inline-flex items-center gap-2 h-[42px] px-5 rounded-full bg-[#E30000] hover:bg-[#CC0000] text-white text-[14px] font-semibold transition-colors"
        >
          <Download size={16} strokeWidth={2.2} />
          Download Template (PDF)
        </a>
      </div>
    </div>
  );
}
