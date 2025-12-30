import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Heart } from "lucide-react";

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
];

const OPTIONS = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" },
];

const AssessmentGAD7 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers({ ...answers, [questionIndex]: value });
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, value) => sum + parseInt(value), 0);
  };

  const getSeverity = (score: number) => {
    if (score <= 4) return { level: "Minimal", diagnosis: "Minimal anxiety" };
    if (score <= 9) return { level: "Mild", diagnosis: "Mild anxiety" };
    if (score <= 14) return { level: "Moderate", diagnosis: "Moderate anxiety" };
    return { level: "Severe", diagnosis: "Severe anxiety" };
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== GAD7_QUESTIONS.length) {
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
        type: "GAD7",
        responses,
        score,
        severity: level,
        diagnosis,
      });

      toast.success("Assessment completed!");
      navigate("/assessment-results", {
        state: {
          assessmentResult: {
            type: "GAD-7 Anxiety Screening",
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

  const isComplete = Object.keys(answers).length === GAD7_QUESTIONS.length;
  const progress = (Object.keys(answers).length / GAD7_QUESTIONS.length) * 100;

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
          <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">GAD-7 Anxiety Screening</h1>
            <p className="text-muted-foreground">Generalized Anxiety Disorder-7</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {Object.keys(answers).length} / {GAD7_QUESTIONS.length}
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
              Over the last 2 weeks, how often have you been bothered by any of the following problems?
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-6">
          {GAD7_QUESTIONS.map((question, index) => (
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
            <Button
              onClick={handleSubmit}
              disabled={!isComplete || isSubmitting}
              className="w-full"
              size="lg"
            >
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
              <strong>Important:</strong> This screening tool is not a diagnostic tool. It is intended to help identify
              symptoms that may need further evaluation by a qualified healthcare professional.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentGAD7;
