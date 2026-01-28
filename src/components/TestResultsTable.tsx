import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus, AlertCircle } from "lucide-react";

export interface TestResult {
  id: string;
  testName: string;
  observedValue: number | string;
  unit: string;
  referenceRange: string;
  status: "normal" | "borderline" | "high" | "low" | "critical";
}

interface TestResultsTableProps {
  results: TestResult[];
  title?: string;
}

export function TestResultsTable({ results, title = "Test Results" }: TestResultsTableProps) {
  const getStatusConfig = (status: TestResult["status"]) => {
    switch (status) {
      case "normal":
        return { 
          label: "Normal", 
          className: "status-normal",
          icon: null
        };
      case "borderline":
        return { 
          label: "Borderline", 
          className: "status-warning",
          icon: <Minus className="h-3 w-3" />
        };
      case "high":
        return { 
          label: "High", 
          className: "status-warning",
          icon: <ArrowUp className="h-3 w-3" />
        };
      case "low":
        return { 
          label: "Low", 
          className: "status-warning",
          icon: <ArrowDown className="h-3 w-3" />
        };
      case "critical":
        return { 
          label: "Critical", 
          className: "status-critical",
          icon: <AlertCircle className="h-3 w-3" />
        };
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Test Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Result
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Reference Range
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => {
              const statusConfig = getStatusConfig(result.status);
              
              return (
                <tr 
                  key={result.id}
                  className={cn(
                    "border-b last:border-0 transition-colors hover:bg-secondary/30",
                    result.status === "critical" && "bg-critical/5"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">
                      {result.testName}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "font-mono",
                      result.status === "critical" ? "text-critical font-semibold" :
                      result.status !== "normal" ? "text-warning font-medium" :
                      "text-foreground"
                    )}>
                      {result.observedValue} {result.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground text-sm">
                      {result.referenceRange}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                      statusConfig.className
                    )}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}