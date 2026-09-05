"use client";

import { useState } from "react";
import { MessageSquareReply, CheckCircle2 } from "lucide-react";
import type { DiscussionThread } from "@/lib/data/seekerDiscussionData";
import InlineReplyComposer from "./InlineReplyComposer";

interface DiscussionThreadCardProps {
  thread: DiscussionThread;
  companyName: string;
  onSendReply: (threadId: string, content: string) => void;
}

export default function DiscussionThreadCard({
  thread,
  companyName,
  onSendReply,
}: DiscussionThreadCardProps) {
  const [isReplying, setIsReplying] = useState(false);

  // Author avatar initials
  const initials = thread.authorName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="border-b border-[#2E2E2E] pb-5 mb-5 last:border-b-0 last:pb-0 last:mb-0">
      {/* ── Parent Thread (Solver Question) ───────────────────── */}
      <div>
        {/* Author Line */}
        <div className="flex items-center justify-between gap-3 mb-2">
          {/* Left: Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#2A2829] border border-[#505050] text-white font-bold text-xs flex items-center justify-center shrink-0">
              {initials}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white truncate">
                {thread.authorName}
              </span>
              <span className="text-[10px] font-medium text-[#A4A4A4] bg-[#2A2829] border border-[#393939] px-2 py-0.5 rounded-[4px]">
                {thread.authorRole}
              </span>
            </div>
          </div>

          {/* Right: Timestamp */}
          <span className="text-[10px] text-[#737373] whitespace-nowrap shrink-0">
            {thread.timestamp}
          </span>
        </div>

        {/* Message Content */}
        <p className="text-xs text-[#C8C8C8] leading-relaxed pl-11 pr-2 whitespace-pre-line">
          {thread.content}
        </p>

        {/* Thread Action: "Balas" button */}
        <div className="pl-11 mt-2.5">
          <button
            type="button"
            onClick={() => setIsReplying((prev) => !prev)}
            className="text-[11px] font-semibold text-[#E30000] hover:text-[#CC0000] inline-flex items-center gap-1 transition-colors"
          >
            <MessageSquareReply size={13} />
            <span>{isReplying ? "Tutup Balasan" : "Balas"}</span>
          </button>
        </div>
      </div>

      {/* ── Nested Official Replies (Seeker Answers) ──────────── */}
      {thread.replies.length > 0 && (
        <div className="space-y-2.5 mt-3">
          {thread.replies.map((reply) => (
            <div
              key={reply.id}
              className="ml-11 pl-3.5 border-l-2 border-[#E30000]/60 bg-[#1F1F1F]/70 rounded-r-[10px] p-3 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white">
                    {reply.authorName || companyName}
                  </span>
                  <span className="bg-[rgba(227,0,0,0.15)] text-[#E30000] border border-[rgba(227,0,0,0.40)] text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10} />
                    <span>Seeker (Penyelenggara)</span>
                  </span>
                </div>

                <span className="text-[10px] text-[#737373] whitespace-nowrap">
                  {reply.timestamp}
                </span>
              </div>

              <p className="text-xs text-[#E5E5E5] leading-relaxed whitespace-pre-line">
                {reply.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Inline Reply Composer ──────────────────────────────── */}
      {isReplying && (
        <InlineReplyComposer
          threadId={thread.id}
          onSendReply={(tId, content) => {
            onSendReply(tId, content);
            setIsReplying(false);
          }}
          onCancel={() => setIsReplying(false)}
        />
      )}
    </div>
  );
}
