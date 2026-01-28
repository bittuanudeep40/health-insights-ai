import { useState, useCallback } from "react";
import { SpaceBackground } from "@/components/SpaceBackground";
import { Header } from "@/components/Header";
import { FileUpload } from "@/components/FileUpload";
import { ApiKeyConfig } from "@/components/ApiKeyConfig";
import { RiskGauge } from "@/components/RiskGauge";
import { EmergencyAlert } from "@/components/EmergencyAlert";
import { TestResultsTable } from "@/components/TestResultsTable";
import { ConfidenceScore } from "@/components/ConfidenceScore";
import { SummaryCard } from "@/components/SummaryCard";
import { AnalysisResult, generateMockAnalysis } from "@/lib/mockAnalysis";
import { 
  User, 
  Stethoscope, 
  TrendingUp, 
  Heart, 
  Lightbulb,
  AlertTriangle,
  Activity,
  FileText,
  ChevronRight,
  Clock,
  Shield,
  Sparkles,
  Orbit
} from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("medanalyze_api_key") || "";
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  const handleApiKeySave = useCallback((key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem("medanalyze_api_key", key);
    } else {
      localStorage.removeItem("medanalyze_api_key");
    }
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    setDismissedAlerts([]);

    await new Promise((resolve) => setTimeout(resolve, 3000));
    const mockResult = generateMockAnalysis();
    setAnalysis(mockResult);
    setIsAnalyzing(false);
  }, []);

  const handleDismissAlert = useCallback((index: number) => {
    setDismissedAlerts((prev) => [...prev, index]);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Interactive Space Background */}
      <SpaceBackground />
      
      {/* Content Layer */}
      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Hero Section */}
          <section className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong mb-6">
              <Orbit className="h-4 w-4 text-primary animate-spin" style={{ animationDuration: "10s" }} />
              <span className="text-sm text-muted-foreground">Powered by Advanced AI</span>
              <Sparkles className="h-4 w-4 text-accent animate-glow-pulse" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              <span className="bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent">
                AI-Powered
              </span>{" "}
              Medical Analysis
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Upload your medical report and receive intelligent insights, risk assessments, 
              and personalized recommendations from the cosmos of AI.
            </p>
          </section>

          {/* API Configuration */}
          <section className="mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <ApiKeyConfig onSave={handleApiKeySave} savedKey={apiKey} />
          </section>

          {/* File Upload */}
          <section className="mb-12 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <FileUpload onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
          </section>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-8">
              {/* Emergency Alerts */}
              {analysis.emergencyAlerts.length > 0 && (
                <section className="space-y-4 animate-fade-in">
                  {analysis.emergencyAlerts
                    .filter((_, index) => !dismissedAlerts.includes(index))
                    .map((alert, index) => (
                      <EmergencyAlert
                        key={index}
                        {...alert}
                        onDismiss={() => handleDismissAlert(index)}
                      />
                    ))}
                </section>
              )}

              {/* Quick Stats */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                {/* Risk Score */}
                <div className="card-space p-6 flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Health Risk Score
                  </h3>
                  <RiskGauge score={analysis.riskScore} size="md" />
                  <div className="mt-4 w-full space-y-2">
                    <p className="text-xs text-muted-foreground text-center font-medium">
                      Top Risk Contributors:
                    </p>
                    {analysis.topRiskContributors.map((contributor, i) => (
                      <div 
                        key={i}
                        className="flex items-center gap-2 text-sm glass rounded-lg p-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-critical/20 text-critical flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground text-xs">{contributor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="lg:col-span-2">
                  <ConfidenceScore 
                    score={analysis.confidenceScore} 
                    factors={analysis.confidenceFactors}
                  />
                </div>
              </section>

              {/* Test Results Table */}
              <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                <TestResultsTable results={analysis.testResults} />
              </section>

              {/* Patient Summary */}
              <section className="animate-fade-in" style={{ animationDelay: "150ms" }}>
                <SummaryCard 
                  title="Patient-Friendly Summary" 
                  icon={<User className="h-5 w-5" />}
                  variant="patient"
                >
                  <div className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                      {analysis.patientSummary.simpleExplanation}
                    </p>

                    <div>
                      <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        Key Findings
                      </h4>
                      <ul className="space-y-2">
                        {analysis.patientSummary.keyFindings.map((finding, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground glass rounded-lg p-3">
                            <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {analysis.patientSummary.abnormalParameters.map((param, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1.5 rounded-full text-sm bg-warning/20 text-warning border border-warning/30"
                          style={{ textShadow: "0 0 10px currentColor" }}
                        >
                          {param}
                        </span>
                      ))}
                    </div>
                  </div>
                </SummaryCard>
              </section>

              {/* Two Column Layout */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
                {/* Possible Conditions */}
                <SummaryCard 
                  title="Possible Conditions" 
                  icon={<Activity className="h-5 w-5" />}
                >
                  <div className="space-y-3">
                    {analysis.possibleConditions.map((condition, i) => (
                      <div 
                        key={i}
                        className="p-3 rounded-xl glass"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground text-sm">
                            {condition.condition}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            condition.likelihood === "likely" && "bg-warning/20 text-warning",
                            condition.likelihood === "possible" && "bg-info/20 text-info",
                            condition.likelihood === "unlikely" && "bg-muted text-muted-foreground"
                          )}>
                            {condition.likelihood}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Based on: {condition.basedOn}
                        </p>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground italic pt-2 glass rounded-lg p-2">
                      ⚠️ These are AI-generated insights, not medical diagnoses.
                    </p>
                  </div>
                </SummaryCard>

                {/* Risk Assessment */}
                <SummaryCard 
                  title="Risk Assessment" 
                  icon={<Shield className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <div className={cn(
                      "p-4 rounded-xl text-center",
                      analysis.riskAssessment.level === "low" && "bg-success/20 text-success",
                      analysis.riskAssessment.level === "moderate" && "bg-warning/20 text-warning",
                      analysis.riskAssessment.level === "high" && "bg-critical/20 text-critical"
                    )}
                    style={{ 
                      boxShadow: analysis.riskAssessment.level === "high" 
                        ? "0 0 20px rgba(239,68,68,0.3)" 
                        : analysis.riskAssessment.level === "moderate"
                        ? "0 0 20px rgba(245,158,11,0.3)"
                        : "0 0 20px rgba(34,197,94,0.3)"
                    }}
                    >
                      <span className="text-lg font-bold capitalize glow-text">
                        {analysis.riskAssessment.level} Risk
                      </span>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2 text-sm">Immediate Concerns</h4>
                      <ul className="space-y-1">
                        {analysis.riskAssessment.immediateRisks.map((risk, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="text-warning">•</span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2 text-sm">Long-term Risks</h4>
                      <ul className="space-y-1">
                        {analysis.riskAssessment.longTermRisks.slice(0, 3).map((risk, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="text-critical">•</span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </SummaryCard>
              </section>

              {/* Predictions */}
              <section className="animate-fade-in" style={{ animationDelay: "250ms" }}>
                <SummaryCard 
                  title="Predictive Insights" 
                  icon={<TrendingUp className="h-5 w-5" />}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-2 flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-primary" />
                        Progression Outlook
                      </h4>
                      <p className="text-sm text-muted-foreground glass rounded-lg p-3">
                        {analysis.predictions.progressionOutlook}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2 flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        Recovery Estimate
                      </h4>
                      <p className="text-sm text-muted-foreground glass rounded-lg p-3 mb-3">
                        {analysis.predictions.recoveryEstimate}
                      </p>
                      
                      <h4 className="font-medium text-foreground mb-2 text-sm">Factors Affecting Recovery</h4>
                      <ul className="space-y-1">
                        {analysis.predictions.factorsAffecting.slice(0, 3).map((factor, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <ChevronRight className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </SummaryCard>
              </section>

              {/* Recommendations */}
              <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
                <SummaryCard 
                  title="Improvement & Prevention Guidance" 
                  icon={<Lightbulb className="h-5 w-5" />}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-3 flex items-center gap-2 text-sm">
                        <Heart className="h-4 w-4 text-success" />
                        Lifestyle Changes
                      </h4>
                      <ul className="space-y-2">
                        {analysis.recommendations.lifestyle.slice(0, 3).map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="text-success">✓</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-3 flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-info" />
                        Preventive Measures
                      </h4>
                      <ul className="space-y-2">
                        {analysis.recommendations.preventive.slice(0, 3).map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="text-info">✓</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-3 flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        Warning Signs
                      </h4>
                      <ul className="space-y-2">
                        {analysis.recommendations.warningSignsToMonitor.slice(0, 3).map((sign, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="text-warning">!</span>
                            {sign}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </SummaryCard>
              </section>

              {/* Doctor Summary */}
              <section className="animate-fade-in" style={{ animationDelay: "350ms" }}>
                <SummaryCard 
                  title="Doctor-Ready Clinical Summary" 
                  icon={<Stethoscope className="h-5 w-5" />}
                  variant="doctor"
                >
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2 text-sm">Clinical Findings</h4>
                      <p className="text-sm text-muted-foreground font-mono glass rounded-lg p-3">
                        {analysis.doctorSummary.clinicalFindings}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2 text-sm">Suspected Conditions</h4>
                      <p className="text-sm text-muted-foreground glass rounded-lg p-3">
                        {analysis.doctorSummary.suspectedConditions}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2 text-sm">Recommended Follow-up Actions</h4>
                      <ul className="space-y-2">
                        {analysis.doctorSummary.recommendedFollowUp.slice(0, 5).map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground glass rounded-lg p-2">
                            <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-xs">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </SummaryCard>
              </section>

              {/* Disclaimer */}
              <section className="p-6 rounded-2xl glass animate-fade-in" style={{ animationDelay: "400ms" }}>
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-warning/20" style={{ boxShadow: "0 0 15px rgba(245,158,11,0.2)" }}>
                    <FileText className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      ⚠️ Important Disclaimer
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This AI-generated analysis is for <strong className="text-foreground">informational purposes only</strong> and 
                      does not replace professional medical advice, diagnosis, or treatment. 
                      Always consult a licensed healthcare provider for medical decisions. 
                      In case of emergency, contact emergency services immediately.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Empty State */}
          {!analysis && !isAnalyzing && (
            <section className="text-center py-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full glass-strong mb-6 animate-float">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Report Analyzed Yet
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Upload a medical report to receive AI-powered insights, 
                risk assessments, and personalized recommendations.
              </p>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 glass mt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © 2024 MedAnalyze AI • For informational purposes only
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-success" />
                  Secure & Private
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;