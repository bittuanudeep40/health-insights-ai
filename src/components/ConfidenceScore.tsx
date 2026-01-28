import { Info, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfidenceScoreProps {
  score: number; // 0-100
  factors: string[];
}

export function ConfidenceScore({ score, factors }: ConfidenceScoreProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  
  const getScoreLevel = (score: number) => {
    if (score >= 80) return { label: "High Confidence", color: "success" };
    if (score >= 50) return { label: "Moderate Confidence", color: "warning" };
    return { label: "Low Confidence", color: "critical" };
  };

  const { label, color } = getScoreLevel(clampedScore);

  return (
    <div className="p-4 rounded-xl bg-card border">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          "p-2 rounded-lg",
          color === "success" && "bg-success/10",
          color === "warning" && "bg-warning/10",
          color === "critical" && "bg-critical/10"
        )}>
          {color === "success" ? (
            <CheckCircle className="h-5 w-5 text-success" />
          ) : (
            <AlertCircle className={cn(
              "h-5 w-5",
              color === "warning" ? "text-warning" : "text-critical"
            )} />
          )}
        </div>
        <div>
          <h4 className="font-semibold text-foreground">AI Confidence Score</h4>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
        <div className={cn(
          "ml-auto text-2xl font-bold",
          color === "success" && "text-success",
          color === "warning" && "text-warning",
          color === "critical" && "text-critical"
        )}>
          {clampedScore}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-4">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            color === "success" && "gradient-success",
            color === "warning" && "gradient-warning",
            color === "critical" && "gradient-critical"
          )}
          style={{ width: `${clampedScore}%` }}
        />
      </div>

      {/* Factors */}
      {factors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            <span>Confidence factors:</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            {factors.map((factor, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}