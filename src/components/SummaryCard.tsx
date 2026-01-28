import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  icon: ReactNode;
  variant?: "default" | "patient" | "doctor";
  children: ReactNode;
  className?: string;
}

export function SummaryCard({ 
  title, 
  icon, 
  variant = "default",
  children,
  className 
}: SummaryCardProps) {
  return (
    <div className={cn(
      "rounded-xl border overflow-hidden",
      variant === "patient" && "bg-gradient-to-br from-primary/5 to-info/5",
      variant === "doctor" && "bg-gradient-to-br from-secondary to-card",
      variant === "default" && "bg-card",
      className
    )}>
      <div className={cn(
        "px-5 py-4 border-b flex items-center gap-3",
        variant === "patient" && "bg-primary/5 border-primary/10",
        variant === "doctor" && "bg-secondary border-border",
        variant === "default" && "bg-secondary/50"
      )}>
        <div className={cn(
          "p-2 rounded-lg",
          variant === "patient" && "bg-primary/10 text-primary",
          variant === "doctor" && "bg-foreground/5 text-foreground",
          variant === "default" && "bg-muted text-muted-foreground"
        )}>
          {icon}
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}