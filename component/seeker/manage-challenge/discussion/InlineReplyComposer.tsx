"use client";

import { useState } from "react";
import { CornerDownRight, Send } from "lucide-react";

interface InlineReplyComposerProps {
  threadId: string;
  onSendReply: (threadId: string, content: string) => void;
  onCancel: () => void;
}

export default function InlineReplyComposer({
  threadId,
  onSendReply,
  onCancel,
}: InlineReplyComposerProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSendReply(threadId, content.trim());
    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="ml-11 mt-3 flex flex-col gap-2.5 bg-[#1F1F1F] border border-[#393939] rounded-[10px] p-3 animate-in fade-in duration-150"
    >
      <div className="flex items-start gap-2">
        <CornerDownRight size={15} className="text-[#E30000] shrink-0 mt-1" />
        <textarea
          rows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Balas pertanyaan ini secara resmi sebagai Penyelenggara..."
          className="w-full bg-transparent text-xs text-white placeholder:text-[#6E6E6E] outline-none resize-y leading-relaxed"
          autoFocus
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2E2E2E]">
        <button
          type="button"
          onClick={onCancel}
          className="h-[30px] px-3 rounded-full text-[11px] font-medium text-[#A4A4A4] hover:text-white hover:bg-[#2A2829] transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={!content.trim()}
          className="h-[30px] px-3.5 rounded-full bg-[#E30000] hover:bg-[#CC0000] disabled:bg-[#393939] disabled:text-[#737373] text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors disabled:cursor-not-allowed shadow-sm"
        >
          <Send size={12} />
          <span>Kirim Balasan</span>
        </button>
      </div>
    </form>
  );
}
