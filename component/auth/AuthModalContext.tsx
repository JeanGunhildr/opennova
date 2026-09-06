"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type AuthView = "LOGIN" | "REGISTER_1" | "REGISTER_2" | "REGISTER_3" | "TERMS";

interface AuthModalContextValue {
  isOpen: boolean;
  initialView: AuthView;
  open: (view?: AuthView) => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialView, setInitialView] = useState<AuthView>("LOGIN");

  const open = useCallback((view: AuthView = "LOGIN") => {
    setInitialView(view);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <AuthModalContext.Provider value={{ isOpen, initialView, open, close }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used inside <AuthModalProvider>");
  return ctx;
}