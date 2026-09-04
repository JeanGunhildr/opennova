"use client";

import { useRef } from "react";

interface InviteCodeInputProps {
  code: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export default function InviteCodeInput({ code, onChange, disabled = false }: InviteCodeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    onChange(val);
  }

  return (
    <div
      className={["relative", disabled ? "cursor-not-allowed opacity-50" : "cursor-text"].join(" ")}
      onClick={() => { if (!disabled) inputRef.current?.focus(); }}
    >
      {/* Invisible real input — captures keyboard input */}
      <input
        ref={inputRef}
        type="text"
        value={code}
        maxLength={6}
        onChange={handleChange}
        disabled={disabled}
        aria-label="Kode undangan 6 karakter"
        className="absolute inset-0 w-full h-full opacity-0 cursor-text caret-transparent disabled:cursor-not-allowed"
      />

      {/* Visual slots */}
      <div className="grid grid-cols-6 gap-2.5 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => {
          const char = code[i] ?? "";
          const isFilled = !!char;
          return (
            <div
              key={i}
              className={[
                "h-[70px] rounded-[10px] border flex items-center justify-center text-[26px] font-semibold transition-colors select-none",
                disabled
                  ? "border-gray-200 bg-gray-50 text-gray-300"
                  : isFilled
                  ? "border-primary-500 bg-secondary-50 text-primary-500"
                  : "border-gray-300 bg-white text-gray-300",
              ].join(" ")}
            >
              {char || "·"}
            </div>
          );
        })}
      </div>
    </div>
  );
}