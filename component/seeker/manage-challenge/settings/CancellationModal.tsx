"use client";

import { useState } from "react";
import {
  AlertTriangle,
  X,
  CreditCard,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeTitle: string;
}

const CANCELLATION_REASONS = [
  "Kendala internal perusahaan",
  "Perubahan roadmap proyek",
  "Kebutuhan solusi tidak lagi relevan",
  "Alasan lainnya",
];

const BANKS = [
  { id: "BCA", label: "Bank Central Asia (BCA)" },
  { id: "BNI", label: "Bank Negara Indonesia (BNI)" },
  { id: "BRI", label: "Bank Rakyat Indonesia (BRI)" },
  { id: "MANDIRI", label: "Bank Mandiri" },
];

export default function CancellationModal({
  isOpen,
  onClose,
  challengeTitle,
}: CancellationModalProps) {
  const router = useRouter();

  // Step 1 Form state
  const [selectedReason, setSelectedReason] = useState<string>(CANCELLATION_REASONS[0]);
  const [otherReasonText, setOtherReasonText] = useState("");
  const [selectedBank, setSelectedBank] = useState(BANKS[0].id);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountNumberError, setAccountNumberError] = useState("");
  const [confirmTitleInput, setConfirmTitleInput] = useState("");

  // Step 2 Double-confirmation prompt state
  const [isFinalPromptOpen, setIsFinalPromptOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  if (!isOpen) return null;

  // Handle strictly numeric account number input
  const handleAccountNumberChange = (val: string) => {
    // If empty
    if (val === "") {
      setAccountNumber("");
      setAccountNumberError("");
      return;
    }
    // Check if input contains non-digits
    if (/[^\d]/.test(val)) {
      setAccountNumberError("Nomor rekening hanya boleh berisi angka.");
      // Strip non-digits
      const digitsOnly = val.replace(/\D/g, "");
      setAccountNumber(digitsOnly);
    } else {
      setAccountNumberError("");
      setAccountNumber(val);
    }
  };

  // Title matching rule: exact string match
  const isTitleMatched = confirmTitleInput === challengeTitle;
  const isTitleEntered = confirmTitleInput.length > 0;

  // Form validity gate
  const isReasonValid = selectedReason !== "Alasan lainnya" || otherReasonText.trim().length > 0;
  const isAccountValid = accountNumber.trim().length >= 5 && !accountNumberError;
  const isFormValid = isReasonValid && isAccountValid && isTitleMatched;

  const handleOpenFinalPrompt = () => {
    if (!isFormValid) return;
    setIsFinalPromptOpen(true);
  };

  const handleFinalConfirm = () => {
    setIsCancelling(true);
    setTimeout(() => {
      setIsCancelling(false);
      setIsFinalPromptOpen(false);
      onClose();
      // Navigate to /seeker/challenges
      router.push("/seeker/challenges");
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.70)" }}
    >
      <div
        className="w-full max-w-[540px] max-h-[calc(100vh-40px)] overflow-y-auto bg-[#191919] border border-[#393939] rounded-[16px] shadow-2xl animate-in fade-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="h-[58px] px-5 flex items-center justify-between border-b border-[#393939] sticky top-0 bg-[#191919] z-10">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={20} className="text-[#E30000] shrink-0" />
            <h3 className="text-[15px] font-bold text-white">Batalkan Challenge</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#737373] hover:text-white hover:bg-[#242424] transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-white">
          {/* 1. Alasan Pembatalan */}
          <div>
            <label className="text-xs font-bold text-white block mb-2">
              Alasan Pembatalan
            </label>
            <div className="bg-[#1F1F1F] border border-[#393939] rounded-[10px] p-3 space-y-2.5">
              {CANCELLATION_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex items-start gap-2.5 text-xs text-white cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    name="cancellationReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-[#E30000] mt-0.5 w-4 h-4 cursor-pointer shrink-0"
                  />
                  <span>{reason}</span>
                </label>
              ))}

              {/* Conditional Other Input */}
              {selectedReason === "Alasan lainnya" && (
                <div className="pt-1">
                  <input
                    type="text"
                    placeholder="Tuliskan alasan pembatalan..."
                    value={otherReasonText}
                    onChange={(e) => setOtherReasonText(e.target.value)}
                    className="w-full h-[36px] bg-[#191919] border border-[#393939] focus:border-[#E30000] rounded-[8px] px-3 text-xs text-white placeholder:text-[#737373] outline-none transition-colors"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 2. Pengambilan Dana (Transparent Breakdown) */}
          <div>
            <label className="text-xs font-bold text-white block mb-2">
              Pengembalian Dana
            </label>
            <div className="bg-[#1F1F1F] border border-[#393939] rounded-[10px] p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#A4A4A4]">
                <span>Hadiah Challenge</span>
                <span className="font-semibold text-white">Rp 42.000.000</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#A4A4A4]">
                <span>Biaya Platform (80% dikembalikan)</span>
                <span className="font-semibold text-white">Rp 3.360.000</span>
              </div>
              <div className="h-px bg-[#393939] my-2" />
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Total Pengembalian Dana</span>
                <span className="text-sm text-white font-extrabold">Rp 45.360.000</span>
              </div>
            </div>
          </div>

          {/* 3. Pilihan Bank & Nomor Rekening */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#A4A4A4] uppercase tracking-wider block mb-1.5">
                Pilih Bank
              </label>
              <div className="relative">
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full h-[38px] bg-[#1F1F1F] border border-[#393939] focus:border-[#E30000] rounded-[9px] px-3 text-xs text-white outline-none cursor-pointer"
                >
                  {BANKS.map((b) => (
                    <option key={b.id} value={b.id} className="bg-[#1F1F1F] text-white">
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#A4A4A4] uppercase tracking-wider block mb-1.5">
                Nomor Rekening
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 1234567890"
                value={accountNumber}
                onChange={(e) => handleAccountNumberChange(e.target.value)}
                className={`w-full h-[38px] bg-[#1F1F1F] border rounded-[9px] px-3 text-xs text-white placeholder:text-[#6E6E6E] outline-none transition-colors ${
                  accountNumberError
                    ? "border-[#E30000] bg-[rgba(227,0,0,0.04)]"
                    : "border-[#393939] focus:border-[#E30000]"
                }`}
              />
              {accountNumberError && (
                <p className="text-[10px] text-[#E30000] mt-1">{accountNumberError}</p>
              )}
            </div>
          </div>

          {/* 4. Ketik Judul Challenge Untuk Konfirmasi */}
          <div>
            <label className="text-xs font-bold text-white block mb-1">
              Ketik Judul Challenge Untuk Konfirmasi
            </label>
            <p className="text-[10px] text-[#737373] mb-2 leading-relaxed">
              Ketik persis judul challenge berikut: <span className="text-white font-medium italic">&quot;{challengeTitle}&quot;</span>
            </p>
            <input
              type="text"
              placeholder="Ketik persis judul challenge di sini..."
              value={confirmTitleInput}
              onChange={(e) => setConfirmTitleInput(e.target.value)}
              className={`w-full h-[38px] bg-[#1F1F1F] border rounded-[9px] px-3 text-xs text-white placeholder:text-[#6E6E6E] outline-none transition-colors ${
                !isTitleEntered
                  ? "border-[#393939] focus:border-[#E30000]"
                  : isTitleMatched
                  ? "border-[#39D96F] bg-[rgba(57,217,111,0.04)]"
                  : "border-[#E30000] bg-[rgba(227,0,0,0.04)]"
              }`}
            />
            {isTitleEntered && !isTitleMatched && (
              <p className="text-[10px] text-[#E30000] mt-1">Judul challenge tidak sesuai.</p>
            )}
            {isTitleMatched && (
              <p className="text-[10px] text-[#39D96F] mt-1 flex items-center gap-1">
                <CheckCircle2 size={12} /> Judul challenge sesuai.
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-5 border-t border-[#393939] flex items-center justify-end gap-3 sticky bottom-0 bg-[#191919]">
          <button
            type="button"
            onClick={onClose}
            className="h-[36px] px-4 rounded-full border border-[#4A4A4A] text-white text-xs font-medium hover:bg-[#242424] transition-colors"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={handleOpenFinalPrompt}
            disabled={!isFormValid}
            className={`h-[36px] px-5 rounded-full text-xs font-bold transition-all shadow-sm ${
              isFormValid
                ? "bg-[#E30000] hover:bg-[#CC0000] text-white cursor-pointer active:scale-[0.98]"
                : "bg-[#393939] text-[#737373] cursor-not-allowed border border-[#4A4A4A]"
            }`}
          >
            Batalkan Challenge
          </button>
        </div>

        {/* ── Secondary Double-Confirmation Modal ("Konfirmasi Pembatalan") ── */}
        {isFinalPromptOpen && (
          <div
            className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-[430px] bg-[#191919] border border-[#393939] rounded-[16px] p-5 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[rgba(227,0,0,0.15)] border border-[rgba(227,0,0,0.35)] flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-[#E30000]" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-white">Konfirmasi Pembatalan</h4>
                  <p className="text-[11px] text-[#A4A4A4]">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-[#A4A4A4] mb-5">
                Apakah Anda yakin ingin menghentikan Challenge ini? Seluruh pendaftaran Solver akan dibatalkan, dan dana pengembalian <strong className="text-white">Rp 45.360.000</strong> akan diproses ke rekening Bank {selectedBank} Anda.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2E2E2E]">
                <button
                  type="button"
                  onClick={() => setIsFinalPromptOpen(false)}
                  disabled={isCancelling}
                  className="h-[34px] px-3.5 rounded-full border border-[#4A4A4A] text-white text-xs font-medium hover:bg-[#242424] transition-colors disabled:opacity-50"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleFinalConfirm}
                  disabled={isCancelling}
                  className="h-[34px] px-4 rounded-full bg-[#E30000] hover:bg-[#CC0000] text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                >
                  {isCancelling ? "Memproses..." : "Ya, Batalkan Challenge"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
