import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Shield, MapPin } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6">
            <Heart className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Mental Health Companion
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your comprehensive mental wellness platform for understanding, monitoring, 
            and improving your mental health with scientifically validated assessments
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg px-8">
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Comprehensive Assessments</h3>
            <p className="text-muted-foreground">
              Access validated screening tools including PHQ-9, GAD-7, PCL-5, and more 
              to understand your mental health
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Emergency Support</h3>
            <p className="text-muted-foreground">
              Built-in emergency contact system with vital monitoring and instant 
              alerts to your healthcare providers
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Professional Help</h3>
            <p className="text-muted-foreground">
              Locate nearby mental health professionals with integrated maps 
              and get directions instantly
            </p>
          </div>
        </div>

        {/* Assessment Types */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Available Assessments</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Depression (PHQ-9)",
              "Anxiety (GAD-7)",
              "Bipolar Disorder",
              "PTSD (PCL-5)",
              "OCD Screening",
              "ADHD (ASRS-v1.1)",
              "Sleep Disorders",
              "Alcohol Use (AUDIT)",
              "Substance Use (DAST-10)",
            ].map((assessment, index) => (
              <div
                key={index}
                className="bg-card p-4 rounded-lg text-center border border-border hover:border-primary transition-colors"
              >
                <p className="font-medium text-sm">{assessment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 text-center border-t">
        <p className="text-sm text-muted-foreground">
          This platform provides screening tools and is not a substitute for professional diagnosis. 
          Always consult with qualified mental health professionals for proper diagnosis and treatment.
        </p>
      </div>
    </div>
  );
};

export default Index;
