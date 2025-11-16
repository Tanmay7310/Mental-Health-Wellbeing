import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Search, Navigation, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const FindDoctors = () => {
  const navigate = useNavigate();
  const locationState = useLocation();
  const [location, setLocation] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [diagnosis, setDiagnosis] = useState<string>("");

  useEffect(() => {
    // Check if redirected from assessment results
    const state = locationState.state as { searchTerm?: string; diagnosis?: string };
    if (state?.searchTerm) {
      setSearchTerm(state.searchTerm);
    }
    if (state?.diagnosis) {
      setDiagnosis(state.diagnosis);
    }

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location");
        }
      );
    }
  }, [locationState]);

  const handleSearch = () => {
    // In a real app, this would search for nearby mental health professionals
    const query = searchTerm || "mental health professionals near me";
    const googleMapsUrl = location
      ? `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${location},15z`
      : `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    
    window.open(googleMapsUrl, "_blank");
  };

  const specialties = [
    "Psychiatrist",
    "Psychologist",
    "Therapist",
    "Counselor",
    "Mental Health Clinic",
    "Crisis Center",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Find Mental Health Professionals</h1>
            <p className="text-muted-foreground">Locate nearby doctors and therapists</p>
          </div>
        </div>

        {diagnosis && (
          <Card className="mb-6 border-2 border-primary">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">Based on your assessment</p>
                  <p className="text-sm text-muted-foreground">{diagnosis}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search for Professionals</CardTitle>
            <CardDescription>
              Find mental health professionals near your location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search for psychiatrist, therapist, etc."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
            {location && (
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Navigation className="w-3 h-3" />
                Using your current location
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Search Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Search</CardTitle>
            <CardDescription>Search by specialty</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {specialties.map((specialty, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    setSearchTerm(specialty);
                    const googleMapsUrl = location
                      ? `https://www.google.com/maps/search/${encodeURIComponent(specialty)}/@${location},15z`
                      : `https://www.google.com/maps/search/${encodeURIComponent(specialty)}`;
                    window.open(googleMapsUrl, "_blank");
                  }}
                >
                  {specialty}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map Embed Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Map View</CardTitle>
            <CardDescription>
              Mental health professionals in your area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Click "Search" to open Google Maps
                </p>
                <p className="text-sm text-muted-foreground">
                  Google Maps will show nearby mental health professionals with directions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-info/50 bg-info/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> In a full implementation with Google Maps API integration, 
              the map would be embedded here showing nearby professionals with ratings, contact info, 
              and turn-by-turn directions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FindDoctors;
