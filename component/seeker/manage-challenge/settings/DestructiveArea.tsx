"use client";

interface DestructiveAreaProps {
  onOpenCancellation: () => void;
}

export default function DestructiveArea({ onOpenCancellation }: DestructiveAreaProps) {
  return (
    <div className="mt-8 pt-5 border-t border-[#2E2E2E] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex flex-col gap-1 max-w-[670px]">
        <h4 className="text-[13px] font-bold text-[#E30000]">
          Batalkan & Hentikan Challenge
        </h4>
        <p className="text-[10px] text-[#737373] leading-relaxed">
          Tindakan ini bersifat permanen dan tidak dapat dibatalkan. Penghentian challenge akan mengembalikan dana deposit sesuai ketentuan platform OpenNova (100% Hadiah Challenge + 80% Biaya Platform).
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenCancellation}
        className="h-[36px] px-4 rounded-full border border-[rgba(227,0,0,0.60)] text-[#E30000] text-xs font-semibold hover:bg-[rgba(227,0,0,0.08)] transition-colors shrink-0 active:scale-[0.98]"
      >
        Batalkan Challenge
      </button>
    </div>
  );
}
