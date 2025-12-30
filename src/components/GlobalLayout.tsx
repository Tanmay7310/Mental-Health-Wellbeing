import { Outlet, useLocation, Navigate } from "react-router-dom";
import GlobalLogout from "./GlobalLogout";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getAuthData } from "@/lib/auth-utils";

const GlobalLayout = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Set initialized to true after first render
    setIsInitialized(true);
  }, []);

  // Show loading spinner while checking auth state
  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated and not on auth page, redirect to login
  if (!isAuthenticated) {
    // Allow public landing + auth page
    if (location.pathname === '/' || location.pathname === '/auth') {
      return (
        <>
          <main>
            <Outlet />
          </main>
        </>
      );
    }

    console.log('[GlobalLayout] Not authenticated, redirecting to /auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Authenticated routing gates
  const authData = getAuthData();
  const userProfile = authData?.userProfile;

  // If authenticated and on auth page, send to the right next step
  if (location.pathname === '/auth') {
    if (userProfile?.initialScreeningCompleted === false) {
      console.log('[GlobalLayout] Redirecting to initial-screening');
      return <Navigate to="/initial-screening" replace />;
    }
    if (userProfile && !userProfile.homeAddress) {
      console.log('[GlobalLayout] Redirecting to complete-profile');
      return <Navigate to="/complete-profile" replace />;
    }
    console.log('[GlobalLayout] Redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // If profile indicates onboarding not complete, enforce it everywhere
  if (userProfile?.initialScreeningCompleted === false && location.pathname !== '/initial-screening') {
    console.log('[GlobalLayout] Onboarding gate: initial-screening');
    return <Navigate to="/initial-screening" replace />;
  }

  if (userProfile && userProfile.initialScreeningCompleted !== false && !userProfile.homeAddress && location.pathname !== '/complete-profile') {
    console.log('[GlobalLayout] Onboarding gate: complete-profile');
    console.log('[GlobalLayout] Current location:', location.pathname);
    console.log('[GlobalLayout] Current state to preserve:', location.state);
    return (
      <Navigate
        to="/complete-profile"
        replace
        state={{ returnTo: location.pathname, returnState: location.state }}
      />
    );
  }

  // If user is logged in and on landing page, take them to dashboard
  if (location.pathname === '/') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <GlobalLogout />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default GlobalLayout;
