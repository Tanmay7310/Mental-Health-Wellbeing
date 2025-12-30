import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
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
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sosRunning, setSosRunning] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (authLoading) return;
      
      // Check both user state and localStorage token
      const token = localStorage.getItem("mindtrap_access_token");
      if (!user && !token) {
        navigate("/auth");
        return;
      }
      
      // If we have a token but user state isn't set yet, try to fetch profile anyway
      // This handles the case where we just logged in and state hasn't updated yet
      if (token && !user) {
        // Wait a moment for state to potentially update
        await new Promise(resolve => setTimeout(resolve, 200));
        // If still no user, proceed with token-based auth
      }

      try {
        const profileData = await apiClient.getProfile();
        
        // Check if initial screening is completed
        if (!profileData.initialScreeningCompleted) {
          toast.info("Please complete the initial screening first");
          navigate("/initial-screening");
          setLoading(false);
          return;
        }

        // Check if profile is complete
        if (!profileData.homeAddress) {
          navigate("/complete-profile");
          setLoading(false);
          return;
        }

        setProfile(profileData);
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast.error(error.message || "Failed to load profile");
        if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
          navigate("/auth");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await logout();
  };

  const handleSos = async () => {
    if (sosRunning) return;
    setSosRunning(true);

    try {
      const contacts = await apiClient.getContacts();

      if (!contacts || contacts.length === 0) {
        toast.warning("No emergency contacts found. Please add emergency contacts first.");
        navigate("/emergency");
        return;
      }

      const alertPromises = contacts.map((contact: any) =>
        apiClient.sendEmergencyAlert(contact.id).catch((err: any) => {
          console.error(`Failed to alert ${contact.name}:`, err);
        })
      );
      await Promise.all(alertPromises);

      toast.error("⚠️ CRITICAL: Opening Phone Link for emergency contacts...", {
        duration: 10000,
      });

      // Automatically open Phone Link for all contacts (browser will still require confirmation)
      contacts.forEach((contact: any, index: number) => {
        setTimeout(() => {
          window.open(`tel:${contact.phone}`, "_blank");
          toast.info(`Opening Phone Link for ${contact.name} - ${contact.phone}`, {
            duration: 3000,
          });
        }, index * 1000);
      });
    } catch (error) {
      console.error("SOS failed:", error);
      toast.error("Failed to trigger SOS");
    } finally {
      setSosRunning(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-24 md:pb-0">
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
                Welcome, {profile?.fullName}
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
        <div className="mb-6">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleSos}
            disabled={sosRunning}
          >
            <Phone className="w-4 h-4 mr-2" />
            {sosRunning ? "Sending SOS..." : "SOS"}
          </Button>
        </div>

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
      <MobileBottomNav />
    </div>
  );
};

export default Dashboard;
