"use client";

import { useState } from "react";
import { Send, MessageSquare, BadgeCheck } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  role: "solver" | "seeker";
  companyOrRole: string;
  avatarText: string;
  timestamp: string;
  text: string;
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: "c-1",
    author: "Irfan Satya",
    role: "solver",
    companyOrRole: "Solver / AI Engineer",
    avatarText: "IS",
    timestamp: "2 jam lalu",
    text: "Halo tim Seeker, apakah dataset pengujian latensi jaringan wajib menggunakan format live streaming telemetry (misal MQTT/Kafka) atau diperbolehkan sample time-series CSV untuk evaluasi awal?",
  },
  {
    id: "c-2",
    author: "Telkom Innovation Team",
    role: "seeker",
    companyOrRole: "Seeker (Penyelenggara)",
    avatarText: "TI",
    timestamp: "1 jam lalu",
    text: "Halo Irfan! Untuk tahap eliminasi awal, sample CSV 24-jam sangat diperbolehkan. Namun pada tahap Pitching Final, peserta yang dapat mendemokan live-ingestion pipeline via socket/MQTT akan mendapat poin keunggulan implementasi teknis.",
  },
  {
    id: "c-3",
    author: "Siti Sarah",
    role: "solver",
    companyOrRole: "Solver / Data Scientist",
    avatarText: "SS",
    timestamp: "1 hari lalu",
    text: "Apakah ada batasan minimum akurasi F1-Score untuk modul deteksi anomali paket data yang disyaratkan?",
  },
  {
    id: "c-4",
    author: "Telkom Innovation Team",
    role: "seeker",
    companyOrRole: "Seeker (Penyelenggara)",
    avatarText: "TI",
    timestamp: "22 jam lalu",
    text: "Target baseline F1-Score adalah 0.88 pada synthetic anomaly dataset yang kami sediakan di panduan teknis. Lebih diutamakan model dengan false-positive rate rendah di bawah 3%.",
  },
];

export default function DiscussionForum() {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [inputText, setInputText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: "Irfan Maulana (Anda)",
      role: "solver",
      companyOrRole: "Solver",
      avatarText: "IM",
      timestamp: "Baru saja",
      text: inputText.trim(),
    };

    setComments([...comments, newComment]);
    setInputText("");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(17,24,39,0.04)]">
      {/* Forum Header */}
      <div className="p-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-[#E30000]" strokeWidth={2} />
          <h3 className="text-[13px] font-bold text-gray-800">
            Forum Tanya Jawab & Diskusi Challenge
          </h3>
        </div>
        <span className="text-[10px] font-semibold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
          {comments.length} Diskusi
        </span>
      </div>

      {/* Message Stream */}
      <div className="divide-y divide-gray-100 max-h-[560px] overflow-y-auto">
        {comments.map((item) => {
          const isSeeker = item.role === "seeker";
          return (
            <div
              key={item.id}
              className={`p-4 grid grid-cols-[36px_minmax(0,1fr)] gap-2.5 ${
                isSeeker ? "bg-red-50/25" : "bg-white"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[11px] flex-shrink-0 ${
                  isSeeker
                    ? "bg-[#E30000] text-white"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                {item.avatarText}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-bold text-[12px] text-gray-800">
                    {item.author}
                  </span>

                  {isSeeker && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#E30000] bg-red-50 px-1.5 py-0.5 rounded-full border border-red-200">
                      <BadgeCheck size={11} />
                      Penyelenggara
                    </span>
                  )}

                  <span className="text-[10px] text-gray-500">
                    • {item.companyOrRole} • {item.timestamp}
                  </span>
                </div>

                <p className="text-[12px] leading-[1.55] text-gray-600 mt-1">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <form onSubmit={handleSend} className="p-3.5 border-t border-gray-200 flex gap-2 items-end bg-white">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tulis pertanyaan atau tanggapan Anda..."
          className="flex-1 min-h-[42px] px-3 py-2.5 rounded-[10px] bg-gray-50 border border-gray-300 text-[12px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#E30000] focus:ring-2 focus:ring-[#E30000]/14 transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-[42px] h-[42px] rounded-full bg-[#E30000] hover:bg-[#CC0000] disabled:bg-gray-200 text-white disabled:text-gray-400 flex items-center justify-center transition-colors flex-shrink-0 shadow-sm"
          aria-label="Kirim pesan"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
