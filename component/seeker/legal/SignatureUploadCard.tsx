import { CheckCircle2, FileImage } from "lucide-react";
import UploadDropzone from "./UploadDropzone";

const CURRENT_FILE = {
  name: "tanda-tangan.png",
  uploadDate: "12 Agustus 2026",
  size: "240 KB",
  status: "Aktif",
};

export default function SignatureUploadCard() {
  return (
    <div
      className="rounded-[18px] p-[20px_22px] flex flex-col"
      style={{ background: "#232323", border: "1px solid #373737", minHeight: "430px" }}
    >
      {/* Section heading */}
      <h3 className="text-white font-bold" style={{ fontSize: "18px" }}>
        Tanda Tangan / Cap Resmi
      </h3>
      <p className="mt-1.5 text-[14px] leading-[1.55] max-w-[450px]" style={{ color: "#BDBDBD" }}>
        Format PNG transparan, akan ditempelkan sebagai bukti resmi di setiap sertifikat pemenang.
      </p>

      {/* Current file row */}
      <div
        className="flex items-center gap-3 mt-[26px] rounded-[12px]"
        style={{
          height: "70px",
          background: "#171717",
          border: "1px solid #5C5C5C",
          padding: "8px 12px",
        }}
      >
        {/* Preview */}
        <div
          className="flex items-center justify-center rounded-[8px] flex-shrink-0"
          style={{ width: "74px", height: "46px", background: "#FFFFFF" }}
        >
          <FileImage size={22} className="text-gray-400" strokeWidth={1.4} />
        </div>

        {/* File info */}
        <div className="flex flex-col gap-[3px] min-w-0 flex-1">
          <p
            className="text-[14px] font-semibold text-white truncate"
          >
            {CURRENT_FILE.name}
          </p>
          <p className="text-[12px]" style={{ color: "#737373" }}>
            {CURRENT_FILE.uploadDate} &middot; {CURRENT_FILE.size}
          </p>
        </div>

        {/* Status badge */}
        <span
          className="flex-shrink-0 inline-flex items-center gap-1 h-[30px] px-3 rounded-full text-[12px] font-semibold"
          style={{ background: "#143520", color: "#54D67A" }}
        >
          <CheckCircle2 size={12} strokeWidth={2.2} />
          {CURRENT_FILE.status}
        </span>
      </div>

      {/* Dropzone */}
      <UploadDropzone />
    </div>
  );
}