import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MapPin, Phone, User, Users } from "lucide-react";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.get("fullName") as string,
          phone: formData.get("phone") as string,
          home_address: formData.get("address") as string,
          country: formData.get("country") as string,
          pincode: formData.get("pincode") as string,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Add emergency contacts
      const contacts = [
        {
          user_id: user.id,
          name: formData.get("contact1Name") as string,
          phone: formData.get("contact1Phone") as string,
          relationship: formData.get("contact1Relation") as string,
        },
        {
          user_id: user.id,
          name: formData.get("contact2Name") as string,
          phone: formData.get("contact2Phone") as string,
          relationship: formData.get("contact2Relation") as string,
        },
      ];

      const { error: contactsError } = await supabase
        .from("emergency_contacts")
        .insert(contacts);

      if (contactsError) throw contactsError;

      toast.success("Profile completed successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    }
    setIsLoading(false);
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
                    defaultValue={user?.user_metadata?.full_name || ""}
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
