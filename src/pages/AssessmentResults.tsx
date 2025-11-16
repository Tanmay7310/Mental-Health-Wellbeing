import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, AlertCircle, CheckCircle, Info } from "lucide-react";

interface AssessmentResult {
  type: string;
  score: number;
  severity: string;
  diagnosis: string;
}

const AssessmentResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    const state = location.state as { assessmentResult?: AssessmentResult; isInitialScreening?: boolean };
    if (state?.assessmentResult) {
      setResult(state.assessmentResult);
    } else {
      navigate("/dashboard");
    }
  }, [location, navigate]);

  const isInitialScreening = (location.state as any)?.isInitialScreening;

  if (!result) return null;

  const getSeverityColor = (severity: string) => {
    if (severity.includes("Minimal") || severity.includes("None")) return "text-success";
    if (severity.includes("Mild")) return "text-warning";
    if (severity.includes("Moderate")) return "text-orange-600";
    return "text-destructive";
  };

  const getSeverityIcon = (severity: string) => {
    if (severity.includes("Minimal") || severity.includes("None")) return CheckCircle;
    if (severity.includes("Mild")) return Info;
    return AlertCircle;
  };

  const getSpecialistType = () => {
    const diagnosis = result.diagnosis.toLowerCase();
    if (diagnosis.includes("depression")) return "psychiatrist specializing in depression";
    if (diagnosis.includes("anxiety")) return "anxiety specialist";
    if (diagnosis.includes("bipolar")) return "bipolar disorder specialist";
    if (diagnosis.includes("ptsd")) return "trauma therapist";
    if (diagnosis.includes("ocd")) return "OCD specialist";
    if (diagnosis.includes("adhd")) return "ADHD specialist";
    return "mental health professional";
  };

  const handleFindDoctors = () => {
    navigate("/find-doctors", { 
      state: { 
        searchTerm: getSpecialistType(),
        diagnosis: result.diagnosis 
      } 
    });
  };

  const Icon = getSeverityIcon(result.severity);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Results Card */}
        <Card className="mb-6 border-2">
          <CardHeader className="text-center">
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
              result.severity.includes("Minimal") ? "bg-success/10" :
              result.severity.includes("Mild") ? "bg-warning/10" :
              result.severity.includes("Moderate") ? "bg-orange-100" :
              "bg-destructive/10"
            }`}>
              <Icon className={`w-10 h-10 ${getSeverityColor(result.severity)}`} />
            </div>
            <CardTitle className="text-2xl">Assessment Complete</CardTitle>
            <CardDescription>{result.type}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Your Score</p>
              <p className="text-5xl font-bold text-primary">{result.score}</p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-6 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Severity Level</p>
              <p className={`text-2xl font-semibold ${getSeverityColor(result.severity)}`}>
                {result.severity}
              </p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-6 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Diagnosis</p>
              <p className="text-lg font-medium">{result.diagnosis}</p>
            </div>

            {!result.severity.includes("Minimal") && (
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="font-medium">Important Information</p>
                    <p className="text-sm text-muted-foreground">
                      These results are for screening purposes only and do not constitute a clinical diagnosis. 
                      We recommend consulting with a mental health professional for proper evaluation and treatment.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Doctor Recommendation Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Recommended Next Steps
            </CardTitle>
            <CardDescription>
              Find mental health professionals near you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!result.severity.includes("Minimal") ? (
              <>
                <p className="text-sm">
                  Based on your assessment results, we recommend consulting with a <strong>{getSpecialistType()}</strong> who can provide proper evaluation and treatment.
                </p>
                <Button onClick={handleFindDoctors} className="w-full" size="lg">
                  <MapPin className="w-4 h-4 mr-2" />
                  Find {getSpecialistType()}s Near Me
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm">
                  Your assessment shows minimal symptoms. However, if you have concerns about your mental health, 
                  you can still consult with a mental health professional.
                </p>
                <Button onClick={handleFindDoctors} variant="outline" className="w-full" size="lg">
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Mental Health Professionals
                </Button>
              </>
            )}

            <div className="pt-4 border-t">
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={() => navigate(isInitialScreening ? "/complete-profile" : "/dashboard")}
              >
                {isInitialScreening ? "Complete Your Profile" : "Take Another Assessment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentResults;
