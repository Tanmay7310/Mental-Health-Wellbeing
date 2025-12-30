import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MapPin, Phone, User, Users } from "lucide-react";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (authLoading) return;
      
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        const profileData = await apiClient.getProfile();

        const state = location.state as any;
        const returnTo = state?.returnTo as string | undefined;
        const returnState = state?.returnState;
        
        if (!profileData.initialScreeningCompleted) {
          toast.error("Please complete the initial screening first");
          navigate("/initial-screening");
          return;
        }

        if (profileData.homeAddress) {
          // Profile already complete; if we were routed here as an onboarding gate,
          // return to the original destination (e.g. assessment results).
          if (returnTo && returnTo !== "/complete-profile") {
            navigate(returnTo, { state: returnState, replace: true });
          } else {
            navigate("/dashboard");
          }
          return;
        }

        setProfile(profileData);
      } catch (error: any) {
        toast.error(error.message || "Failed to load profile");
        if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
          navigate("/auth");
        }
      }
    };

    loadProfile();
  }, [user, authLoading, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      // Update profile
      await apiClient.updateProfile({
        phone: formData.get("phone") as string,
        homeAddress: formData.get("address") as string,
        country: formData.get("country") as string,
        pincode: formData.get("pincode") as string,
      });

      // Add emergency contacts
      await Promise.all([
        apiClient.createContact({
          name: formData.get("contact1Name") as string,
          phone: formData.get("contact1Phone") as string,
          relationship: formData.get("contact1Relation") as string,
        }),
        apiClient.createContact({
          name: formData.get("contact2Name") as string,
          phone: formData.get("contact2Phone") as string,
          relationship: formData.get("contact2Relation") as string,
        }),
      ]);

      toast.success("Profile completed successfully!");

      // Refresh profile in auth state so GlobalLayout knows profile is complete
      try {
        await refreshProfile();
      } catch (refreshError) {
        // Don't fail the whole flow if refresh fails - the profile was saved successfully
      }

      const state = location.state as any;
      const returnTo = state?.returnTo as string | undefined;
      const returnState = state?.returnState;

      if (returnTo && returnTo !== "/complete-profile") {
        navigate(returnTo, { state: returnState, replace: true });
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to complete profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            We need some additional information to help you better
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <User className="w-4 h-4" />
                Personal Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    defaultValue={profile?.fullName || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <MapPin className="w-4 h-4" />
                Address Information
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Home Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Street, City, State"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      defaultValue="India"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      placeholder="XXXXXX"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Users className="w-4 h-4" />
                Emergency Contacts
              </div>
              <div className="space-y-4 p-4 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  India Emergency Ambulance (102) is added by default and cannot be removed
                </p>
              </div>
              
              {/* Contact 1 */}
              <div className="space-y-2">
                <Label className="text-sm">Emergency Contact 1 *</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input name="contact1Name" placeholder="Name" required />
                  <Input name="contact1Phone" type="tel" placeholder="Phone" required />
                  <Input name="contact1Relation" placeholder="Relationship" required />
                </div>
              </div>

              {/* Contact 2 */}
              <div className="space-y-2">
                <Label className="text-sm">Emergency Contact 2 *</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input name="contact2Name" placeholder="Name" required />
                  <Input name="contact2Phone" type="tel" placeholder="Phone" required />
                  <Input name="contact2Relation" placeholder="Relationship" required />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Saving..." : "Complete Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteProfile;
