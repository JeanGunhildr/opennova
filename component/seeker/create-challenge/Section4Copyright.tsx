"use client";
import { useCallback } from "react";
import { FileText, CheckCircle2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

const CARD_STYLE: React.CSSProperties = { background: "#191919", border: "1px solid #373737", borderRadius: "16px", padding: "16px 18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.30)" };
const BADGE_STYLE: React.CSSProperties = { width: "22px", height: "22px", borderRadius: "50%", border: "1px solid #E30000", color: "#E30000", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };

interface Section4Props {
  copyrightFile: File | null;
  onFile: (f: File | null) => void;
}

export default function Section4Copyright({ copyrightFile, onFile }: Section4Props) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [fileError, setFileError] = React.useState<string | null>(null);

  function validateAndSet(file: File) {
    setFileError(null);
    if (file.type !== "application/pdf") { setFileError("Hanya file PDF yang diterima."); return; }
    if (file.size > 50 * 1024 * 1024) { setFileError("Ukuran maksimal 50MB."); return; }
    onFile(file);
  }

  const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) validateAndSet(f); }, []);
  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const onDragLeave = useCallback(() => setIsDragging(false), []);

  return (
    <div style={CARD_STYLE}>
      <div className="flex items-start gap-[10px] mb-4">
        <div style={BADGE_STYLE}>4</div>
        <div>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#F7F7F7" }}>Kesepakatan Hak Cipta Inovasi</h3>
          <p style={{ fontSize: "11px", color: "#737373", marginTop: "3px" }}>
            Unggah dokumen kesepakatan hak cipta yang tersedia di halaman{" "}
            <Link href="/seeker/legal" className="font-bold" style={{ color: "#E30000" }}>Legal &amp; Dokumen</Link>.
          </p>
        </div>
      </div>

      {copyrightFile ? (
        <div className="flex items-center gap-[10px] rounded-[9px]"
          style={{ height: "54px", background: "#171717", border: "1px solid #5C5C5C", padding: "7px 10px" }}>
          <div className="flex items-center justify-center rounded-[8px] flex-shrink-0"
            style={{ width: "38px", height: "38px", background: "#3B1313" }}>
            <FileText size={18} strokeWidth={1.6} style={{ color: "#E30000" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[12px] font-medium truncate">{copyrightFile.name}</p>
            <p style={{ fontSize: "11px", color: "#737373" }}>{(copyrightFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
          <span style={{ color: "#54D67A" }}><CheckCircle2 size={18} strokeWidth={2.2} /></span>
          <button type="button" onClick={() => onFile(null)} className="text-[11px] rounded-full px-2"
            style={{ color: "#737373", border: "1px solid #373737" }}>Ganti</button>
        </div>
      ) : (
        <label onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
          className="flex flex-col items-center justify-center text-center cursor-pointer rounded-[10px] transition-all"
          style={{ height: "132px", background: isDragging ? "rgba(227,0,0,0.06)" : "#232323", border: `1px dashed ${isDragging ? "#E30000" : "#5C5C5C"}`, padding: "18px", boxShadow: isDragging ? "0 0 0 2px rgba(227,0,0,0.15)" : "none" }}>
          <input type="file" accept="application/pdf" className="sr-only" onChange={e => { const f = e.target.files?.[0]; if (f) validateAndSet(f); }} />
          <FileText size={24} strokeWidth={1.4} style={{ color: "#737373", marginBottom: "8px" }} />
          <p style={{ fontSize: "12px", color: "#BDBDBD" }}>Seret file ke sini atau klik untuk unggah</p>
          <p style={{ fontSize: "11px", color: "#737373", marginTop: "2px" }}>PDF file, maks 50MB</p>
        </label>
      )}
      {fileError && <p style={{ fontSize: "11px", color: "#E30000", marginTop: "4px" }}>{fileError}</p>}
    </div>
  );
}

import * as React from "react";