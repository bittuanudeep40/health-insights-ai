import { Activity, Shield } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-primary shadow-glow">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                MedAnalyze AI
              </h1>
              <p className="text-xs text-muted-foreground">
                Intelligent Medical Report Analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-success" />
            <span>HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </header>
  );
}