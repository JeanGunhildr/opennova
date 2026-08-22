"use client";

import { useEffect, useCallback } from "react";
import { useAuthModal } from "./AuthModalContext";
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterFlow from "./RegisterFlow";
import TermsView from "./TermsView";

// ── State type (exported so children can import it) ───────────────────────────
export type AuthView = "LOGIN" | "REGISTER_1" | "REGISTER_2" | "REGISTER_3" | "TERMS";

// ── Close (X) icon ────────────────────────────────────────────────────────────
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ── Main modal component ──────────────────────────────────────────────────────
export default function AuthModal() {
  const { isOpen, close } = useAuthModal();
  const [view, setView] = useState<AuthView>("LOGIN");

  // Reset to LOGIN whenever the modal opens
  useEffect(() => {
    if (isOpen) setView("LOGIN");
  }, [isOpen]);

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
          ? "Masuk Sebagai Solver"
          : view === "REGISTER_1" || view === "REGISTER_2"
          ? "Daftar Sebagai Solver"
          : "Syarat & Ketentuan"
      }
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[4px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      {/* Modal card */}
      <div
        className={[
          "relative w-full max-w-[32rem] bg-white rounded-[20px]",
          "shadow-[0_24px_70px_rgba(0,0,0,0.20)]",
          "flex flex-col overflow-hidden",
          // Height: constrained by viewport; Terms view needs full flex height
          isTerms
            ? "max-h-[calc(100vh-32px)] md:max-h-[calc(100vh-64px)]"
            : "max-h-[calc(100vh-32px)] md:max-h-[calc(100vh-64px)]",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          aria-label="Tutup"
          onClick={close}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full text-[#A2A2A2] hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <CloseIcon />
        </button>

        {/* View content */}
        {view === "LOGIN" && <LoginForm onNavigate={setView} />}

        {(view === "REGISTER_1" || view === "REGISTER_2") && (
          <RegisterFlow view={view} onNavigate={setView} />
        )}

        {(view === "REGISTER_3" || view === "TERMS") && (
          <TermsView onNavigate={setView} />
        )}
      </div>
    </div>
  );
}