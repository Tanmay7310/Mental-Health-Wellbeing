import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Activity, Heart, Thermometer, ArrowLeft } from "lucide-react";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";

const VitalMonitor = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [vitals, setVitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    heartRate: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    oxygenSaturation: "",
    temperature: "",
  });

  useEffect(() => {
    if (authLoading) return;

    const token = localStorage.getItem("mindtrap_access_token");
    if (!token && !user) {
      navigate("/auth");
      return;
    }

    loadVitals();
  }, [authLoading, navigate]);

  const loadVitals = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getVitals({ page: 0, size: 10 });
      setVitals(response.content || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load vitals");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("mindtrap_access_token");
    if (!token && !user) {
      toast.error("You must be logged in");
      navigate("/auth");
      return;
    }

    if (!formData.heartRate || !formData.bloodPressureSystolic || 
        !formData.bloodPressureDiastolic || !formData.oxygenSaturation || 
        !formData.temperature) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const vitalData = {
        heartRate: parseInt(formData.heartRate),
        bloodPressureSystolic: parseInt(formData.bloodPressureSystolic),
        bloodPressureDiastolic: parseInt(formData.bloodPressureDiastolic),
        oxygenSaturation: parseFloat(formData.oxygenSaturation),
        temperature: parseFloat(formData.temperature),
      };

      await apiClient.createVital(vitalData);
      toast.success("Vital signs recorded");
      
      const heartRateHigh = vitalData.heartRate > 105;
      const bloodPressureAbnormal = vitalData.bloodPressureSystolic > 130 || vitalData.bloodPressureDiastolic < 70;
      const temperatureHigh = vitalData.temperature > 100;
      
      const conditionsMet = [heartRateHigh, bloodPressureAbnormal, temperatureHigh].filter(Boolean).length;
      
      if (conditionsMet >= 2) {
        try {
          const contacts = await apiClient.getContacts();
          
          if (contacts.length > 0) {
            const alertPromises = contacts.map(contact => 
              apiClient.sendEmergencyAlert(contact.id).catch(err => {
                console.error(`Failed to alert ${contact.name}:`, err);
              })
            );
            
            await Promise.all(alertPromises);
            
            toast.error("⚠️ CRITICAL: Multiple vital signs out of range! Opening Phone Link for emergency contacts...", {
              duration: 10000,
            });
            
            // Automatically open Phone Link for all contacts
            contacts.forEach((contact, index) => {
              setTimeout(() => {
                window.open(`tel:${contact.phone}`, '_blank');
                toast.info(`Opening Phone Link for ${contact.name} - ${contact.phone}`, {
                  duration: 3000,
                });
              }, index * 1000);
            });
          } else {
            toast.warning("⚠️ CRITICAL VITALS but no emergency contacts found. Please add emergency contacts.");
          }
        } catch (error) {
          console.error("Failed to send emergency alerts:", error);
          toast.error("Failed to alert emergency contacts");
        }
      }
      
      setFormData({
        heartRate: "",
        bloodPressureSystolic: "",
        bloodPressureDiastolic: "",
        oxygenSaturation: "",
        temperature: "",
      });
      
      loadVitals();
    } catch (error: any) {
      toast.error(error.message || "Failed to record vitals");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-24 md:pb-0">
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Record Your Vital Signs</CardTitle>
            <CardDescription>
              Enter your vital readings manually. Emergency alerts will be sent if 2+ thresholds are exceeded.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
              <p className="text-sm font-medium text-warning mb-1">⚠️ Emergency Thresholds</p>
              <p className="text-xs text-muted-foreground">
                Heart Rate &gt; 105 BPM • Blood Pressure &gt; 130/&lt;70 mmHg • Temperature &gt; 100°F
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                If 2 or more thresholds are exceeded, emergency contacts will be alerted automatically.
              </p>
            </div>
            <form onSubmit={handleSubmitVitals} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heartRate">Heart Rate (BPM) *</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="e.g., 72"
                    min="40"
                    max="200"
                    value={formData.heartRate}
                    onChange={(e) => handleInputChange("heartRate", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="systolic">Blood Pressure - Systolic (mmHg) *</Label>
                  <Input
                    id="systolic"
                    type="number"
                    placeholder="e.g., 120"
                    min="70"
                    max="200"
                    value={formData.bloodPressureSystolic}
                    onChange={(e) => handleInputChange("bloodPressureSystolic", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="diastolic">Blood Pressure - Diastolic (mmHg) *</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    placeholder="e.g., 80"
                    min="40"
                    max="130"
                    value={formData.bloodPressureDiastolic}
                    onChange={(e) => handleInputChange("bloodPressureDiastolic", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="oxygen">Oxygen Saturation (%) *</Label>
                  <Input
                    id="oxygen"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 98.5"
                    min="70"
                    max="100"
                    value={formData.oxygenSaturation}
                    onChange={(e) => handleInputChange("oxygenSaturation", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°F) *</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 98.6"
                    min="95"
                    max="105"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange("temperature", e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? "Recording..." : "Record Vital Signs"}
              </Button>
            </form>
          </CardContent>
        </Card>

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
                <div className="text-3xl font-bold">{vitals[0].heartRate}</div>
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
                  {vitals[0].bloodPressureSystolic}/{vitals[0].bloodPressureDiastolic}
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
                <div className="text-3xl font-bold">{vitals[0].oxygenSaturation}</div>
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
                No vital readings yet. Enter your vital signs above to get started.
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
                        <p className="font-medium">{vital.heartRate} BPM</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">BP</p>
                        <p className="font-medium">
                          {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">SpO2</p>
                        <p className="font-medium">{vital.oxygenSaturation}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Temp</p>
                        <p className="font-medium">{vital.temperature}°F</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="text-xs">{formatDate(vital.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default VitalMonitor;
