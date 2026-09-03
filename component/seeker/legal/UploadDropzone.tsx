"use client";

import { useState, useCallback } from "react";
import { UploadCloud } from "lucide-react";

interface UploadDropzoneProps {
  onFileAccepted?: (file: File) => void;
}

export default function UploadDropzone({ onFileAccepted }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  function validateAndAccept(file: File) {
    setErrorMsg(null);
    setAccepted(false);
    if (file.type !== "image/png") {
      setErrorMsg("File harus berformat PNG transparan.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Ukuran file melebihi batas 2MB.");
      return;
    }
    setAccepted(true);
    onFileAccepted?.(file);
  }

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndAccept(file);
  }, []);

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) validateAndAccept(file);
  }

  const isError = !!errorMsg;

  let borderColor = "#5C5C5C";
  let bg = "#171717";
  let glow = "none";
  let primaryTextColor = "#BDBDBD";

  if (isDragging) {
    borderColor = "#E30000";
    bg = "rgba(227,0,0,0.08)";
    glow = "0 0 0 2px rgba(227,0,0,0.14)";
  } else if (accepted) {
    borderColor = "#54D67A";
    bg = "#143520";
  } else if (isError) {
    borderColor = "#E30000";
    bg = "#3B1313";
    primaryTextColor = "#C61A1A";
  }

  return (
    <label
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className="flex flex-col items-center justify-center text-center cursor-pointer rounded-[12px] transition-all duration-150 mt-3.5"
      style={{
        height: "162px",
        border: `1px dashed ${borderColor}`,
        background: bg,
        boxShadow: glow,
        padding: "20px",
      }}
    >
      <input
        type="file"
        accept="image/png"
        className="sr-only"
        onChange={onInputChange}
      />
      <UploadCloud
        size={28}
        strokeWidth={1.6}
        style={{ color: isDragging || isError ? borderColor : "#8C8C8C", marginBottom: "10px" }}
      />
      {isError ? (
        <>
          <p className="text-[14px] font-medium" style={{ color: primaryTextColor }}>
            {errorMsg}
          </p>
          <p className="text-[12px] mt-0.5" style={{ color: "#737373" }}>
            Coba lagi dengan file yang sesuai
          </p>
        </>
      ) : accepted ? (
        <p className="text-[14px] font-medium" style={{ color: "#54D67A" }}>
          File berhasil diunggah!
        </p>
      ) : (
        <>
          <p className="text-[14px] font-medium leading-[1.4]" style={{ color: "#BDBDBD" }}>
            {isDragging ? "Lepaskan file di sini" : "Seret file ke sini atau klik untuk unggah ulang"}
          </p>
          <p className="text-[12px] mt-0.5" style={{ color: "#737373" }}>
            PNG transparan, maks 2MB
          </p>
        </>
      )}
    </label>
  );
}