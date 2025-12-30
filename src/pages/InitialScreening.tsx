import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { useAuth } from "@/hooks/useAuth";

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
    question: "How often have you had trouble concentrating on things, such as reading the newspaper or watching television?",
    category: "adhd"
  },
  {
    id: 9,
    question: "How often have you experienced unwanted thoughts, images, or impulses that you can't control?",
    category: "ocd"
  },
  {
    id: 10,
    question: "How often have you felt the need to repeat certain behaviors or mental acts (like washing hands, checking things, or counting)?",
    category: "ocd"
  },
  {
    id: 11,
    question: "How often have you experienced periods of elevated mood, increased energy, or feeling unusually 'high' or irritable?",
    category: "bipolar"
  },
  {
    id: 12,
    question: "How often have you had difficulty sitting still or felt restless?",
    category: "adhd"
  },
  {
    id: 13,
    question: "How often have you experienced flashbacks or intrusive memories of a traumatic event?",
    category: "ptsd"
  },
  {
    id: 14,
    question: "How often have you avoided places, people, or activities that remind you of a traumatic event?",
    category: "ptsd"
  },
  {
    id: 15,
    question: "How often have you had thoughts of hurting yourself or ending your life?",
    category: "depression"
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
  const { refreshProfile } = useAuth();
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
        if (categoryScores["bipolar"] && categoryScores["bipolar"] >= 3) {
          diagnosis = "Possible Bipolar Disorder - Further evaluation recommended";
        } else {
          diagnosis = primaryScore >= 6 ? "Possible Major Depressive Disorder" : "Mild depressive symptoms";
        }
      } else if (primaryCategory === "anxiety") {
        if (categoryScores["ptsd"] && categoryScores["ptsd"] >= 4) {
          diagnosis = "Possible Post-Traumatic Stress Disorder (PTSD)";
        } else {
          diagnosis = primaryScore >= 6 ? "Possible Generalized Anxiety Disorder" : "Mild anxiety symptoms";
        }
      } else if (primaryCategory === "ocd") {
        diagnosis = primaryScore >= 4 ? "Possible Obsessive-Compulsive Disorder (OCD)" : "Mild OCD symptoms";
      } else if (primaryCategory === "adhd") {
        diagnosis = primaryScore >= 4 ? "Possible Attention-Deficit/Hyperactivity Disorder (ADHD)" : "Mild attention-related concerns";
      } else if (primaryCategory === "ptsd") {
        diagnosis = primaryScore >= 4 ? "Possible Post-Traumatic Stress Disorder (PTSD)" : "Mild trauma-related symptoms";
      } else if (primaryCategory === "bipolar") {
        diagnosis = primaryScore >= 3 ? "Possible Bipolar Disorder - Further evaluation recommended" : "Mild mood-related concerns";
      } else if (primaryCategory === "sleep") {
        diagnosis = "Sleep disorder screening recommended";
      }
    }

    // Check for suicidal ideation (critical)
    if (responses[15] && responses[15] >= 2) {
      severity = "Severe symptoms - Immediate attention required";
      diagnosis = "URGENT: Please seek immediate professional help or contact emergency services";
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
      // Check localStorage token directly using the correct keys from auth-utils
      const token = localStorage.getItem("mindtrap_access_token");
      const userId = localStorage.getItem("mindtrap_user_id");
      const refreshToken = localStorage.getItem("mindtrap_refresh_token");
      
      console.log("Submitting screening - Token exists:", !!token, "RefreshToken exists:", !!refreshToken, "UserId:", userId);
      
      if (!token || !userId) {
        console.error("No token or userId found in localStorage");
        toast({
          title: "Error",
          description: "You must be logged in. Please sign in again.",
          variant: "destructive"
        });
        navigate("/auth");
        setIsSubmitting(false);
        return;
      }
      
      // Don't verify token here - let the API client handle it
      // The API client will automatically refresh tokens if needed
      // Even if checkAuth failed earlier, the token might still be valid
      console.log("Proceeding with screening submission - API client will handle token validation...");

      const result = analyzeResponses();
      console.log("Calling completeInitialScreening API...");
      console.log("Token at submission time:", localStorage.getItem("mindtrap_access_token") ? "EXISTS" : "MISSING");

      // Complete initial screening via API (it will use the token from localStorage)
      // The API client will automatically handle token refresh if needed
      const response = await apiClient.completeInitialScreening(responses);
      console.log("Screening saved successfully:", response);

      // Refresh profile to update initialScreeningCompleted flag in useAuth state
      console.log("Refreshing profile in auth state...");
      await refreshProfile();
      console.log("Profile refreshed successfully");

      toast({
        title: "Screening complete",
        description: "Thank you for completing the initial screening"
      });

      navigate("/assessment-results", { 
        state: { 
          assessmentResult: response.result,
          isInitialScreening: true
        } 
      });
    } catch (error: any) {
      console.error("Error saving screening:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        statusCode: error.statusCode,
        isNetworkError: error.isNetworkError,
        isCorsError: error.isCorsError,
        token: localStorage.getItem("mindtrap_access_token") ? "EXISTS" : "MISSING"
      });
      
      const statusCode = error.statusCode || error.status;
      
      // Handle network/CORS errors
      if (error.isNetworkError || error.isCorsError || statusCode === 0) {
        toast({
          title: "Connection Error",
          description: error.message || "Cannot connect to backend. Please ensure the backend is running on port 8080.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Only clear tokens and redirect on definite 401
      if (statusCode === 401) {
        console.error("401 Unauthorized - clearing tokens");
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive"
        });
        localStorage.removeItem("mindtrap_access_token");
        localStorage.removeItem("mindtrap_refresh_token");
        localStorage.removeItem("mindtrap_user_id");
        navigate("/auth");
      } else if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
        // Also check error message for 401
        console.error("401 in error message - clearing tokens");
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive"
        });
        localStorage.removeItem("mindtrap_access_token");
        localStorage.removeItem("mindtrap_refresh_token");
        localStorage.removeItem("mindtrap_user_id");
        navigate("/auth");
      } else {
        // For other errors (500, etc.), show error but keep tokens
        console.warn("Non-401 error, keeping tokens:", error.message);
        toast({
          title: "Error",
          description: error.message || "Failed to save screening results. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-24 md:pb-0">
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

        <div className="mt-6">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default InitialScreening;
