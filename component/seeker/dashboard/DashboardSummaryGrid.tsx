import Image from "next/image";

interface SummaryCardConfig {
  variant: "total" | "active" | "rewards";
  metric: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
  /** px dimensions for the illustration */
  imageWidth: number;
  imageHeight: number;
}

const CARDS: SummaryCardConfig[] = [
  {
    variant: "total",
    metric: "7",
    label: "Total Challenge",
    imageSrc: "/images/seeker/dashboard/card-folder.png",
    imageAlt: "Folder illustration",
    imageWidth: 140,
    imageHeight: 140,
  },
  {
    variant: "active",
    metric: "5",
    label: "Challenge Aktif",
    imageSrc: "/images/seeker/dashboard/card-active.png",
    imageAlt: "Active challenge illustration",
    imageWidth: 140,
    imageHeight: 140,
  },
  {
    variant: "rewards",
    metric: "Rp 190Jt",
    label: "Total Hadiah Disalurkan",
    imageSrc: "/images/seeker/dashboard/card-coin.png",
    imageAlt: "Coin illustration",
    imageWidth: 140,
    imageHeight: 140,
  },
];

function SummaryCard({ variant, metric, label, imageSrc, imageAlt, imageWidth, imageHeight }: SummaryCardConfig) {
  const isTotal = variant === "total";

  const cardStyle: React.CSSProperties = {
    background: isTotal
      ? "linear-gradient(100deg, #FFFFFF 0%, #E0E0E0 45%, #8B8B8B 100%)"
      : variant === "rewards"
      ? "#171717"
      : "#191919",
    border: `1px solid ${isTotal ? "#D0D0D0" : "#373737"}`,
    borderRadius: "18px",
    padding: "22px 24px",
    height: "132px",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const metricColor = isTotal ? "#171717" : "#F7F7F7";
  const labelColor  = isTotal ? "#3F3F46" : "#A4A4A4";   // zinc-800 / gray-400

  return (
    <div style={cardStyle}>
      {/* Text content — sits above illustration via z-10 */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Row 1 — Big metric */}
        <p
          className="font-bold leading-none tracking-tight"
          style={{
            fontSize: variant === "rewards" ? "clamp(28px, 4vw, 36px)" : "clamp(36px, 5vw, 48px)",
            color: metricColor,
            letterSpacing: "-0.025em",
          }}
        >
          {metric}
        </p>

        {/* Row 2 — Clean label */}
        <p
          className="text-sm font-medium"
          style={{ color: labelColor }}
        >
          {label}
        </p>
      </div>

      {/* 3D illustration — pinned to bottom-right, clipped by overflow-hidden */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}

export default function DashboardSummaryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
      {CARDS.map(card => (
        <SummaryCard key={card.variant} {...card} />
      ))}
    </div>
  );
}