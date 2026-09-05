"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Cari...",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[42px] rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#E30000] focus:bg-white focus:ring-2 focus:ring-[#E30000]/15 transition-all"
      />
    </div>
  );
}
