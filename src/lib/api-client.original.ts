import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${endpoint}`;
    console.log(`[API] ${options.method || 'GET'} ${url}`);

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
    } catch (error) {
      console.error("[API] Network error:", error);
      throw new Error("Network error. Please check your connection.");
    }

    // Handle 401 Unauthorized responses
    if (response.status === 401 && refreshToken) {
      try {
        const newToken = await this.refreshAccessToken(refreshToken);
        if (newToken) {
          // Retry the original request with new token
          const newHeaders = {
            ...headers,
            "Authorization": `Bearer ${newToken}`
          };
          
          const retryResponse = await fetch(url, {
            ...options,
            headers: newHeaders,
            credentials: "include",
          });
          
          if (retryResponse.ok) {
            return await this.handleResponse<T>(retryResponse);
          }
        }
      } catch (error) {
        console.error("[API] Token refresh failed:", error);
      }
      
      // If we get here, token refresh failed or the retry failed
      this.clearAuth();
      window.location.href = "/auth";
      throw new Error("Session expired. Please log in again.");
    }

    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      // Handle CORS errors
      if (response.status === 0 || response.type === "opaque") {
        const corsError: any = new Error(
          "CORS error: Backend may not be allowing requests from this origin. Check CORS configuration."
        );
        corsError.status = 0;
        corsError.statusCode = 0;
        corsError.isCorsError = true;
        throw corsError;
      }

      if (isJson) {
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch {
          // If JSON parsing fails, create a basic error
          errorData = {
            timestamp: new Date().toISOString(),
            status: response.status,
            error: "Error",
            message: `HTTP ${response.status} error`,
            path: ""
          };
        }
        const errorMessage = errorData.message || errorData.error || "An error occurred";
        // Include status code in error for better handling
        const enhancedError: any = new Error(errorMessage);
        enhancedError.status = response.status;
        enhancedError.statusCode = response.status;
        enhancedError.originalError = errorData;
        throw enhancedError;
      }
      const error: any = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.statusCode = response.status;
      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    if (isJson) {
      return response.json();
    }

    return response.text() as T;
  }

  private clearAuth(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
  }

  private async refreshAccessToken(refreshToken: string): Promise<string | null> {
    console.log('[API] Starting token refresh...');
    if (!refreshToken) {
      console.error('[API] No refresh token available');
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.error('[API] Token refresh failed with status:', response.status);
        return null;
      }

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        return data.accessToken;
      }
      return null;
    } catch (error) {
      console.error('[API] Error during token refresh:', error);
      return null;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request<{
      userId: string;
      profile: any;
      tokens: { accessToken: string; refreshToken: string; expiresIn: number };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("accessToken", response.tokens.accessToken);
    localStorage.setItem("refreshToken", response.tokens.refreshToken);
    localStorage.setItem("userId", response.userId);
    return response;
  }

  async register(email: string, password: string, fullName: string) {
    const response = await this.request<{
      userId: string;
      profile: any;
      tokens: { accessToken: string; refreshToken: string };
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, fullName }),
    });

    localStorage.setItem("accessToken", response.tokens.accessToken);
    localStorage.setItem("refreshToken", response.tokens.refreshToken);
    localStorage.setItem("userId", response.userId);
    return response;
  }

  async logout() {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearAuth();
    }
  }

  // Profile methods
  async getProfile() {
    return this.request<any>("/users/me");
  }

  async updateProfile(profileData: any) {
    return this.request("/users/me", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
  }

  // Assessment methods
  async submitAssessment(assessmentData: any) {
    return this.request("/assessments", {
      method: "POST",
      body: JSON.stringify(assessmentData),
    });
  }

  async getAssessments() {
    return this.request("/assessments");
  }

  // Other API methods...
}

export const apiClient = new ApiClient(API_BASE_URL);
