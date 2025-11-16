import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const questions = [
  {
    id: 1,
    question: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
    category: "depression"
  },
  {
    id: 2,
    question: "How often have you felt nervous, anxious, or on edge?",
    category: "anxiety"
  },
  {
    id: 3,
    question: "How often have you experienced sudden feelings of intense fear or panic?",
    category: "anxiety"
  },
  {
    id: 4,
    question: "How often have you had little interest or pleasure in doing things?",
    category: "depression"
  },
  {
    id: 5,
    question: "How often have you had trouble falling asleep, staying asleep, or sleeping too much?",
    category: "sleep"
  },
  {
    id: 6,
    question: "How often have you felt tired or had little energy?",
    category: "depression"
  },
  {
    id: 7,
    question: "How often have you been unable to stop or control worrying?",
    category: "anxiety"
  },
  {
    id: 8,
    question: "How often have you had trouble concentrating on things?",
    category: "adhd"
  },
  {
    id: 9,
    question: "How often have you experienced unwanted thoughts that you can't control?",
    category: "ocd"
  },
  {
    id: 10,
    question: "How often have you felt the need to repeat certain behaviors or rituals?",
    category: "ocd"
  }
];

const options = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" }
];

const InitialScreening = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponse = (value: string) => {
    setResponses({ ...responses, [questions[currentQuestion].id]: parseInt(value) });
  };

  const handleNext = () => {
    if (responses[questions[currentQuestion].id] === undefined) {
      toast({
        title: "Please select an answer",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const analyzeResponses = () => {
    const categoryScores: Record<string, number> = {};
    
    questions.forEach(q => {
      const score = responses[q.id] || 0;
      categoryScores[q.category] = (categoryScores[q.category] || 0) + score;
    });

    const totalScore = Object.values(responses).reduce((sum, val) => sum + val, 0);
    
    // Determine primary concern
    const sortedCategories = Object.entries(categoryScores)
      .sort(([, a], [, b]) => b - a);
    
    const primaryCategory = sortedCategories[0][0];
    const primaryScore = sortedCategories[0][1];

    let diagnosis = "";
    let severity = "";

    if (totalScore < 10) {
      severity = "Minimal symptoms";
      diagnosis = "Low risk - General wellness recommended";
    } else if (totalScore < 15) {
      severity = "Mild symptoms";
    } else if (totalScore < 20) {
      severity = "Moderate symptoms";
    } else {
      severity = "Severe symptoms";
    }

    if (totalScore >= 10) {
      if (primaryCategory === "depression") {
        diagnosis = primaryScore >= 6 ? "Possible Major Depressive Disorder" : "Mild depressive symptoms";
      } else if (primaryCategory === "anxiety") {
        diagnosis = primaryScore >= 6 ? "Possible Generalized Anxiety Disorder" : "Mild anxiety symptoms";
      } else if (primaryCategory === "ocd") {
        diagnosis = primaryScore >= 4 ? "Possible Obsessive-Compulsive Disorder" : "Mild OCD symptoms";
      } else if (primaryCategory === "adhd") {
        diagnosis = "Possible attention-related concerns";
      } else if (primaryCategory === "sleep") {
        diagnosis = "Sleep disorder screening recommended";
      }
    }

    return {
      type: "Initial Mental Health Screening",
      score: totalScore,
      severity,
      diagnosis
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in",
          variant: "destructive"
        });
        return;
      }

      const result = analyzeResponses();

      await supabase.from("assessments").insert({
        user_id: user.id,
        assessment_type: "phq9", // Using existing type for now
        responses: responses,
        score: result.score,
        severity: result.severity,
        diagnosis: result.diagnosis
      });

      toast({
        title: "Screening complete",
        description: "Thank you for completing the initial screening"
      });

      navigate("/assessment-results", { 
        state: { 
          assessmentResult: result,
          isInitialScreening: true
        } 
      });
    } catch (error) {
      console.error("Error saving screening:", error);
      toast({
        title: "Error",
        description: "Failed to save screening results",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Initial Mental Health Screening</CardTitle>
            <CardDescription>
              This brief screening helps us understand your mental health needs
            </CardDescription>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">{questions[currentQuestion].question}</h3>
              
              <RadioGroup
                value={responses[questions[currentQuestion].id]?.toString()}
                onValueChange={handleResponse}
              >
                {options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value={option.value} id={`q${currentQuestion}-${option.value}`} />
                    <Label 
                      htmlFor={`q${currentQuestion}-${option.value}`}
                      className="font-normal cursor-pointer flex-1 py-3"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex gap-4 pt-4">
              {currentQuestion > 0 && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={responses[questions[currentQuestion].id] === undefined || isSubmitting}
                className="flex-1"
              >
                {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InitialScreening;
