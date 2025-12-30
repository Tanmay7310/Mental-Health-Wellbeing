import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Brain } from "lucide-react";

const QUESTIONS = [
  "Difficulty sustaining attention on tasks",
  "Frequently losing track of details or making careless mistakes",
  "Avoiding or delaying tasks that require sustained mental effort",
  "Feeling restless or fidgety",
  "Difficulty organizing tasks or managing time",
  "Interrupting others or finishing their sentences",
  "Misplacing items needed for tasks (keys, phone, documents)",
  "Trouble remembering appointments or obligations",
];

const OPTIONS = [
  { value: "0", label: "Never" },
  { value: "1", label: "Rarely" },
  { value: "2", label: "Sometimes" },
  { value: "3", label: "Often" },
  { value: "4", label: "Very often" },
];

const AssessmentASRS = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers({ ...answers, [questionIndex]: value });
  };

  const calculateScore = () => Object.values(answers).reduce((sum, value) => sum + parseInt(value), 0);

  const getSeverity = (score: number) => {
    if (score <= 6) return { level: "Minimal", diagnosis: "Minimal attention-related symptoms" };
    if (score <= 12) return { level: "Mild", diagnosis: "Mild attention-related symptoms" };
    if (score <= 20) return { level: "Moderate", diagnosis: "Moderate attention-related symptoms" };
    return { level: "Severe", diagnosis: "Severe attention-related symptoms" };
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
        type: "ASRS",
        responses,
        score,
        severity: level,
        diagnosis,
      });

      toast.success("Assessment completed!");
      navigate("/assessment-results", {
        state: {
          assessmentResult: {
            type: "ADHD Screening",
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
          <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">ADHD Screening</h1>
            <p className="text-muted-foreground">Attention and hyperactivity symptoms check</p>
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
              <strong>Important:</strong> This screening tool is not a diagnostic tool. Consider talking to a qualified
              mental health professional if you have concerns.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentASRS;
