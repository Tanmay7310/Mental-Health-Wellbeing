import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Brain, 
  Heart, 
  Activity, 
  MapPin, 
  LogOut, 
  ClipboardList,
  AlertCircle,
  Phone
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);

      // Fetch profile
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } else if (!profileData.home_address) {
        // Profile incomplete, redirect to complete profile
        navigate("/complete-profile");
      } else {
        setProfile(profileData);
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const assessments = [
    {
      title: "Depression (PHQ-9)",
      description: "Patient Health Questionnaire for depression screening",
      icon: Brain,
      path: "/assessment/phq9",
      color: "text-blue-600",
    },
    {
      title: "Anxiety (GAD-7)",
      description: "Generalized Anxiety Disorder assessment",
      icon: Heart,
      path: "/assessment/gad7",
      color: "text-purple-600",
    },
    {
      title: "Bipolar Disorder",
      description: "Mood Disorder Questionnaire",
      icon: Activity,
      path: "/assessment/mood-disorder",
      color: "text-orange-600",
    },
    {
      title: "PTSD (PCL-5)",
      description: "Post-Traumatic Stress Disorder checklist",
      icon: AlertCircle,
      path: "/assessment/pcl5",
      color: "text-red-600",
    },
    {
      title: "OCD Screening",
      description: "Obsessive-Compulsive Disorder questions",
      icon: ClipboardList,
      path: "/assessment/ocd",
      color: "text-teal-600",
    },
    {
      title: "ADHD (ASRS-v1.1)",
      description: "Adult ADHD Self-Report Scale",
      icon: Brain,
      path: "/assessment/asrs",
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Mental Health Companion</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {profile?.full_name}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/vital-monitor")}>
            <CardHeader>
              <Activity className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Vital Monitor</CardTitle>
              <CardDescription>Track your vital signs</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/emergency")}>
            <CardHeader>
              <Phone className="w-8 h-8 text-destructive mb-2" />
              <CardTitle className="text-lg">Emergency Contacts</CardTitle>
              <CardDescription>Manage emergency contacts</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/find-doctors")}>
            <CardHeader>
              <MapPin className="w-8 h-8 text-accent mb-2" />
              <CardTitle className="text-lg">Find Doctors</CardTitle>
              <CardDescription>Locate nearby mental health professionals</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Assessments Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Mental Health Assessments</h2>
          <p className="text-muted-foreground mb-6">
            Take these scientifically validated assessments to understand your mental health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
              onClick={() => navigate(assessment.path)}
            >
              <CardHeader>
                <assessment.icon className={`w-10 h-10 ${assessment.color} mb-3`} />
                <CardTitle className="text-lg">{assessment.title}</CardTitle>
                <CardDescription>{assessment.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* History */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Assessments</CardTitle>
              <CardDescription>View your assessment history</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => navigate("/history")}>
                View History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
