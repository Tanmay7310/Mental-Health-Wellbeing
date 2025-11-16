import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Brain } from "lucide-react";

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way",
];

const OPTIONS = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" },
];

const AssessmentPHQ9 = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers({ ...answers, [questionIndex]: value });
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, value) => sum + parseInt(value), 0);
  };

  const getSeverity = (score: number) => {
    if (score <= 4) return { level: "Minimal", diagnosis: "Minimal depression" };
    if (score <= 9) return { level: "Mild", diagnosis: "Mild depression" };
    if (score <= 14) return { level: "Moderate", diagnosis: "Moderate depression" };
    if (score <= 19) return { level: "Moderately Severe", diagnosis: "Moderately severe depression" };
    return { level: "Severe", diagnosis: "Severe depression" };
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== PHQ9_QUESTIONS.length) {
      toast.error("Please answer all questions");
      return;
    }

    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    const score = calculateScore();
    const { level, diagnosis } = getSeverity(score);

    const { error } = await supabase.from("assessments").insert({
      user_id: user!.id,
      assessment_type: "phq9",
      score,
      severity: level,
      responses: answers,
      diagnosis,
    });

    if (error) {
      toast.error("Failed to save assessment");
    } else {
      toast.success("Assessment completed!");
      navigate("/assessment-results", { 
        state: { 
          assessmentResult: { 
            type: "PHQ-9 Depression Screening",
            score, 
            severity: level,
            diagnosis 
          } 
        } 
      });
    }
    setIsSubmitting(false);
  };

  const isComplete = Object.keys(answers).length === PHQ9_QUESTIONS.length;
  const progress = (Object.keys(answers).length / PHQ9_QUESTIONS.length) * 100;

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
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">PHQ-9 Depression Screening</h1>
            <p className="text-muted-foreground">Patient Health Questionnaire-9</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Object.keys(answers).length} / {PHQ9_QUESTIONS.length}</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>
              Over the last 2 weeks, how often have you been bothered by any of the following problems?
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Questions */}
        <div className="space-y-6">
          {PHQ9_QUESTIONS.map((question, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  {index + 1}. {question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[index]}
                  onValueChange={(value) => handleAnswerChange(index, value)}
                >
                  <div className="space-y-3">
                    {OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`q${index}-${option.value}`} />
                        <Label 
                          htmlFor={`q${index}-${option.value}`}
                          className="cursor-pointer flex-1"
                        >
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

        {/* Submit Button */}
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
              <p className="text-sm text-muted-foreground text-center mt-4">
                Please answer all questions to submit
              </p>
            )}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="mt-6 border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> This screening tool is not a diagnostic tool. 
              It is intended to help identify symptoms that may need further evaluation by a qualified healthcare professional.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentPHQ9;
