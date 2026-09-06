"use client";

import { useEffect, useCallback, useState } from "react";
import { X } from "lucide-react";
import { useAuthModal } from "./AuthModalContext";
import { useLandingMode } from "@/component/landing/LandingModeContext";
import LoginForm from "./LoginForm";
import RegisterFlow from "./RegisterFlow";
import TermsView from "./TermsView";

// ── State type (exported so children can import it) ───────────────────────────
export type AuthView = "LOGIN" | "REGISTER_1" | "REGISTER_2" | "REGISTER_3" | "TERMS";

interface AuthModalProps {
  landingMode?: "solver" | "seeker";
}

// ── Main modal component ──────────────────────────────────────────────────────
export default function AuthModal({ landingMode: propMode }: AuthModalProps = {}) {
  const { isOpen, initialView, close } = useAuthModal();
  const { mode: contextMode } = useLandingMode();
  const [view, setView] = useState<AuthView>(initialView || "LOGIN");

  const landingMode = propMode || contextMode || "solver";
  const isDark = landingMode === "seeker";

  // Reset to initialView whenever the modal opens
  useEffect(() => {
    if (isOpen) setView(initialView || "LOGIN");
  }, [isOpen, initialView]);

  // Body scroll-lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [isOpen]);

  // Escape key handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    },
    [close]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const isTerms = view === "REGISTER_3" || view === "TERMS";

  return (
    /* Backdrop */
    <div
      role="dialog"
      aria-modal="true"
      aria-label={
        view === "LOGIN"
          ? isDark ? "Masuk Sebagai Seeker" : "Masuk Sebagai Solver"
          : view === "REGISTER_1" || view === "REGISTER_2"
          ? isDark ? "Daftar Sebagai Seeker" : "Daftar Sebagai Solver"
          : "Syarat & Ketentuan"
      }
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[4px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      {/* Modal card */}
      <div
        className={[
          "relative w-full max-w-[460px] md:max-w-[32rem] rounded-[20px]",
          "shadow-[0_24px_70px_rgba(0,0,0,0.35)]",
          "flex flex-col overflow-hidden transition-colors duration-200",
          isDark
            ? "bg-[#191919] border border-[#393939] text-white"
            : "bg-white border border-gray-100 text-gray-900",
          // Height: constrained by viewport
          "max-h-[calc(100vh-32px)] md:max-h-[calc(100vh-64px)]",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          aria-label="Tutup"
          onClick={close}
          className={`absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer ${
            isDark
              ? "text-[#737373] hover:text-white hover:bg-[#2A2829]"
              : "text-[#A2A2A2] hover:text-gray-700 hover:bg-gray-100"
          }`}
        >
          <X size={18} strokeWidth={1.8} />
        </button>

        {/* View content */}
        {view === "LOGIN" && (
          <LoginForm onNavigate={setView} isDark={isDark} />
        )}

        {(view === "REGISTER_1" || view === "REGISTER_2") && (
          <RegisterFlow view={view} onNavigate={setView} isDark={isDark} />
        )}

        {(view === "REGISTER_3" || view === "TERMS") && (
          <TermsView onNavigate={setView} isDark={isDark} />
        )}
      </div>
    </div>
  );
}