"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import {
  MessageSquare,
  MessageSquareOff,
  Search,
  RefreshCw,
} from "lucide-react";
import type {
  SeekerDiscussionThread,
} from "@/lib/actions/seeker-discussion";
import {
  getSeekerDiscussionsAction,
  postSeekerAnnouncementAction,
  postSeekerReplyAction,
} from "@/lib/actions/seeker-discussion";
import DiscussionComposer from "./DiscussionComposer";
import DiscussionThreadCard from "./DiscussionThreadCard";

interface DiscussionTabProps {
  challengeId: string;
  companyName: string;
  /** Initial threads pre-loaded from server (optional SSR data) */
  initialThreads?: SeekerDiscussionThread[];
}

export default function DiscussionTab({
  challengeId,
  companyName,
  initialThreads = [],
}: DiscussionTabProps) {
  const [threads, setThreads] = useState<SeekerDiscussionThread[]>(initialThreads);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(initialThreads.length > 0);

  // Fetch on mount if no initial data was provided — MUST be in useEffect, not render body
  useEffect(() => {
    if (loaded) return;
    startTransition(async () => {
      const data = await getSeekerDiscussionsAction(challengeId);
      setThreads(data);
      setLoaded(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeId]);

  // Post an official announcement (Seeker top-level post)
  const handlePostAnnouncement = (content: string) => {
    startTransition(async () => {
      const result = await postSeekerAnnouncementAction(challengeId, content);
      if (result.success && result.thread) {
        setThreads((prev) => [result.thread!, ...prev]);
      } else {
        setLoadError(result.error ?? "Gagal memposting pengumuman.");
      }
    });
  };

  // Reply to an existing solver thread as Seeker
  const handleSendReply = (threadId: string, content: string) => {
    startTransition(async () => {
      const result = await postSeekerReplyAction(challengeId, threadId, content);
      if (result.success && result.reply) {
        setThreads((prev) =>
          prev.map((t) => {
            if (t.id !== threadId) return t;
            return {
              ...t,
              replies: [...t.replies, result.reply!],
            };
          })
        );
      } else {
        setLoadError(result.error ?? "Gagal mengirim balasan.");
      }
    });
  };

  // Filter threads by search query
  const filteredThreads = useMemo(() => {
    if (!searchQuery.trim()) return threads;
    const q = searchQuery.toLowerCase();
    return threads.filter(
      (t) =>
        t.authorName.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q) ||
        t.replies.some((r) => r.content.toLowerCase().includes(q))
    );
  }, [threads, searchQuery]);

  return (
    <div className="w-full bg-[#191919] border border-[#393939] rounded-[14px] p-5 md:p-6 shadow-sm mt-6 animate-in fade-in duration-150">
      {/* ── Header Bar ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2E2E2E] mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[rgba(227,0,0,0.1)] border border-[rgba(227,0,0,0.3)] text-[#E30000] flex items-center justify-center shrink-0">
            <MessageSquare size={14} />
          </div>
          <h2 className="text-sm font-bold text-white">Diskusi &amp; Tanya Jawab</h2>
          <span className="text-[10px] font-semibold text-[#A4A4A4] bg-[#2A2829] border border-[#393939] px-2.5 py-0.5 rounded-full">
            Total Diskusi: {threads.length}
          </span>
          {isPending && (
            <span className="text-[10px] text-[#737373] animate-pulse">Memuat...</span>
          )}
        </div>

        {/* Search Input & Reset */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-2.5 text-[#737373]" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[32px] w-[180px] sm:w-[220px] bg-[#1F1F1F] border border-[#393939] focus:border-[#E30000] rounded-full pl-8 pr-3 text-xs text-white placeholder:text-[#6E6E6E] outline-none transition-colors"
            />
          </div>

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              title="Reset pencarian"
              className="h-[32px] px-2.5 rounded-full border border-[#393939] text-[#737373] hover:text-white hover:bg-[#2A2829] text-[11px] flex items-center gap-1 transition-colors"
            >
              <RefreshCw size={11} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {loadError && (
        <p className="text-[11px] text-[#E30000] mb-3">{loadError}</p>
      )}

      {/* ── Top Discussion Composer (Seeker posts announcement) ── */}
      <DiscussionComposer onPostAnnouncement={handlePostAnnouncement} />

      {/* ── Thread List or Empty State ────────────────────────── */}
      {filteredThreads.length === 0 ? (
        <div className="w-full h-[140px] bg-[#1F1F1F]/50 border border-dashed border-[#393939] rounded-[12px] flex flex-col items-center justify-center gap-2 text-center p-4">
          <MessageSquareOff size={24} className="text-[#737373]" />
          <p className="text-xs text-[#737373]">
            {searchQuery
              ? `Tidak ditemukan diskusi dengan kata kunci "${searchQuery}".`
              : "Belum ada diskusi atau pertanyaan dari Solver pada challenge ini."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {filteredThreads.map((thread) => (
            <DiscussionThreadCard
              key={thread.id}
              thread={thread}
              companyName={companyName}
              onSendReply={handleSendReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
