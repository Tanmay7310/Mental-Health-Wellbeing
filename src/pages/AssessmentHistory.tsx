import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";

type AssessmentListItem = {
  id: string;
  type: string;
  score: number;
  createdAt: string;
};

const AssessmentHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AssessmentListItem[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getAssessments({ limit: 50, offset: 0 });
        setItems(Array.isArray(data) ? data : []);
      } catch (error: any) {
        toast.error(error?.message || "Failed to load assessment history");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-24 md:pb-0">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Assessment History</h1>
            <p className="text-muted-foreground">Your recent mental health assessments</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
            <CardDescription>Most recent first</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : items.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No assessments found yet. Take an assessment from the Dashboard.
              </p>
            ) : (
              <div className="space-y-3">
                {items.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between gap-4 p-4 border rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{a.type}</p>
                      <p className="text-sm text-muted-foreground">Score: {a.score}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/assessment-results", { state: { assessmentId: a.id } })}
                    >
                      View
                    </Button>
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

export default AssessmentHistory;
