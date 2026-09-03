"use client";

import { useState } from "react";

const FIELDS = [
  { name: "fullName",    label: "NAMA LENGKAP",                           placeholder: "Masukkan nama..."      },
  { name: "position",   label: "JABATAN / POSISI",                        placeholder: "Masukkan jabatan..."   },
  { name: "institution",label: "NAMA INSTANSI (DITAMPILKAN DI SERTIFIKAT)", placeholder: "Masukkan instansi..." },
] as const;

type FieldName = typeof FIELDS[number]["name"];

const INITIAL = { fullName: "Budi Santoso", position: "Direktur Inovasi", institution: "PT Telkom Indonesia" };

export default function SignatoryForm() {
  const [values, setValues] = useState<Record<FieldName, string>>(INITIAL);
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);

  function handleChange(name: FieldName, value: string) {
    setValues(prev => ({ ...prev, [name]: value }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // In production: call API
    alert("Perubahan disimpan.");
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-3.5 mt-6 flex-1">
      {FIELDS.map(({ name, label, placeholder }) => {
        const isFocused = focusedField === name;
        return (
          <div key={name} className="flex flex-col gap-[7px]">
            <label
              htmlFor={`signatory-${name}`}
              className="text-[12px] font-bold leading-[1.3]"
              style={{ color: "#BDBDBD", textTransform: "uppercase", letterSpacing: "0.01em" }}
            >
              {label}
            </label>
            <input
              id={`signatory-${name}`}
              type="text"
              value={values[name]}
              placeholder={placeholder}
              onChange={e => handleChange(name, e.target.value)}
              onFocus={() => setFocusedField(name)}
              onBlur={() => setFocusedField(null)}
              className="w-full text-[14px] text-white outline-none transition-all"
              style={{
                height: "46px",
                background: "#171717",
                border: isFocused ? "1px solid #E30000" : "1px solid #373737",
                borderRadius: "10px",
                padding: "0 14px",
                boxShadow: isFocused ? "0 0 0 2px rgba(227,0,0,0.14)" : "none",
              }}
            />
          </div>
        );
      })}

      {/* Save button */}
      <button
        type="submit"
        className="self-start mt-1 inline-flex items-center justify-center text-white text-[14px] font-semibold bg-[#E30000] hover:bg-[#CC0000] active:bg-[#B30000] transition-colors rounded-full"
        style={{ height: "42px", padding: "0 18px" }}
      >
        Simpan Perubahan
      </button>
    </form>
  );
}