export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  homeAddress?: string;
  country?: string;
  pincode?: string;
  initialScreeningCompleted?: boolean;
  [key: string]: any; // For any additional properties
}

export const AUTH_KEYS = {
  ACCESS_TOKEN: 'mindtrap_access_token',
  REFRESH_TOKEN: 'mindtrap_refresh_token',
  USER_ID: 'mindtrap_user_id',
  USER_PROFILE: 'mindtrap_user_profile'
};

const emitAuthChanged = () => {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('mindtrap-auth-changed'));
    }
  } catch {
    // no-op
  }
};

export const saveAuthData = (tokens: AuthTokens, profile: UserProfile) => {
  try {
    localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    localStorage.setItem(AUTH_KEYS.USER_ID, tokens.userId);
    localStorage.setItem(AUTH_KEYS.USER_PROFILE, JSON.stringify(profile));
    emitAuthChanged();
    return true;
  } catch (error) {
    console.error('Error saving auth data:', error);
    return false;
  }
};

export const getAuthData = (): {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  userProfile: UserProfile | null;
} => {
  try {
    const accessToken = localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
    const userId = localStorage.getItem(AUTH_KEYS.USER_ID);
    const profileStr = localStorage.getItem(AUTH_KEYS.USER_PROFILE);
    
    let userProfile = null;
    if (profileStr) {
      try {
        userProfile = JSON.parse(profileStr);
      } catch (e) {
        console.error('Error parsing user profile:', e);
        localStorage.removeItem(AUTH_KEYS.USER_PROFILE);
      }
    }
    
    return { accessToken, refreshToken, userId, userProfile };
  } catch (error) {
    console.error('Error getting auth data:', error);
    return { accessToken: null, refreshToken: null, userId: null, userProfile: null };
  }
};

export const clearAuthData = () => {
  try {
    localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_KEYS.USER_ID);
    localStorage.removeItem(AUTH_KEYS.USER_PROFILE);
    emitAuthChanged();
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};

export const isAuthenticated = (): boolean => {
  const { accessToken, refreshToken, userId } = getAuthData();
  return !!(accessToken && refreshToken && userId);
};
