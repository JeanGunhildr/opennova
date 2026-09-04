import { Clock, Trophy } from "lucide-react";

export type HeroStatusStyle = "deadline" | "success" | "danger" | "winner" | "none";

export interface HeroStatus {
  label: string;
  style: HeroStatusStyle;
}

export interface ChallengeHeroProps {
  id: string;
  category: string;
  title: string;
  /** Kept for future use / backward compat; not rendered in hero */
  company?: string;
  companyInitials?: string;
  verified?: boolean;
  heroStatus?: HeroStatus;
  thumbnailPath?: string | null;
}

function HeroTag({ status }: { status: HeroStatus }) {
  if (status.style === "none") return null;

  if (status.style === "deadline") {
    return (
      <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-white text-primary-500 text-[12px] font-semibold flex-shrink-0 shadow-2xs">
        <Clock size={12} strokeWidth={2.2} />
        {status.label}
      </span>
    );
  }
  if (status.style === "winner") {
    return (
      <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#F0F9F1] text-[#168A39] text-[12px] font-semibold flex-shrink-0 shadow-2xs">
        <Trophy size={12} strokeWidth={2.2} />
        {status.label}
      </span>
    );
  }
  if (status.style === "success") {
    return (
      <span className="inline-flex items-center h-7 px-3 rounded-full bg-[#F0F9F1] text-[#168A39] text-[12px] font-semibold flex-shrink-0 shadow-2xs">
        {status.label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center h-7 px-3 rounded-full bg-white text-primary-500 text-[12px] font-semibold flex-shrink-0 shadow-2xs">
      {status.label}
    </span>
  );
}

export default function ChallengeHero({
  category,
  title,
  heroStatus,
  thumbnailPath,
}: ChallengeHeroProps) {
  return (
    <div
      className="relative rounded-[20px] overflow-hidden shadow-xs p-5 sm:p-6"
      style={{
        background: "linear-gradient(110deg, #171717 0%, #252525 48%, #6F1717 100%)",
        minHeight: "180px",
      }}
    >
      {/* Decorative translucent circle — bottom-right */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          width: "260px",
          height: "260px",
          bottom: "-70px",
          right: "-50px",
          background: "rgba(255,255,255,0.06)",
        }}
      />

      {/* Hero Content: Image on Left + Title & Category below on Right, vertically centered */}
      <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 h-full my-auto">
        {/* Left Thumbnail Image Frame */}
        <div className="w-full sm:w-[200px] md:w-[230px] h-[125px] sm:h-[135px] rounded-[16px] overflow-hidden bg-white/10 flex-shrink-0 border border-white/20 shadow-md flex items-center justify-center">
          {thumbnailPath ? (
            <img src={thumbnailPath} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-600/40 via-red-950/60 to-black/70 flex flex-col items-center justify-center text-white p-3 text-center">
              <span className="text-[14px] font-bold tracking-tight text-white/90">OpenNova</span>
              <span className="text-[11px] text-white/60 mt-0.5">Innovation Challenge</span>
            </div>
          )}
        </div>

        {/* Right Content: Title on top, Category tag below title */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-3">
          <h1
            className="font-bold text-white leading-[1.25] tracking-[-0.02em]"
            style={{ fontSize: "clamp(19px, 2.2vw, 25px)" }}
          >
            {title}
          </h1>

          {/* Tags row below title: Category tag & Optional hero status tag */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center h-7 px-3.5 rounded-full text-white text-[12px] font-medium backdrop-blur-md"
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.30)",
              }}
            >
              {category}
            </span>

            {heroStatus && <HeroTag status={heroStatus} />}
          </div>
        </div>
      </div>
    </div>
  );
}