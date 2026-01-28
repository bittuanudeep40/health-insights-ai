import { AlertTriangle, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmergencyAlertProps {
  level: "warning" | "critical";
  title: string;
  reason: string;
  risk: string;
  action: string;
  onDismiss?: () => void;
}

export function EmergencyAlert({ 
  level, 
  title, 
  reason, 
  risk, 
  action,
  onDismiss 
}: EmergencyAlertProps) {
  const isCritical = level === "critical";

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl border-2 p-6",
        isCritical 
          ? "border-critical bg-critical/5 animate-pulse-glow" 
          : "border-warning bg-warning/5"
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            currentColor 10px,
            currentColor 20px
          )`,
        }} />
      </div>

      <div className="relative">
        <div className="flex items-start gap-4">
          <div className={cn(
            "flex-shrink-0 p-3 rounded-full",
            isCritical ? "bg-critical/10" : "bg-warning/10"
          )}>
            <AlertTriangle className={cn(
              "h-6 w-6",
              isCritical ? "text-critical" : "text-warning"
            )} />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <span className={cn(
                "px-2 py-0.5 text-xs font-semibold uppercase rounded",
                isCritical 
                  ? "bg-critical text-critical-foreground" 
                  : "bg-warning text-warning-foreground"
              )}>
                🚨 {isCritical ? "Emergency" : "Warning"} Alert
              </span>
              <h3 className={cn(
                "font-semibold text-lg",
                isCritical ? "text-critical" : "text-warning"
              )}>
                {title}
              </h3>
            </div>

            <div className="grid gap-2 text-sm">
              <div>
                <span className="font-medium text-foreground">Trigger: </span>
                <span className="text-muted-foreground">{reason}</span>
              </div>
              <div>
                <span className="font-medium text-foreground">Potential Risk: </span>
                <span className="text-muted-foreground">{risk}</span>
              </div>
              <div>
                <span className="font-medium text-foreground">Recommended Action: </span>
                <span className="text-muted-foreground">{action}</span>
              </div>
            </div>

            {isCritical && (
              <div className="flex items-center gap-2 pt-2">
                <Phone className="h-4 w-4 text-critical" />
                <span className="text-sm font-medium text-critical">
                  Please seek immediate medical attention
                </span>
              </div>
            )}
          </div>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}