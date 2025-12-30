import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GlobalLayout from "@/components/GlobalLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import InitialScreening from "./pages/InitialScreening";
import CompleteProfile from "./pages/CompleteProfile";
import Dashboard from "./pages/Dashboard";
import Emergency from "./pages/Emergency";
import VitalMonitor from "./pages/VitalMonitor";
import FindDoctors from "./pages/FindDoctors";
import AssessmentPHQ9 from "./pages/AssessmentPHQ9";
import AssessmentGAD7 from "./pages/AssessmentGAD7";
import AssessmentMoodDisorder from "./pages/AssessmentMoodDisorder";
import AssessmentPCL5 from "./pages/AssessmentPCL5";
import AssessmentOCD from "./pages/AssessmentOCD";
import AssessmentASRS from "./pages/AssessmentASRS";
import AssessmentResults from "./pages/AssessmentResults";
import AssessmentHistory from "./pages/AssessmentHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create a router with future flags
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <GlobalLayout />,
      children: [
        { index: true, element: <Index /> },
        { path: "auth", element: <Auth /> },
        { path: "initial-screening", element: <InitialScreening /> },
        { path: "complete-profile", element: <CompleteProfile /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "emergency", element: <Emergency /> },
        { path: "vital-monitor", element: <VitalMonitor /> },
        { path: "find-doctors", element: <FindDoctors /> },
        { path: "assessment/phq9", element: <AssessmentPHQ9 /> },
        { path: "assessment/gad7", element: <AssessmentGAD7 /> },
        { path: "assessment/mood-disorder", element: <AssessmentMoodDisorder /> },
        { path: "assessment/pcl5", element: <AssessmentPCL5 /> },
        { path: "assessment/ocd", element: <AssessmentOCD /> },
        { path: "assessment/asrs", element: <AssessmentASRS /> },
        { path: "assessment-results", element: <AssessmentResults /> },
        { path: "history", element: <AssessmentHistory /> },
        { path: "*", element: <NotFound /> }
      ]
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
