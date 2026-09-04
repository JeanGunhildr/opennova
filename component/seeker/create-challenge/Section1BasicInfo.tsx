"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageIcon, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const LABEL_STYLE: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: "#A4A4A4",
  textTransform: "uppercase",
  letterSpacing: "0.015em",
  marginBottom: "6px",
  display: "block",
};
const INPUT_STYLE: React.CSSProperties = {
  height: "38px",
  width: "100%",
  background: "#171717",
  border: "1px solid #373737",
  borderRadius: "9px",
  padding: "0 12px",
  color: "#F7F7F7",
  fontSize: "12px",
  outline: "none",
};
const CARD_STYLE: React.CSSProperties = {
  background: "#191919",
  border: "1px solid #373737",
  borderRadius: "16px",
  padding: "16px 18px 20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.30)",
};
const BADGE_STYLE: React.CSSProperties = {
  width: "22px",
  height: "22px",
  borderRadius: "50%",
  border: "1px solid #E30000",
  color: "#E30000",
  fontSize: "11px",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

interface Section1Props {
  thumbnail: File | null;
  title: string;
  categoryId: string | null;
  onThumbnail: (f: File | null) => void;
  onTitle: (v: string) => void;
  onCategory: (id: string) => void;
}

export default function Section1BasicInfo({
  thumbnail,
  title,
  categoryId,
  onThumbnail,
  onTitle,
  onCategory,
}: Section1Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [thumbError, setThumbError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) {
        console.error("Error loading categories:", error);
        return;
      }

      setCategories(data ?? []);
    }

    fetchCategories();
  }, []);

  function validateAndSet(file: File) {
    setThumbError(null);
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setThumbError("Hanya JPG/PNG yang diterima.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setThumbError("Ukuran maksimal 5MB.");
      return;
    }
    onThumbnail(file);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) validateAndSet(f);
  }, []);
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const onDragLeave = useCallback(() => setIsDragging(false), []);

  return (
    <div style={CARD_STYLE}>
      {/* Section header */}
      <div className="flex items-start gap-[10px] mb-4">
        <div style={BADGE_STYLE}>1</div>
        <div>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#F7F7F7" }}>
            Informasi Dasar
          </h3>
          <p style={{ fontSize: "11px", color: "#737373", marginTop: "3px" }}>
            Thumbnail, judul, dan kategori yang akan tampil di halaman utama
            Solver.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Thumbnail */}
        <div>
          <label style={LABEL_STYLE}>Thumbnail Challenge</label>
          {thumbnail ? (
            <div
              className="flex items-center gap-[10px] rounded-[9px]"
              style={{
                height: "54px",
                background: "#171717",
                border: "1px solid #5C5C5C",
                padding: "7px 10px",
              }}
            >
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="thumb"
                className="rounded-[6px] object-cover flex-shrink-0"
                style={{ width: "64px", height: "40px" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-[12px] font-medium truncate">
                  {thumbnail.name}
                </p>
                <p style={{ fontSize: "11px", color: "#737373" }}>
                  {(thumbnail.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <span className="flex-shrink-0" style={{ color: "#54D67A" }}>
                <CheckCircle2 size={18} strokeWidth={2.2} />
              </span>
              <button
                type="button"
                onClick={() => onThumbnail(null)}
                className="text-[11px] rounded-full px-2"
                style={{ color: "#737373", border: "1px solid #373737" }}
              >
                Ganti
              </button>
            </div>
          ) : (
            <label
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className="flex flex-col items-center justify-center text-center cursor-pointer rounded-[10px] transition-all"
              style={{
                height: "122px",
                background: isDragging ? "rgba(227,0,0,0.06)" : "#232323",
                border: `1px dashed ${isDragging ? "#E30000" : "#5C5C5C"}`,
                padding: "18px",
              }}
            >
              <input
                ref={fileRef}
                type="file"
                name="thumbnail"
                accept="image/jpeg,image/png"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) validateAndSet(f);
                }}
              />
              <ImageIcon
                size={24}
                strokeWidth={1.4}
                style={{ color: "#737373", marginBottom: "8px" }}
              />
              <p style={{ fontSize: "12px", color: "#BDBDBD" }}>
                Seret gambar ke sini atau klik untuk unggah
              </p>
              <p
                style={{ fontSize: "11px", color: "#737373", marginTop: "2px" }}
              >
                JPG/PNG, rasio 16:9, maks 5MB
              </p>
            </label>
          )}
          {thumbError && (
            <p style={{ fontSize: "11px", color: "#E30000", marginTop: "4px" }}>
              {thumbError}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label style={LABEL_STYLE}>Judul Challenge</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            placeholder="Masukkan judul..."
            style={INPUT_STYLE}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.border = "1px solid #E30000";
              (e.target as HTMLInputElement).style.boxShadow =
                "0 0 0 2px rgba(227,0,0,0.15)";
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.border = "1px solid #373737";
              (e.target as HTMLInputElement).style.boxShadow = "none";
            }}
            name="name"
          />
        </div>

        {/* Category pills */}
        <div>
          <label style={LABEL_STYLE}>Bidang / Kategori Inovasi</label>

          <input type="hidden" name="category_id" value={categoryId ?? ""} />

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const sel = categoryId === c.id;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onCategory(c.id)}
                  className="inline-flex items-center rounded-full text-[11px] font-semibold transition-all"
                  style={{
                    height: "30px",
                    padding: "0 11px",
                    background: sel ? "transparent" : "#232323",
                    border: sel ? "1px solid #E30000" : "1px solid transparent",
                    color: sel ? "#F7F7F7" : "#737373",
                  }}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
