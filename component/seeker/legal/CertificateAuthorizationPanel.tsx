import { Award } from "lucide-react";
import SignatureUploadCard from "./SignatureUploadCard";
import SignatoryForm from "./SignatoryForm";

export default function CertificateAuthorizationPanel() {
  return (
    <div className="mt-7">
      {/* Intro panel */}
      <div
        className="rounded-[18px] p-[18px_20px] mb-6"
        style={{ background: "#232323", border: "1px solid #373737", boxShadow: "0 1px 3px rgba(0,0,0,0.32)" }}
      >
        <div className="flex items-center gap-2.5">
          <Award size={20} style={{ color: "#E30000", flexShrink: 0 }} strokeWidth={1.8} />
          <h2 className="text-white font-bold" style={{ fontSize: "17px" }}>
            Berkas Otorisasi Sertifikat
          </h2>
        </div>
        <p className="mt-3 text-[15px] leading-[1.55]" style={{ color: "#BDBDBD", maxWidth: "1000px" }}>
          Data ini disimpan sekali dan digunakan otomatis setiap kali Opennova menerbitkan sertifikat untuk pemenang Challenge Anda dan tidak perlu diisi ulang tiap challenge.
        </p>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Signature upload */}
        <SignatureUploadCard />

        {/* Right — Signatory form */}
        <div
          className="rounded-[18px] p-[20px_22px] flex flex-col"
          style={{ background: "#232323", border: "1px solid #373737", minHeight: "430px" }}
        >
          <h3 className="text-white font-bold" style={{ fontSize: "18px" }}>
            Penanggung Jawab (Signatory)
          </h3>
          <p className="mt-1.5 text-[14px] leading-[1.55] max-w-[450px]" style={{ color: "#BDBDBD" }}>
            Nama dan jabatan yang akan tercantum di bawah tanda tangan pada sertifikat.
          </p>
          <SignatoryForm />
        </div>
      </div>
    </div>
  );
}