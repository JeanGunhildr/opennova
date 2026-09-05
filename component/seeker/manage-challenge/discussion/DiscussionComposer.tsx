"use client";

import { useState } from "react";
import { Send, Megaphone } from "lucide-react";

interface DiscussionComposerProps {
  onPostAnnouncement: (content: string) => void;
  isSubmitting?: boolean;
}

export default function DiscussionComposer({
  onPostAnnouncement,
  isSubmitting = false,
}: DiscussionComposerProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;
    onPostAnnouncement(content.trim());
    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-2.5 items-center bg-[#1F1F1F] border border-[#393939] rounded-[12px] p-2.5 mb-6"
    >
      {/* Icon */}
      <div className="hidden md:flex w-8 h-8 rounded-full bg-[rgba(227,0,0,0.1)] border border-[rgba(227,0,0,0.25)] text-[#E30000] items-center justify-center shrink-0 ml-1">
        <Megaphone size={14} />
      </div>

      {/* Input */}
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
        placeholder="Tulis pengumuman resmi atau informasi tambahan untuk para Solver..."
        className="w-full bg-transparent text-xs text-white placeholder:text-[#6E6E6E] outline-none px-2 py-1.5 disabled:opacity-50"
      />

      {/* Kirim Button */}
      <button
        type="submit"
        disabled={!content.trim() || isSubmitting}
        className="h-[34px] px-5 rounded-full bg-[#E30000] hover:bg-[#CC0000] disabled:bg-[#393939] text-white disabled:text-[#737373] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:cursor-not-allowed shadow-sm shrink-0 active:scale-[0.98]"
      >
        <Send size={12} />
        <span>Kirim</span>
      </button>
    </form>
  );
}
