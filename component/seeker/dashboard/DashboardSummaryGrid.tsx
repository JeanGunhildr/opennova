import Image from "next/image";

interface SummaryCardConfig {
  variant: "total" | "active" | "rewards";
  metric: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}

function SummaryCard({
  variant,
  metric,
  label,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
}: SummaryCardConfig) {
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
  const labelColor = isTotal ? "#3F3F46" : "#A4A4A4";

  return (
    <div style={cardStyle}>
      {/* Text content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <p
          className="font-bold leading-none tracking-tight"
          style={{
            fontSize:
              variant === "rewards"
                ? "clamp(26px, 3.5vw, 34px)"
                : "clamp(36px, 5vw, 48px)",
            color: metricColor,
            letterSpacing: "-0.025em",
          }}
        >
          {metric}
        </p>

        <p className="text-sm font-medium" style={{ color: labelColor }}>
          {label}
        </p>
      </div>

      {/* 3D illustration */}
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

interface DashboardSummaryGridProps {
  totalCount?: number;
  activeCount?: number;
  totalRewardLabel?: string;
}

export default function DashboardSummaryGrid({
  totalCount = 0,
  activeCount = 0,
  totalRewardLabel = "Rp 0",
}: DashboardSummaryGridProps) {
  const cards: SummaryCardConfig[] = [
    {
      variant: "total",
      metric: String(totalCount),
      label: "Total Challenge",
      imageSrc: "/images/seeker/dashboard/card-folder.png",
      imageAlt: "Folder illustration",
      imageWidth: 140,
      imageHeight: 140,
    },
    {
      variant: "active",
      metric: String(activeCount),
      label: "Challenge Aktif",
      imageSrc: "/images/seeker/dashboard/card-active.png",
      imageAlt: "Active challenge illustration",
      imageWidth: 140,
      imageHeight: 140,
    },
    {
      variant: "rewards",
      metric: totalRewardLabel,
      label: "Total Hadiah Disalurkan",
      imageSrc: "/images/seeker/dashboard/card-coin.png",
      imageAlt: "Coin illustration",
      imageWidth: 140,
      imageHeight: 140,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
      {cards.map((card) => (
        <SummaryCard key={card.variant} {...card} />
      ))}
    </div>
  );
}