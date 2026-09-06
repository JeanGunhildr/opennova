"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type LandingMode = "solver" | "seeker";

interface LandingModeContextValue {
  mode: LandingMode;
  isSeeker: boolean;
  setMode: (mode: LandingMode) => void;
  toggleMode: () => void;
}

const LandingModeContext = createContext<LandingModeContextValue | null>(null);

export function LandingModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<LandingMode>("solver");

  const setMode = useCallback((newMode: LandingMode) => {
    setModeState(newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === "solver" ? "seeker" : "solver"));
  }, []);

  const isSeeker = mode === "seeker";

  return (
    <LandingModeContext.Provider value={{ mode, isSeeker, setMode, toggleMode }}>
      {children}
    </LandingModeContext.Provider>
  );
}

export function useLandingMode(): LandingModeContextValue {
  const ctx = useContext(LandingModeContext);
  if (!ctx) {
    return {
      mode: "solver",
      isSeeker: false,
      setMode: () => {},
      toggleMode: () => {},
    };
  }
  return ctx;
}

/**
 * Client wrapper component that applies the appropriate canvas background
 * and text color based on the active landing mode.
 */
export function LandingShell({ children }: { children: ReactNode }) {
  const { isSeeker } = useLandingMode();

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isSeeker ? "bg-[#171717] text-white" : "bg-white text-gray-900"
      }`}
    >
      {children}
    </div>
  );
}
