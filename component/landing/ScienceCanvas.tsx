"use client";

import { useEffect, useRef } from "react";

interface ScienceCanvasProps {
  mode?: "seeker" | "solver";
}

interface Particle {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  size: number;
}

export default function ScienceCanvas({ mode = "solver" }: ScienceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDark = mode === "seeker";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };

    const cfg = {
      desktopSpacing: 18,
      mobileSpacing: 22,
      innerRadius: 42,
      outerRadius: 142,
      push: 58,
      spring: 0.075,
      damping: 0.845,
      idle: 0.1,
    };

    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
      H = canvas.clientHeight || canvas.parentElement?.offsetHeight || window.innerHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!pointer.active) {
        pointer.x = W * 0.5;
        pointer.y = H * 0.45;
        pointer.tx = pointer.x;
        pointer.ty = pointer.y;
      }

      const spacing = window.innerWidth < 768 ? cfg.mobileSpacing : cfg.desktopSpacing;
      particles = [];

      for (let y = 0; y <= H; y += spacing) {
        for (let x = 0; x <= W; x += spacing) {
          particles.push({
            ox: x,
            oy: y,
            x,
            y,
            vx: 0,
            vy: 0,
            phase: Math.random() * Math.PI * 2,
            size: 0.72 + Math.random() * 0.52,
          });
        }
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      pointer.active = true;
    }

    function onPointerLeave() {
      pointer.active = false;
    }

    function onBlur() {
      pointer.active = false;
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", onBlur);
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("resize", resize, { passive: true });

    resize();

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      if (!pointer.active) {
        pointer.tx = W * 0.5;
        pointer.ty = H * 0.45;
      }

      pointer.x += (pointer.tx - pointer.x) * 0.075;
      pointer.y += (pointer.ty - pointer.y) * 0.075;

      const cx = pointer.x;
      const cy = pointer.y;

      // Glow halo
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 250);
      glow.addColorStop(0, isDark ? "rgba(227,0,0,0.045)" : "rgba(227,0,0,0.028)");
      glow.addColorStop(0.45, isDark ? "rgba(227,0,0,0.012)" : "rgba(227,0,0,0.008)");
      glow.addColorStop(1, "rgba(227,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, 250, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let tx = p.ox;
        let ty = p.oy;

        tx += Math.sin(t * 0.00042 + p.phase) * cfg.idle;
        ty += Math.cos(t * 0.00035 + p.phase) * cfg.idle;

        const dx = p.ox - cx;
        const dy = p.oy - cy;
        const dist = Math.hypot(dx, dy);

        if (pointer.active && dist > cfg.innerRadius && dist < cfg.outerRadius) {
          const normalized = (dist - cfg.innerRadius) / (cfg.outerRadius - cfg.innerRadius);
          const strength = Math.sin(normalized * Math.PI) * cfg.push;
          const angle = Math.atan2(dy, dx);
          tx += Math.cos(angle) * strength;
          ty += Math.sin(angle) * strength;
        }

        p.vx += (tx - p.x) * cfg.spring;
        p.vy += (ty - p.y) * cfg.spring;
        p.vx *= cfg.damping;
        p.vy *= cfg.damping;
        p.x += p.vx;
        p.y += p.vy;

        const currentDistance = Math.hypot(p.x - cx, p.y - cy);
        let influence = 0;
        if (pointer.active && currentDistance < cfg.outerRadius + 18) {
          influence = Math.max(0, 1 - currentDistance / (cfg.outerRadius + 18));
        }

        const baseAlpha = isDark ? 0.16 : 0.15;
        const boostAlpha = isDark ? 0.25 : 0.27;
        const alpha = baseAlpha + boostAlpha * influence;
        const size = p.size + 0.72 * influence;

        let ring = 0;
        if (pointer.active && currentDistance > cfg.innerRadius && currentDistance < cfg.outerRadius) {
          ring = Math.sin(((currentDistance - cfg.innerRadius) / (cfg.outerRadius - cfg.innerRadius)) * Math.PI);
        }

        let r = isDark ? 255 : 28;
        let g = isDark ? 255 : 31;
        let b = isDark ? 255 : 36;

        if (ring > 0.12) {
          const mix = ring * 0.32;
          if (isDark) {
            r = 255;
            g = Math.round(255 - (255 - 90) * mix);
            b = Math.round(255 - (255 - 90) * mix);
          } else {
            r = Math.round(28 + (227 - 28) * mix);
            g = Math.round(31 + (0 - 31) * mix);
            b = Math.round(36 + (0 - 36) * mix);
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      if (pointer.active) {
        ctx.beginPath();
        ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(227,0,0,0.72)";
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, [isDark]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
          isDark ? "opacity-75" : "opacity-85"
        }`}
      />
      {/* Subtle science labels from reference */}
      <div className="absolute inset-0 pointer-events-none select-none text-[9px] tracking-[0.1em] uppercase font-mono font-medium">
        <span
          className={`absolute left-[8%] top-[28%] transition-colors duration-300 ${
            isDark ? "text-[#444851]" : "text-[#c1c4ca]"
          }`}
        >
        </span>
        <span
          className={`absolute right-[8%] top-[42%] transition-colors duration-300 ${
            isDark ? "text-[#444851]" : "text-[#c1c4ca]"
          }`}
        >
        </span>
        <span
          className={`absolute left-[12%] bottom-[25%] transition-colors duration-300 ${
            isDark ? "text-[#444851]" : "text-[#c1c4ca]"
          }`}
        >
          COLLABORATION NETWORK
        </span>
      </div>
    </div>
  );
}
