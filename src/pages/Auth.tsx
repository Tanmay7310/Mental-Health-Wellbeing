import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from "lucide-react";
import { toast } from "sonner";

// Define the user profile type
type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  homeAddress?: string;
  country?: string;
  pincode?: string;
  initialScreeningCompleted?: boolean;
  [key: string]: any; // Allow additional properties
};

const Auth = () => {
  const navigate = useNavigate();
  const { login, register, user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Only redirect if we come back to /auth after being logged in elsewhere
  useEffect(() => {
    // If user just logged in and we're redirecting from the login form, don't run this check
    if (isLoading) {
      return;
    }

    // Check if we have valid auth tokens
    const token = localStorage.getItem("mindtrap_access_token");
    const userProfile = localStorage.getItem("mindtrap_user_profile");
    
    // If we somehow landed on /auth but have valid auth data, redirect appropriately
    if (token && userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        let targetPath = '/dashboard';
        
        if (profile.initialScreeningCompleted === false) {
          targetPath = '/initial-screening';
        } else if (!profile.homeAddress) {
          targetPath = '/complete-profile';
        }
        
        // Only redirect if we're on the auth page
        if (window.location.pathname === '/auth') {
          console.log('Already authenticated, redirecting to:', targetPath);
          navigate(targetPath, { replace: true });
        }
      } catch (e) {
        console.error('Error parsing profile:', e);
      }
    }
  }, [isLoading, navigate]);

  // Handle sign in form submission
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await login(email, password);
      setIsLoading(false);
      
      // After successful login, determine redirect path
      let targetPath = '/dashboard';
      
      if (response?.profile) {
        if (response.profile.initialScreeningCompleted === false) {
          targetPath = '/initial-screening';
        } else if (!response.profile.homeAddress) {
          targetPath = '/complete-profile';
        }
      }
      
      // Use window.location for clean redirect
      console.log('Login successful, redirecting to:', targetPath);
      window.location.href = targetPath;
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Clear any invalid auth data
      clearAuthData();
      
      // Show appropriate error message
      if (error.isNetworkError || error.isCorsError || error.statusCode === 0) {
        toast.error("Cannot connect to the server. Please check your internet connection and try again.");
      } else if (error.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
      
      setIsLoading(false);
    }
  };

  // Handle sign up form submission
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    try {
      await register(email, password, fullName);
      // The register function will handle the redirection
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-2">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Mental Health Companion</CardTitle>
          <CardDescription>Your journey to better mental wellness starts here</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      className="text-sm font-medium text-primary hover:underline"
                      onClick={() => {
                        toast.info("Please contact support to reset your password.");
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    required
                    minLength={8}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
