import { useState, useCallback } from "react";
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
  Shield
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

    // Simulate API call delay - in production, this would call the actual AI API
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Generate mock analysis for demonstration
    const mockResult = generateMockAnalysis();
    setAnalysis(mockResult);
    setIsAnalyzing(false);
  }, []);

  const handleDismissAlert = useCallback((index: number) => {
    setDismissedAlerts((prev) => [...prev, index]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI-Powered Medical Report Analysis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your medical report and receive intelligent insights, risk assessments, 
            and personalized recommendations powered by advanced AI.
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
          <div className="space-y-8 animate-fade-in">
            {/* Emergency Alerts */}
            {analysis.emergencyAlerts.length > 0 && (
              <section className="space-y-4">
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
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Risk Score */}
              <div className="card-medical p-6 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-foreground mb-4">
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
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="w-5 h-5 rounded-full bg-critical/10 text-critical flex items-center justify-center text-xs font-medium">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{contributor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidence Score */}
              <div className="md:col-span-2">
                <ConfidenceScore 
                  score={analysis.confidenceScore} 
                  factors={analysis.confidenceFactors}
                />
              </div>
            </section>

            {/* Test Results Table */}
            <section>
              <TestResultsTable results={analysis.testResults} />
            </section>

            {/* Patient Summary */}
            <section>
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
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      Key Findings
                    </h4>
                    <ul className="space-y-2">
                      {analysis.patientSummary.keyFindings.map((finding, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {analysis.patientSummary.abnormalParameters.map((param, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 rounded-full text-sm bg-warning/10 text-warning border border-warning/20"
                      >
                        {param}
                      </span>
                    ))}
                  </div>
                </div>
              </SummaryCard>
            </section>

            {/* Two Column Layout */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Possible Conditions */}
              <SummaryCard 
                title="Possible Conditions" 
                icon={<Activity className="h-5 w-5" />}
              >
                <div className="space-y-3">
                  {analysis.possibleConditions.map((condition, i) => (
                    <div 
                      key={i}
                      className="p-3 rounded-lg bg-secondary/50 border"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">
                          {condition.condition}
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          condition.likelihood === "likely" && "bg-warning/10 text-warning",
                          condition.likelihood === "possible" && "bg-info/10 text-info",
                          condition.likelihood === "unlikely" && "bg-muted text-muted-foreground"
                        )}>
                          {condition.likelihood}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Based on: {condition.basedOn}
                      </p>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground italic pt-2">
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
                    "p-3 rounded-lg text-center",
                    analysis.riskAssessment.level === "low" && "bg-success/10 text-success",
                    analysis.riskAssessment.level === "moderate" && "bg-warning/10 text-warning",
                    analysis.riskAssessment.level === "high" && "bg-critical/10 text-critical"
                  )}>
                    <span className="text-lg font-semibold capitalize">
                      {analysis.riskAssessment.level} Risk
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Immediate Concerns</h4>
                    <ul className="space-y-1">
                      {analysis.riskAssessment.immediateRisks.map((risk, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-warning">•</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Long-term Risks</h4>
                    <ul className="space-y-1">
                      {analysis.riskAssessment.longTermRisks.slice(0, 4).map((risk, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
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
            <section>
              <SummaryCard 
                title="Predictive Insights" 
                icon={<TrendingUp className="h-5 w-5" />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      Progression Outlook
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {analysis.predictions.progressionOutlook}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Recovery Estimate
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {analysis.predictions.recoveryEstimate}
                    </p>
                    
                    <h4 className="font-medium text-foreground mb-2">Factors Affecting Recovery</h4>
                    <ul className="space-y-1">
                      {analysis.predictions.factorsAffecting.slice(0, 3).map((factor, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SummaryCard>
            </section>

            {/* Recommendations */}
            <section>
              <SummaryCard 
                title="Improvement & Prevention Guidance" 
                icon={<Lightbulb className="h-5 w-5" />}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-success" />
                      Lifestyle Changes
                    </h4>
                    <ul className="space-y-2">
                      {analysis.recommendations.lifestyle.slice(0, 4).map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-success">✓</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-info" />
                      Preventive Measures
                    </h4>
                    <ul className="space-y-2">
                      {analysis.recommendations.preventive.slice(0, 4).map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-info">✓</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      Warning Signs
                    </h4>
                    <ul className="space-y-2">
                      {analysis.recommendations.warningSignsToMonitor.slice(0, 4).map((sign, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
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
            <section>
              <SummaryCard 
                title="Doctor-Ready Clinical Summary" 
                icon={<Stethoscope className="h-5 w-5" />}
                variant="doctor"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Clinical Findings</h4>
                    <p className="text-sm text-muted-foreground font-mono bg-secondary/50 p-3 rounded-lg">
                      {analysis.doctorSummary.clinicalFindings}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Suspected Conditions</h4>
                    <p className="text-sm text-muted-foreground">
                      {analysis.doctorSummary.suspectedConditions}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Recommended Follow-up Actions</h4>
                    <ul className="space-y-2">
                      {analysis.doctorSummary.recommendedFollowUp.map((action, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {i + 1}
                          </span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SummaryCard>
            </section>

            {/* Disclaimer */}
            <section className="p-6 rounded-xl bg-muted/50 border">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-warning/10">
                  <FileText className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    ⚠️ Important Disclaimer
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This AI-generated analysis is for <strong>informational purposes only</strong> and 
                    does not replace professional medical advice, diagnosis, or treatment. 
                    Always consult a licensed healthcare provider for medical decisions. 
                    In case of emergency, contact emergency services immediately. 
                    This tool is not intended to provide definitive diagnoses or prescribe medications.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Empty State */}
        {!analysis && !isAnalyzing && (
          <section className="text-center py-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-6">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Report Analyzed Yet
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Upload a medical report (PDF, image, or text) to receive AI-powered insights, 
              risk assessments, and personalized recommendations.
            </p>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 MedAnalyze AI. For informational purposes only.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-success" />
                Secure & Private
              </span>
              <span>•</span>
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;