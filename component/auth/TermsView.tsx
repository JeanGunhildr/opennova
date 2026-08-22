"use client";

import type { AuthView } from "./AuthModal";

interface TermsViewProps {
  onNavigate: (view: AuthView) => void;
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function TermsView({ onNavigate }: TermsViewProps) {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center pt-6 pb-4 px-9 shrink-0">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-gray-900 text-center">
          Daftar Sebagai Solver
        </h1>
      </div>

      {/* Scrollable terms body */}
      <div className="flex-1 overflow-y-auto auth-scroll px-9 pb-2">
        <h2 className="text-[17px] font-bold text-gray-900 underline mb-4 leading-[1.35]">
          Syarat &amp; Ketentuan
        </h2>
        <p className="text-[15px] text-[#626262] leading-[1.65] mb-6">
          Dengan mendaftar dan menggunakan platform ini, Anda menyetujui Syarat &amp; Ketentuan berikut. Mohon dibaca dengan saksama sebelum melanjutkan pendaftaran.
        </p>

        {/* Section 1 */}
        <div className="mb-6">
          <p className="text-[15px] font-bold text-[#626262] leading-[1.5] mb-3">1. Definisi</p>
          <ul className="space-y-3">
            {[
              "Platform mengacu pada situs web opennova beserta seluruh layanan di dalamnya.",
              "Seeker adalah organisasi (korporasi, BUMN, pemerintah daerah, institusi pendidikan, UMKM) yang mengunggah tantangan/permasalahan di Platform.",
              "Solver adalah individu atau tim yang mengajukan solusi atas tantangan yang diunggah Seeker.",
              "Tantangan (Challenge) adalah permasalahan yang diposting Seeker beserta kriteria, hadiah, dan batas waktu.",
              "Submission berupa solusi, proposal, atau materi pendukung yang diunggah Solver untuk suatu Tantangan.",
            ].map((item, i) => (
              <li key={i} className="text-[15px] text-[#626262] leading-[1.65] flex gap-2">
                <span className="shrink-0 mt-[3px] w-1.5 h-1.5 rounded-full bg-[#A2A2A2]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 2 */}
        <div className="mb-6">
          <p className="text-[15px] font-bold text-[#626262] leading-[1.5] mb-3">2. Kelayakan Akun</p>
          <ul className="space-y-3">
            {[
              "Pengguna wajib berusia minimal 17 tahun.",
              "Satu individu/organisasi hanya diperbolehkan memiliki satu akun aktif, kecuali mendapat izin tertulis dari opennova.",
            ].map((item, i) => (
              <li key={i} className="text-[15px] text-[#626262] leading-[1.65] flex gap-2">
                <span className="shrink-0 mt-[3px] w-1.5 h-1.5 rounded-full bg-[#A2A2A2]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-6">
          <p className="text-[15px] font-bold text-[#626262] leading-[1.5] mb-3">3. Peran Pengguna</p>
          <ul className="space-y-3">
            {[
              "Pengguna memilih peran sebagai Solver atau Seeker saat pendaftaran. Perubahan atau penambahan peran dapat diajukan melalui pengaturan akun dan tunduk pada proses verifikasi tambahan (khususnya untuk peran Seeker).",
              "Seeker wajib melengkapi verifikasi legalitas organisasi (NPWP/dokumen legal lain) sebelum dapat memposting Tantangan berhadiah.",
            ].map((item, i) => (
              <li key={i} className="text-[15px] text-[#626262] leading-[1.65] flex gap-2">
                <span className="shrink-0 mt-[3px] w-1.5 h-1.5 rounded-full bg-[#A2A2A2]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 4 */}
        <div className="mb-6">
          <p className="text-[15px] font-bold text-[#626262] leading-[1.5] mb-3">4. Kekayaan Intelektual</p>
          <ul className="space-y-3">
            {[
              "Hak cipta atas Submission tetap dimiliki Solver hingga terjadi kesepakatan transfer IP secara tertulis dengan Seeker melalui mekanisme yang difasilitasi Platform.",
              "Dengan mengunggah Submission, Solver memberikan izin terbatas kepada opennova dan panel juri terkait untuk meninjau, mengevaluasi, dan menampilkan Submission secara anonim dalam proses penilaian.",
              "Transfer IP penuh atas solusi pemenang hanya berlaku setelah kontrak disepakati dan pembayaran hadiah diproses melalui sistem escrow Platform.",
            ].map((item, i) => (
              <li key={i} className="text-[15px] text-[#626262] leading-[1.65] flex gap-2">
                <span className="shrink-0 mt-[3px] w-1.5 h-1.5 rounded-full bg-[#A2A2A2]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 5 */}
        <div className="mb-2">
          <p className="text-[15px] font-bold text-[#626262] leading-[1.5] mb-3">5. Privasi Data</p>
          <ul className="space-y-3">
            {[
              "Data pribadi Pengguna dikelola sesuai Kebijakan Privasi opennova dan tunduk pada Undang-Undang Perlindungan Data Pribadi (UU PDP) yang berlaku di Indonesia.",
              "Data digunakan untuk keperluan verifikasi, pencocokan Tantangan, pemrosesan pembayaran, dan peningkatan layanan Platform.",
            ].map((item, i) => (
              <li key={i} className="text-[15px] text-[#626262] leading-[1.65] flex gap-2">
                <span className="shrink-0 mt-[3px] w-1.5 h-1.5 rounded-full bg-[#A2A2A2]" />
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
          className="flex items-center gap-1.5 text-[15px] font-medium text-[#E9201E] hover:text-[#D91817] transition-colors min-h-[44px]"
        >
          <ArrowLeft />
          Kembali
        </button>
        <button
          type="button"
          onClick={() => onNavigate("LOGIN")}
          className="h-[46px] px-8 rounded-full bg-[#E9201E] hover:bg-[#D91817] active:bg-[#B91413] text-white text-[15px] font-semibold transition-colors"
        >
          Terima
        </button>
      </div>
    </>
  );
}