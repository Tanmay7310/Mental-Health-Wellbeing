import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Phone, Plus, Trash2, ArrowLeft, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";

const Emergency = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    const token = localStorage.getItem("mindtrap_access_token");
    if (!token && !user) {
      navigate("/auth");
      return;
    }

    loadContacts();
  }, [authLoading, navigate]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getContacts();
      setContacts(data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAdding(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      await apiClient.createContact({
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        relationship: formData.get("relationship") as string,
      });
      toast.success("Contact added successfully");
      loadContacts();
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to add contact");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteContact = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      toast.error("Cannot delete default emergency contact");
      return;
    }

    try {
      await apiClient.deleteContact(id);
      toast.success("Contact deleted");
      loadContacts();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete contact");
    }
  };

  const handleEmergencyCall = async (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      try {
        await apiClient.sendEmergencyAlert(contactId);
        toast.success(`Emergency alert sent to ${contact.name}`);
        window.location.href = `tel:${contact.phone}`;
      } catch (error: any) {
        toast.error(error.message || "Failed to send alert");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-24 md:pb-0">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
            <Phone className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Emergency Contacts</h1>
            <p className="text-muted-foreground">Manage your emergency contact list</p>
          </div>
        </div>

        {/* Emergency Alert Card */}
        <Card className="mb-6 border-destructive/50 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <CardTitle className="text-destructive">Emergency Alert</CardTitle>
            </div>
            <CardDescription>
              In case of emergency, these contacts will be notified with your location
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Add Contact Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" placeholder="Contact name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Input id="relationship" name="relationship" placeholder="e.g., Parent, Doctor" required />
                </div>
              </div>
              <Button type="submit" disabled={isAdding}>
                {isAdding ? "Adding..." : "Add Contact"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contacts List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Emergency Contacts</h2>
          {loading ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Loading contacts...
              </CardContent>
            </Card>
          ) : contacts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No emergency contacts yet. Add your first contact above.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map((contact) => (
                <Card key={contact.id} className={contact.is_default ? "border-primary" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{contact.name}</CardTitle>
                        <CardDescription>{contact.relationship}</CardDescription>
                        {contact.is_default && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full mt-2 inline-block">
                            Default
                          </span>
                        )}
                      </div>
                      {!contact.is_default && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteContact(contact.id, contact.is_default)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{contact.phone}</span>
                    </div>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => handleEmergencyCall(contact.id)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default Emergency;
