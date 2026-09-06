"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const hero = document.getElementById("hero");
    if (hero) {
      hero.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      id="toTop"
      type="button"
      aria-label="Kembali ke atas"
      onClick={scrollToTop}
      className={`fixed right-6 bottom-6 w-11 h-11 rounded-full bg-[#E30000] text-white flex items-center justify-center z-40 transition-all duration-300 shadow-[0_12px_28px_rgba(227,0,0,0.35)] cursor-pointer hover:bg-[#bf0000] hover:scale-105 active:scale-95 ${
        show
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible translate-y-3 pointer-events-none"
      }`}
    >
      <ArrowUp size={18} strokeWidth={2.5} />
    </button>
  );
}
