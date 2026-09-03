"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import CopyrightOptionCard from "./CopyrightOptionCard";
import type { CopyrightOption } from "./CopyrightOptionCard";

const OPTIONS: CopyrightOption[] = [
  {
    id: "full-transfer",
    title: "Transfer Penuh",
    description: "Hak cipta atas solusi pemenang dialihkan sepenuhnya kepada Seeker setelah hadiah dicairkan.",
    downloadEnabled: true,
  },
  {
    id: "non-exclusive-license",
    title: "Lisensi Non-Eksklusif",
    description: "Seeker memperoleh izin pakai, Solver tetap memegang hak cipta utama atas solusinya.",
    downloadEnabled: false,
  },
  {
    id: "continued-collaboration",
    title: "Kolaborasi Lanjutan",
    description: "Tidak ada pengalihan hak cipta otomatis dan dinegosiasikan langsung dengan Solver pemenang.",
    downloadEnabled: false,
  },
];

const INFO_BULLETS = [
  "Pilih opsi pengalihan hak cipta inovasi sesuai dengan keperluan anda. Download template dokumen yang telah disediakan oleh Opennova, lalu lengkapi semua data dan unggah kembali pada challenge yang anda buat. ",
  "Opennova mematuhi ketentuan perundang-undangan yang berlaku di Indonesia, termasuk Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta, dalam pengaturan kesepakatan pengalihan hak kekayaan intelektual antara Seeker dan Solver.",
];

export default function CopyrightAgreementPanel() {
  const [selected, setSelected] = useState("full-transfer");

  return (
    <div className="mt-7">
      {/* Information banner */}
      <div
        className="rounded-[18px] p-[18px_20px]"
        style={{
          background: "#232323",
          border: "1px solid #373737",
          boxShadow: "0 1px 3px rgba(0,0,0,0.32)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <FileText size={20} style={{ color: "#E30000", flexShrink: 0 }} strokeWidth={1.8} />
          <h2 className="text-white font-bold" style={{ fontSize: "17px" }}>
            Template Kesepakatan Hak Cipta Inovasi
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {INFO_BULLETS.map((text, i) => (
            <div key={i} className="grid items-start gap-[10px]" style={{ gridTemplateColumns: "14px minmax(0,1fr)" }}>
              <span
                className="rounded-full flex-shrink-0"
                style={{ width: "10px", height: "10px", background: "#FFFFFF", marginTop: "7px" }}
              />
              <p className="text-[15px] leading-[1.55]" style={{ color: "#BDBDBD" }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Options section */}
      <div className="mt-7">
        <h3 className="text-white font-bold mb-4" style={{ fontSize: "18px" }}>
          Jenis Pengalihan Hak Cipta (Default)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {OPTIONS.map(opt => (
            <CopyrightOptionCard
              key={opt.id}
              option={opt}
              selected={selected === opt.id}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>
    </div>
  );
}