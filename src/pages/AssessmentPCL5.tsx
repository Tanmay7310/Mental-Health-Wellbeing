import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, AlertCircle } from "lucide-react";

const QUESTIONS = [
  "Unwanted upsetting memories related to a stressful experience",
  "Disturbing dreams or nightmares",
  "Feeling as if the event is happening again (flashback-like feelings)",
  "Strong distress when reminded of the event",
  "Physical reactions when reminded (e.g., sweating, heart racing)",
  "Avoiding thoughts or feelings about the event",
  "Avoiding situations, places, or people that remind you",
  "Persistent negative beliefs about yourself, others, or the world",
  "Blaming yourself or others for what happened",
  "Strong negative emotions (fear, anger, guilt, shame)",
  "Loss of interest in activities",
  "Feeling distant or cut off from others",
];

const OPTIONS = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "A little bit" },
  { value: "2", label: "Moderately" },
  { value: "3", label: "Quite a bit" },
  { value: "4", label: "Extremely" },
];

const AssessmentPCL5 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers({ ...answers, [questionIndex]: value });
  };

  const calculateScore = () => Object.values(answers).reduce((sum, value) => sum + parseInt(value), 0);

  const getSeverity = (score: number) => {
    if (score <= 10) return { level: "Minimal", diagnosis: "Minimal trauma-related symptoms" };
    if (score <= 20) return { level: "Mild", diagnosis: "Mild trauma-related symptoms" };
    if (score <= 35) return { level: "Moderate", diagnosis: "Moderate trauma-related symptoms" };
    return { level: "Severe", diagnosis: "Severe trauma-related symptoms" };
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== QUESTIONS.length) {
      toast.error("Please answer all questions");
      return;
    }

    if (!user) {
      toast.error("You must be logged in");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      const score = calculateScore();
      const { level, diagnosis } = getSeverity(score);

      const responses: Record<string, number> = {};
      Object.entries(answers).forEach(([key, value]) => {
        responses[key] = parseInt(value);
      });

      await apiClient.createAssessment({
        type: "PCL5",
        responses,
        score,
        severity: level,
        diagnosis,
      });

      toast.success("Assessment completed!");
      navigate("/assessment-results", {
        state: {
          assessmentResult: {
            type: "PTSD Screening",
            score,
            severity: level,
            diagnosis,
          },
        },
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to save assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = Object.keys(answers).length === QUESTIONS.length;
  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">PTSD Screening</h1>
            <p className="text-muted-foreground">Trauma symptom checklist</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {Object.keys(answers).length} / {QUESTIONS.length}
            </span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>
              Answer based on how you have felt recently. This is a screening tool, not a diagnosis.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-6">
          {QUESTIONS.map((question, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  {index + 1}. {question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={answers[index]} onValueChange={(value) => handleAnswerChange(index, value)}>
                  <div className="space-y-3">
                    {OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`q${index}-${option.value}`} />
                        <Label htmlFor={`q${index}-${option.value}`} className="cursor-pointer flex-1">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <Button onClick={handleSubmit} disabled={!isComplete || isSubmitting} className="w-full" size="lg">
              {isSubmitting ? "Submitting..." : "Submit Assessment"}
            </Button>
            {!isComplete && (
              <p className="text-sm text-muted-foreground text-center mt-4">Please answer all questions to submit</p>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> This screening tool is not a diagnostic tool. If you are in danger or feel
              unsafe, seek emergency help.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentPCL5;
