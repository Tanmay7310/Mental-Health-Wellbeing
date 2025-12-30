import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { 
  saveAuthData, 
  getAuthData, 
  clearAuthData, 
  type UserProfile as AuthUserProfile,
  type AuthTokens
} from '@/lib/auth-utils';

// Extend the base UserProfile type to include our custom fields
export interface UserProfile extends AuthUserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  homeAddress?: string;
  country?: string;
  pincode?: string;
  initialScreeningCompleted?: boolean;
  [key: string]: any; // Allow additional properties
}

export interface User {
  id: string;
  email: string;
  profile: UserProfile;
}

export function useAuth() {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const syncFromStorage = useCallback(() => {
    const authData = getAuthData();

    if (authData?.accessToken && authData?.userProfile && authData?.userId) {
      setUser({
        id: authData.userId,
        email: authData.userProfile.email || '',
        profile: authData.userProfile as UserProfile,
      });
    } else {
      setUser(null);
    }
  }, []);
  
  // Clear authentication state
  const clearAuthState = useCallback(() => {
    console.log('[Auth] Clearing auth state');
    setUser(null);
    clearAuthData();
    apiClient.clearAuth();
    setLoading(false);
    
    // Navigate to auth page if not already there
    const currentPath = window.location.pathname;
    const isAuthPage = currentPath === '/auth' || currentPath.startsWith('/auth/');
    
    if (!isAuthPage) {
      window.location.href = '/auth';
    }
  }, [navigate]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Clear any existing auth data
      clearAuthData();
      
      // Make the login request
      const response = await apiClient.login(email, password);
      const { tokens, userId, profile } = response;
      
      if (!profile) {
        throw new Error('No profile data received during login');
      }
      
      // Ensure profile has required fields
      const completeProfile: UserProfile = {
        ...profile,
        id: userId,
        email: profile.email || email,
        fullName: profile.fullName || '',
        initialScreeningCompleted: profile.initialScreeningCompleted || false,
        homeAddress: profile.homeAddress || ''
      };
      
      // Save tokens and profile to localStorage
      saveAuthData(
        {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          userId
        },
        completeProfile
      );
      
      // Update the user state
      const userData = {
        id: userId,
        email: completeProfile.email,
        profile: completeProfile
      };
      
      setUser(userData);
      
      // Return the user data
      return {
        tokens,
        userId,
        profile: completeProfile,
        user: userData
      };
    } catch (error: any) {
      console.error('[Auth] Login error:', error);
      clearAuthState();
      
      // Show appropriate error message
      if (error.isNetworkError || error.isCorsError || error.statusCode === 0) {
        toast.error("Cannot connect to the server. Please check your internet connection and try again.");
      } else if (error.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearAuthState]);

  // Register function
  const register = useCallback(async (email: string, password: string, fullName: string) => {
    setLoading(true);
    
    try {
      // Clear any existing auth data
      clearAuthData();
      
      // Make the registration request
      const response = await apiClient.register(email, password, fullName);

      const tokens = response?.tokens;
      const userId = response?.userId;
      const profile = response?.profile;

      // If backend returns tokens/profile (it does), treat registration as authenticated
      if (tokens?.accessToken && tokens?.refreshToken && userId && profile) {
        const completeProfile: UserProfile = {
          ...profile,
          id: userId,
          email: profile.email || email,
          fullName: profile.fullName || fullName || '',
          initialScreeningCompleted: profile.initialScreeningCompleted || false,
          homeAddress: profile.homeAddress || ''
        };

        saveAuthData(
          {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            userId
          },
          completeProfile
        );

        const userData: User = {
          id: userId,
          email: completeProfile.email,
          profile: completeProfile
        };
        setUser(userData);

        return {
          tokens,
          userId,
          profile: completeProfile,
          user: userData
        };
      }
      
      return response;
    } catch (error: any) {
      console.error('[Auth] Registration error:', error);
      
      // Show appropriate error message
      if (error.isNetworkError || error.isCorsError || error.statusCode === 0) {
        toast.error("Cannot connect to the server. Please check your internet connection and try again.");
      } else if (error.status === 409) {
        toast.error("An account with this email already exists. Please use a different email or sign in.");
      } else {
        toast.error(error.message || "Registration failed. Please try again.");
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [login]);

  // Refresh profile function
  const refreshProfile = useCallback(async () => {
    try {
      const profile = await apiClient.getProfile();
      
      if (!profile) {
        throw new Error('Failed to fetch profile');
      }
      
      // Update localStorage
      const authData = getAuthData();
      if (authData) {
        saveAuthData(
          {
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken,
            userId: authData.userId
          },
          profile
        );
      }
      
      // Update user state
      setUser(prevUser => prevUser ? {
        ...prevUser,
        profile: profile as UserProfile
      } : null);
      
      return profile;
    } catch (error) {
      console.error('[Auth] Error refreshing profile:', error);
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      // Try to call the logout API if we have a token
      const { accessToken } = getAuthData();
      if (accessToken) {
        try {
          await apiClient.logout();
        } catch (error) {
          console.error('[Auth] Logout API error:', error);
          // Continue with client-side cleanup
        }
      }
      
      // Clear auth state
      clearAuthState();
      
      toast.success('You have been signed out');
      
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      clearAuthState(); // Ensure we clear state even on error
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearAuthState]);

  // Initialize auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        syncFromStorage();
      } catch (error) {
        console.error('[Auth] Error initializing auth state:', error);
        syncFromStorage();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [syncFromStorage]);

  // Keep multiple useAuth() instances in sync (GlobalLayout, Dashboard, GlobalLogout, etc.)
  useEffect(() => {
    const handler = () => {
      syncFromStorage();
    };

    window.addEventListener('mindtrap-auth-changed', handler);
    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('mindtrap-auth-changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, [syncFromStorage]);
  
  // Memoize the auth state to prevent unnecessary re-renders
  const authState = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshProfile,
    refreshToken: apiClient.refreshToken,
    clearAuth: clearAuthState,
  }), [user, loading, login, register, logout, refreshProfile, clearAuthState]);

  return authState;
}
