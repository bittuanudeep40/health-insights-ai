import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  score: number; // 0-100
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function RiskGauge({ score, size = "md", showLabel = true }: RiskGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  
  const getRiskCategory = (score: number) => {
    if (score <= 30) return { label: "Low Risk", color: "success" };
    if (score <= 60) return { label: "Moderate Risk", color: "warning" };
    return { label: "High Risk", color: "critical" };
  };

  const { label, color } = getRiskCategory(clampedScore);

  const sizeConfig = {
    sm: { width: 120, strokeWidth: 8, fontSize: "text-xl" },
    md: { width: 180, strokeWidth: 12, fontSize: "text-3xl" },
    lg: { width: 240, strokeWidth: 16, fontSize: "text-4xl" },
  };

  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = radius * Math.PI; // Half circle
  const offset = circumference - (clampedScore / 100) * circumference;

  const gradientColors = {
    success: ["#22c55e", "#16a34a"],
    warning: ["#f59e0b", "#d97706"],
    critical: ["#ef4444", "#dc2626"],
  };

  const colors = gradientColors[color as keyof typeof gradientColors];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: config.width, height: config.width / 2 + 20 }}>
        <svg
          width={config.width}
          height={config.width / 2 + 20}
          className="transform -rotate-180"
        >
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="100%" stopColor={colors[1]} />
            </linearGradient>
          </defs>
          
          {/* Background arc */}
          <path
            d={`M ${config.strokeWidth / 2} ${config.width / 2} A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${config.width / 2}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-secondary"
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <path
            d={`M ${config.strokeWidth / 2} ${config.width / 2} A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${config.width / 2}`}
            fill="none"
            stroke={`url(#gradient-${color})`}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className={cn(config.fontSize, "font-bold", {
            "text-success": color === "success",
            "text-warning": color === "warning",
            "text-critical": color === "critical",
          })}>
            {clampedScore}
          </span>
          {showLabel && (
            <span className="text-sm text-muted-foreground font-medium mt-1">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}