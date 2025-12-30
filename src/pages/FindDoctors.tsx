import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Search, Navigation, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

type LatLng = { lat: number; lng: number };

type NearbyPlace = {
  placeId: string;
  name: string;
  rating?: number;
  userRatingsTotal?: number;
  vicinity?: string;
  location?: LatLng;
};

type PlaceDetails = {
  formattedPhoneNumber?: string;
  website?: string;
  url?: string;
};

function buildDirectionsUrl(origin: LatLng | null, destinationPlaceId: string) {
  const originParam = origin ? `&origin=${origin.lat},${origin.lng}` : "";
  return `https://www.google.com/maps/dir/?api=1${originParam}&destination_place_id=${encodeURIComponent(destinationPlaceId)}`;
}

function buildPlaceUrl(placeId: string) {
  return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(placeId)}`;
}

function formatRating(rating?: number, count?: number) {
  if (rating == null) return "No ratings";
  const countText = typeof count === "number" ? ` (${count.toLocaleString()})` : "";
  return `${rating.toFixed(1)}★${countText}`;
}

function NearbySearchController({
  center,
  query,
  onPlacesChanged,
}: {
  center: LatLng | null;
  query: string;
  onPlacesChanged: (places: NearbyPlace[]) => void;
}) {
  const map = useMap();
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!center) return;
    if (!map) return;
    if (!placesLib) return;

    const trimmed = (query || "").trim();
    if (!trimmed) {
      onPlacesChanged([]);
      return;
    }

    const service = new placesLib.PlacesService(map);

    const request: google.maps.places.PlaceSearchRequest = {
      location: new google.maps.LatLng(center.lat, center.lng),
      radius: 8000,
      keyword: trimmed,
      // This keeps results relevant without over-constraining.
      type: "doctor",
    };

    service.nearbySearch(request, (results, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
        onPlacesChanged([]);
        return;
      }

      const mapped: NearbyPlace[] = results
        .filter((r) => !!r.place_id)
        .map((r) => {
          const loc = r.geometry?.location;
          return {
            placeId: r.place_id!,
            name: r.name || "Unknown",
            rating: r.rating,
            userRatingsTotal: r.user_ratings_total,
            vicinity: r.vicinity,
            location: loc
              ? {
                  lat: typeof loc.lat === "function" ? loc.lat() : (loc as any).lat,
                  lng: typeof loc.lng === "function" ? loc.lng() : (loc as any).lng,
                }
              : undefined,
          };
        });

      onPlacesChanged(mapped);
    });
  }, [center, map, placesLib, query, onPlacesChanged]);

  return null;
}

function SelectedPlaceDetailsController({
  placeId,
  onDetailsChanged,
  onLoadingChanged,
}: {
  placeId: string | null;
  onDetailsChanged: (details: PlaceDetails | null) => void;
  onLoadingChanged: (loading: boolean) => void;
}) {
  const map = useMap();
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placeId) {
      onDetailsChanged(null);
      onLoadingChanged(false);
      return;
    }

    if (!map || !placesLib) return;

    onLoadingChanged(true);
    const service = new placesLib.PlacesService(map);
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId,
      fields: ["formatted_phone_number", "website", "url"],
    };

    service.getDetails(request, (result, status) => {
      onLoadingChanged(false);
      if (status !== google.maps.places.PlacesServiceStatus.OK || !result) {
        onDetailsChanged(null);
        return;
      }

      onDetailsChanged({
        formattedPhoneNumber: result.formatted_phone_number || undefined,
        website: (result.website as string | undefined) || undefined,
        url: (result.url as string | undefined) || undefined,
      });
    });
  }, [map, placesLib, placeId, onDetailsChanged, onLoadingChanged]);

  return null;
}

function FindDoctorsMarkers({
  places,
  selectedPlaceId,
  onSelectPlace,
}: {
  places: NearbyPlace[];
  selectedPlaceId: string | null;
  onSelectPlace: (placeId: string) => void;
}) {
  return (
    <>
      {places
        .filter((p) => !!p.location)
        .map((p) => (
          <AdvancedMarker
            key={p.placeId}
            position={p.location!}
            title={p.name}
            onClick={() => onSelectPlace(p.placeId)}
          >
            <Pin />
          </AdvancedMarker>
        ))}
    </>
  );
}

const FindDoctors = () => {
  const navigate = useNavigate();
  const locationState = useLocation();
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [activeQuery, setActiveQuery] = useState<string>("");
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState<PlaceDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const googleMapsApiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || "";

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
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location");
        }
      );
    }
  }, [locationState]);

  const handleSearch = () => {
    const query = (searchTerm || "mental health professionals").trim();
    if (!query) {
      toast.error("Enter a search term");
      return;
    }

    // If Maps API key isn't configured, fall back to opening Google Maps.
    if (!googleMapsApiKey) {
      const googleMapsUrl = coords
        ? `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${coords.lat},${coords.lng},15z`
        : `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
      window.open(googleMapsUrl, "_blank");
      return;
    }

    if (!coords) {
      toast.error("Location is required to search nearby");
      return;
    }

    setSelectedPlaceId(null);
    setSelectedPlaceDetails(null);
    setActiveQuery(query);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-24 md:pb-0">
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
            {coords && (
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
                    if (!googleMapsApiKey) {
                      const googleMapsUrl = coords
                        ? `https://www.google.com/maps/search/${encodeURIComponent(specialty)}/@${coords.lat},${coords.lng},15z`
                        : `https://www.google.com/maps/search/${encodeURIComponent(specialty)}`;
                      window.open(googleMapsUrl, "_blank");
                      return;
                    }

                    if (!coords) {
                      toast.error("Location is required to search nearby");
                      return;
                    }

                    setSelectedPlaceId(null);
                    setSelectedPlaceDetails(null);
                    setActiveQuery(specialty);
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
            {!googleMapsApiKey ? (
              <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Use Search to open Google Maps.</p>
                  <p className="text-sm text-muted-foreground">Results and directions will open in a new tab.</p>
                </div>
              </div>
            ) : (
              <APIProvider apiKey={googleMapsApiKey} libraries={["places"]}>
                <div className="space-y-4">
                  <div className="aspect-video w-full overflow-hidden rounded-lg border bg-secondary">
                    <Map
                      defaultZoom={13}
                      defaultCenter={coords ?? { lat: 37.7749, lng: -122.4194 }}
                      center={coords ?? { lat: 37.7749, lng: -122.4194 }}
                      gestureHandling="greedy"
                      disableDefaultUI
                      onClick={() => setSelectedPlaceId(null)}
                    >
                      {coords && (
                        <AdvancedMarker position={coords} title="Your location">
                          <Pin />
                        </AdvancedMarker>
                      )}
                      <FindDoctorsMarkers
                        places={places}
                        selectedPlaceId={selectedPlaceId}
                        onSelectPlace={(pid) => {
                          setSelectedPlaceId(pid);
                        }}
                      />
                      <NearbySearchController
                        center={coords}
                        query={activeQuery}
                        onPlacesChanged={(p) => {
                          setPlaces(p);
                        }}
                      />
                      <SelectedPlaceDetailsController
                        placeId={selectedPlaceId}
                        onDetailsChanged={setSelectedPlaceDetails}
                        onLoadingChanged={setLoadingDetails}
                      />
                    </Map>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-muted-foreground">
                        Showing nearby results{activeQuery ? ` for "${activeQuery}"` : ""}
                      </p>
                      {activeQuery && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const url = coords
                              ? `https://www.google.com/maps/search/${encodeURIComponent(activeQuery)}/@${coords.lat},${coords.lng},15z`
                              : `https://www.google.com/maps/search/${encodeURIComponent(activeQuery)}`;
                            window.open(url, "_blank");
                          }}
                        >
                          Open in Google Maps
                        </Button>
                      )}
                    </div>

                    {places.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Run a search to load professionals near you.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {places.slice(0, 10).map((p) => (
                          <div
                            key={p.placeId}
                            className={`rounded-lg border p-3 ${p.placeId === selectedPlaceId ? "bg-secondary" : ""}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-medium truncate">{p.name}</p>
                                <p className="text-xs text-muted-foreground">{formatRating(p.rating, p.userRatingsTotal)}</p>
                                {p.vicinity && (
                                  <p className="text-xs text-muted-foreground truncate">{p.vicinity}</p>
                                )}
                                {p.placeId === selectedPlaceId && (
                                  <div className="mt-2 space-y-1">
                                    {loadingDetails ? (
                                      <p className="text-xs text-muted-foreground">Loading contact info…</p>
                                    ) : (
                                      <>
                                        {selectedPlaceDetails?.formattedPhoneNumber && (
                                          <p className="text-xs text-muted-foreground">
                                            Phone: {selectedPlaceDetails.formattedPhoneNumber}
                                          </p>
                                        )}
                                        {selectedPlaceDetails?.website && (
                                          <p className="text-xs text-muted-foreground truncate">
                                            Website: {selectedPlaceDetails.website}
                                          </p>
                                        )}
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-shrink-0 gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedPlaceId(p.placeId);
                                    window.open(buildDirectionsUrl(coords, p.placeId), "_blank");
                                  }}
                                >
                                  Directions
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedPlaceId(p.placeId);
                                    window.open(buildPlaceUrl(p.placeId), "_blank");
                                  }}
                                >
                                  Details
                                </Button>
                                {p.placeId === selectedPlaceId && selectedPlaceDetails?.formattedPhoneNumber && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      window.open(
                                        `tel:${selectedPlaceDetails.formattedPhoneNumber.replace(/[^\d+]/g, "")}`,
                                        "_self"
                                      );
                                    }}
                                  >
                                    Call
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </APIProvider>
            )}
          </CardContent>
        </Card>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default FindDoctors;
