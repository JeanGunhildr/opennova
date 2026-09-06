"use client";

import { ArrowLeft } from "lucide-react";
import type { AuthView } from "./AuthModal";

interface TermsViewProps {
  onNavigate: (view: AuthView) => void;
  isDark?: boolean;
}

export default function TermsView({ onNavigate, isDark }: TermsViewProps) {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center pt-6 pb-4 px-9 shrink-0">
        <h1
          className={`text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-center ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {isDark ? "Daftar Sebagai Seeker" : "Daftar Sebagai Solver"}
        </h1>
      </div>

      {/* Scrollable terms body */}
      <div
        className={`flex-1 overflow-y-auto auth-scroll px-9 pb-2 ${
          isDark ? "scrollbar-thin scrollbar-thumb-[#393939] scrollbar-track-transparent" : ""
        }`}
      >
        <h2
          className={`text-[17px] font-bold underline mb-4 leading-[1.35] ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Syarat &amp; Ketentuan
        </h2>
        <p className={`text-[15px] leading-[1.65] mb-6 ${isDark ? "text-[#C8C8C8]" : "text-[#626262]"}`}>
          Dengan mendaftar dan menggunakan platform ini, Anda menyetujui Syarat &amp; Ketentuan berikut. Mohon dibaca dengan saksama sebelum melanjutkan pendaftaran.
        </p>

        {/* Section 1 */}
        <div className="mb-6">
          <p className={`text-[15px] font-bold leading-[1.5] mb-3 ${isDark ? "text-[#E0E0E0]" : "text-[#626262]"}`}>
            1. Definisi
          </p>
          <ul className="space-y-3">
            {[
              "Platform mengacu pada situs web opennova beserta seluruh layanan di dalamnya.",
              "Seeker adalah organisasi (korporasi, BUMN, pemerintah daerah, institusi pendidikan, UMKM) yang mengunggah tantangan/permasalahan di Platform.",
              "Solver adalah individu atau tim yang mengajukan solusi atas tantangan yang diunggah Seeker.",
              "Tantangan (Challenge) adalah permasalahan yang diposting Seeker beserta kriteria, hadiah, dan batas waktu.",
              "Submission berupa solusi, proposal, atau materi pendukung yang diunggah Solver untuk suatu Tantangan.",
            ].map((item, i) => (
              <li key={i} className={`text-[15px] leading-[1.65] flex gap-2 ${isDark ? "text-[#C8C8C8]" : "text-[#626262]"}`}>
                <span className={`shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full ${isDark ? "bg-[#E30000]" : "bg-[#A2A2A2]"}`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 2 */}
        <div className="mb-6">
          <p className={`text-[15px] font-bold leading-[1.5] mb-3 ${isDark ? "text-[#E0E0E0]" : "text-[#626262]"}`}>
            2. Kelayakan Akun
          </p>
          <ul className="space-y-3">
            {[
              "Pengguna wajib berusia minimal 17 tahun.",
              "Satu individu/organisasi hanya diperbolehkan memiliki satu akun aktif, kecuali mendapat izin tertulis dari opennova.",
            ].map((item, i) => (
              <li key={i} className={`text-[15px] leading-[1.65] flex gap-2 ${isDark ? "text-[#C8C8C8]" : "text-[#626262]"}`}>
                <span className={`shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full ${isDark ? "bg-[#E30000]" : "bg-[#A2A2A2]"}`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-6">
          <p className={`text-[15px] font-bold leading-[1.5] mb-3 ${isDark ? "text-[#E0E0E0]" : "text-[#626262]"}`}>
            3. Peran Pengguna
          </p>
          <ul className="space-y-3">
            {[
              "Pengguna memilih peran sebagai Solver atau Seeker saat pendaftaran. Perubahan atau penambahan peran dapat diajukan melalui pengaturan akun dan tunduk pada proses verifikasi tambahan (khususnya untuk peran Seeker).",
              "Seeker wajib melengkapi verifikasi legalitas organisasi (NPWP/dokumen legal lain) sebelum dapat memposting Tantangan berhadiah.",
            ].map((item, i) => (
              <li key={i} className={`text-[15px] leading-[1.65] flex gap-2 ${isDark ? "text-[#C8C8C8]" : "text-[#626262]"}`}>
                <span className={`shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full ${isDark ? "bg-[#E30000]" : "bg-[#A2A2A2]"}`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 4 */}
        <div className="mb-6">
          <p className={`text-[15px] font-bold leading-[1.5] mb-3 ${isDark ? "text-[#E0E0E0]" : "text-[#626262]"}`}>
            4. Kekayaan Intelektual
          </p>
          <ul className="space-y-3">
            {[
              "Hak cipta atas Submission tetap dimiliki Solver hingga terjadi kesepakatan transfer IP secara tertulis dengan Seeker melalui mekanisme yang difasilitasi Platform.",
              "Dengan mengunggah Submission, Solver memberikan izin terbatas kepada opennova dan panel juri terkait untuk meninjau, mengevaluasi, dan menampilkan Submission secara anonim dalam proses penilaian.",
              "Transfer IP penuh atas solusi pemenang hanya berlaku setelah kontrak disepakati dan pembayaran hadiah diproses melalui sistem escrow Platform.",
            ].map((item, i) => (
              <li key={i} className={`text-[15px] leading-[1.65] flex gap-2 ${isDark ? "text-[#C8C8C8]" : "text-[#626262]"}`}>
                <span className={`shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full ${isDark ? "bg-[#E30000]" : "bg-[#A2A2A2]"}`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 5 */}
        <div className="mb-2">
          <p className={`text-[15px] font-bold leading-[1.5] mb-3 ${isDark ? "text-[#E0E0E0]" : "text-[#626262]"}`}>
            5. Privasi Data
          </p>
          <ul className="space-y-3">
            {[
              "Data pribadi Pengguna dikelola sesuai Kebijakan Privasi opennova dan tunduk pada Undang-Undang Perlindungan Data Pribadi (UU PDP) yang berlaku di Indonesia.",
              "Data digunakan untuk keperluan verifikasi, pencocokan Tantangan, pemrosesan pembayaran, dan peningkatan layanan Platform.",
            ].map((item, i) => (
              <li key={i} className={`text-[15px] leading-[1.65] flex gap-2 ${isDark ? "text-[#C8C8C8]" : "text-[#626262]"}`}>
                <span className={`shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full ${isDark ? "bg-[#E30000]" : "bg-[#A2A2A2]"}`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer — sticky */}
      <div className="shrink-0 flex items-center justify-between px-9 pt-3 pb-6">
        <button
          type="button"
          onClick={() => onNavigate("REGISTER_2")}
          className="flex items-center gap-1.5 text-[15px] font-medium text-[#E30000] hover:text-[#CC0000] transition-colors min-h-[44px] cursor-pointer"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
        <button
          type="button"
          onClick={() => onNavigate("LOGIN")}
          className="h-[46px] px-8 rounded-full bg-[#E30000] hover:bg-[#CC0000] active:scale-[0.98] text-white text-[15px] font-semibold transition-all shadow-[0_4px_14px_rgba(227,0,0,0.3)] cursor-pointer"
        >
          Terima
        </button>
      </div>
    </>
  );
}