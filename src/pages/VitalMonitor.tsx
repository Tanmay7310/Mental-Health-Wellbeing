import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Activity, Heart, Thermometer, ArrowLeft, AlertTriangle } from "lucide-react";

const VitalMonitor = () => {
  const navigate = useNavigate();
  const [vitals, setVitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVitals();
  }, []);

  const loadVitals = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("vital_readings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      toast.error("Failed to load vitals");
    } else {
      setVitals(data || []);
    }
    setLoading(false);
  };

  const handleSimulateReading = async () => {
    // Simulate adding a vital reading
    const { data: { user } } = await supabase.auth.getUser();
    
    const mockVital = {
      user_id: user!.id,
      heart_rate: Math.floor(Math.random() * (100 - 60) + 60),
      blood_pressure_systolic: Math.floor(Math.random() * (140 - 110) + 110),
      blood_pressure_diastolic: Math.floor(Math.random() * (90 - 70) + 70),
      oxygen_saturation: parseFloat((Math.random() * (100 - 95) + 95).toFixed(2)),
      temperature: parseFloat((Math.random() * (99 - 97) + 97).toFixed(2)),
      is_emergency: false,
    };

    const { error } = await supabase.from("vital_readings").insert(mockVital);

    if (error) {
      toast.error("Failed to record vitals");
    } else {
      toast.success("Vital signs recorded");
      loadVitals();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Vital Signs Monitor</h1>
            <p className="text-muted-foreground">Track your health vitals</p>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mb-6 border-info/50 bg-info/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-info" />
              <CardTitle className="text-info">Sensor Integration</CardTitle>
            </div>
            <CardDescription>
              In a full implementation, this would connect to wearable health sensors. 
              For now, you can simulate readings for testing purposes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSimulateReading}>
              Simulate Vital Reading
            </Button>
          </CardContent>
        </Card>

        {/* Latest Reading */}
        {vitals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  Heart Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{vitals[0].heart_rate}</div>
                <p className="text-xs text-muted-foreground">BPM</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Blood Pressure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {vitals[0].blood_pressure_systolic}/{vitals[0].blood_pressure_diastolic}
                </div>
                <p className="text-xs text-muted-foreground">mmHg</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-500" />
                  Oxygen Saturation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{vitals[0].oxygen_saturation}</div>
                <p className="text-xs text-muted-foreground">%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{vitals[0].temperature}</div>
                <p className="text-xs text-muted-foreground">°F</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle>Reading History</CardTitle>
            <CardDescription>Your recent vital sign measurements</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : vitals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No vital readings yet. Click "Simulate Vital Reading" to add one.
              </p>
            ) : (
              <div className="space-y-4">
                {vitals.map((vital) => (
                  <div
                    key={vital.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1">
                      <div>
                        <p className="text-xs text-muted-foreground">Heart Rate</p>
                        <p className="font-medium">{vital.heart_rate} BPM</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">BP</p>
                        <p className="font-medium">
                          {vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">SpO2</p>
                        <p className="font-medium">{vital.oxygen_saturation}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Temp</p>
                        <p className="font-medium">{vital.temperature}°F</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="text-xs">{formatDate(vital.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VitalMonitor;
