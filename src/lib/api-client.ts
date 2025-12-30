import { toast } from "sonner";
import { getAuthData, saveAuthData, clearAuthData } from "./auth-utils";

// Type Definitions
interface ApiError {
  message: string;
  status: number;
  error: string;
  path?: string;
  timestamp?: string;
}

interface ApiResponse<T> {
  data: T;
  error?: ApiError;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  homeAddress?: string;
  country?: string;
  pincode?: string;
  initialScreeningCompleted?: boolean;
  [key: string]: any;
}

interface LoginResponse {
  tokens: AuthTokens;
  userId: string;
  profile: UserProfile;
}

interface InitialScreeningResponse {
  result: {
    score: number;
    severity: string;
    diagnosis: string;
  };
  profile: UserProfile;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first?: boolean;
  last?: boolean;
}

interface VitalReading {
  id: string;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenSaturation: number | string;
  temperature: number | string;
  isEmergency: boolean;
  createdAt: string;
}

interface CreateVitalReadingRequest {
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenSaturation: number;
  temperature: number;
}

class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = 'http://localhost:8080/api/v1';
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { endpoint?: string } = {},
    isRetry = false
  ): Promise<T> {
    // Store the endpoint in options for potential retries
    options.endpoint = endpoint;
    const { accessToken, refreshToken, userId } = getAuthData();
    const isAuthEndpoint = endpoint.startsWith('/auth/');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth header for non-auth endpoints
    if (accessToken && !isAuthEndpoint) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else if (!isAuthEndpoint && !isRetry) {
      console.warn(`[API] Making request to ${endpoint} without token`);
      // If we don't have a token and this isn't a retry, try to refresh
      if (refreshToken) {
        const newTokens = await this.refreshToken(refreshToken);
        if (newTokens) {
          // Retry the request with the new token
          return this.request<T>(endpoint, options, true);
        }
      }
      // If we get here, we couldn't refresh the token
      this.clearAuth();
      window.location.href = '/auth';
      throw new Error('Session expired. Please log in again.');
    }

    // Handle request body serialization
    let body: BodyInit | null | undefined = options.body;
    if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof URLSearchParams)) {
      body = JSON.stringify(body);
    }

    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log(`[API] ${options.method || 'GET'} ${url}`, { body });

      let response = await fetch(url, {
        ...options,
        headers,
        body,
        credentials: 'include',
      });

      console.log(`[API] Response status: ${response.status} for ${endpoint}`);

      // Handle 401 Unauthorized responses with token refresh
      if (response.status === 401 && refreshToken && !isAuthEndpoint) {
        const newTokens = await this.refreshToken(refreshToken);
        
        if (newTokens) {
          // Update the token in the headers and retry the request
          const newHeaders = {
            ...headers,
            'Authorization': `Bearer ${newTokens.accessToken}`
          };

          response = await fetch(url, {
            ...options,
            headers: newHeaders,
            body,
            credentials: 'include',
          });

          // If retry still fails with 401, then tokens are invalid
          if (response.status === 401) {
            this.clearAuth();
            window.location.href = '/auth';
            throw new Error('Session expired. Please log in again.');
          }
        } else {
          this.clearAuth();
          window.location.href = '/auth';
          throw new Error('Failed to refresh token. Please log in again.');
        }
      }

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('[API] Request failed:', error);
      throw error;
    }
  }

  private async handleResponse<T>(
    response: Response,
    requestOptions?: RequestInit & { endpoint?: string }
  ): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json') ?? false;
    
    let data: unknown;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      console.error('[API] Error parsing response:', error);
      data = {};
    }

    if (!response.ok) {
      // Handle 401 Unauthorized with token refresh
      if (response.status === 401) {
        const { refreshToken } = getAuthData();
        if (refreshToken) {
          const newTokens = await this.refreshToken(refreshToken);
          if (newTokens && requestOptions?.endpoint) {
            // Update the token in the headers and retry the request
            const retryOptions = {
              ...requestOptions,
              headers: {
                ...requestOptions.headers,
                'Authorization': `Bearer ${newTokens.accessToken}`
              }
            };
            return this.request<T>(requestOptions.endpoint, retryOptions, true);
          }
        }
        // If we get here, token refresh failed
        this.clearAuth();
        window.location.href = '/auth';
        throw new Error('Session expired. Please log in again.');
      }
      
      const errorMessage = data && typeof data === 'object' && 'message' in data
        ? String(data.message)
        : `Request failed with status ${response.status}`;
      
      const error = new Error(errorMessage) as Error & { status?: number; data?: unknown };
      error.status = response.status;
      error.data = data;
      
      console.error(`[API] ${errorMessage}`, { status: response.status, data });
      throw error;
    }

    return data as T;
  }

  public async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      console.log('[API] Refreshing access token...');
      
      // First, check if we have a valid refresh token
      if (!refreshToken) {
        console.error('[API] No refresh token provided');
        return null;
      }

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[API] Token refresh failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        // If we get a 401, the refresh token is invalid/expired
        if (response.status === 401) {
          console.log('[API] Refresh token is invalid or expired, clearing auth data');
          this.clearAuth();
        }
        
        return null;
      }

      const data = await response.json();
      
      if (!data.accessToken) {
        console.error('[API] No access token in refresh response');
        return null;
      }

      console.log('[API] Token refresh successful');
      
      // Get current auth data
      const { userId, userProfile } = getAuthData();
      
      // Save the new tokens
      const newTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || refreshToken, // Use new refresh token if provided, otherwise keep the old one
        userId: userId || ''
      };
      
      // Save the updated auth data
      saveAuthData(newTokens, userProfile || undefined);
      
      return {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken
      };
      
    } catch (error) {
      console.error('[API] Error refreshing token:', error);
      return null;
    }
  }

  public clearAuth(): void {
    clearAuthData();
  }

  // Auth Methods
  public async register(email: string, password: string, fullName: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: { email, password, fullName },
    });

    // Store tokens after successful registration using auth-utils
    if (response?.tokens) {
      saveAuthData(
        {
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken,
          userId: response.userId
        },
        response.profile
      );
    }

    return response;
  }

  public async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    // Store tokens after successful login using auth-utils
    if (response?.tokens) {
      saveAuthData(
        {
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken,
          userId: response.userId
        },
        response.profile
      );
    }

    return response;
  }

  public async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearAuth();
      window.location.href = '/auth';
    }
  }

  // Profile Methods
  public async getProfile(): Promise<UserProfile> {
    try {
      const profile = await this.request<UserProfile>('/profiles/me');
      // Update the stored profile data
      const { accessToken, refreshToken, userId } = getAuthData();
      if (accessToken && refreshToken && userId) {
        saveAuthData({ accessToken, refreshToken, userId }, profile);
      }
      return profile;
    } catch (error) {
      console.error('[API] Failed to fetch profile:', error);
      throw error;
    }
  }

  public async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return this.request<UserProfile>('/profiles/me', {
      method: 'PUT',
      body: updates,
    });
  }

  // Assessment Methods
  public async completeInitialScreening(responses: Record<number, number>): Promise<InitialScreeningResponse> {
    // Backend endpoint for initial screening updates the profile flag:
    // POST /profiles/initial-screening  { responses: { "1": 2, "2": 0, ... } }
    // Note: JSON will stringify numeric keys as strings, which is what backend expects.
    const response = await this.request<InitialScreeningResponse>('/profiles/initial-screening', {
      method: 'POST',
      body: { responses },
    });

    // Persist updated profile (this prevents GlobalLayout from redirecting back to /initial-screening)
    const { accessToken, refreshToken, userId } = getAuthData();
    if (accessToken && refreshToken && userId && response?.profile) {
      saveAuthData({ accessToken, refreshToken, userId }, response.profile);
    }

    return response;
  }

  public async getAssessments(params?: { limit?: number; offset?: number }) {
    const query = params ? new URLSearchParams({
      ...(params.limit && { limit: params.limit.toString() }),
      ...(params.offset && { offset: params.offset.toString() }),
    }).toString() : '';

    return this.request<Array<{
      id: string;
      type: string;
      score: number;
      createdAt: string;
    }>>(`/assessments${query ? `?${query}` : ''}`);
  }

  public async getAssessment(id: string) {
    return this.request<{
      id: string;
      type: string;
      score: number;
      responses: Record<string, any>;
      createdAt: string;
    }>(`/assessments/${id}`);
  }

  public async createAssessment(data: {
    type: string;
    score: number;
    responses: Record<string, any>;
    severity?: string;
    diagnosis?: string;
  }) {
    return this.request<{ id: string }>('/assessments', {
      method: 'POST',
      body: data,
    });
  }

  // Vitals Methods
  public async getVitals(params?: { page?: number; size?: number }): Promise<PageResponse<VitalReading>> {
    const query = new URLSearchParams({
      page: String(params?.page ?? 0),
      size: String(params?.size ?? 50),
    }).toString();

    return this.request<PageResponse<VitalReading>>(`/vitals?${query}`);
  }

  public async getVital(id: string): Promise<VitalReading> {
    return this.request<VitalReading>(`/vitals/${id}`);
  }

  public async createVital(data: CreateVitalReadingRequest): Promise<VitalReading> {
    return this.request<VitalReading>('/vitals', {
      method: 'POST',
      body: data,
    });
  }

  // Contact Methods
  public async getContacts() {
    return this.request<Array<{
      id: string;
      name: string;
      phone: string;
      email: string;
      isEmergency: boolean;
    }>>('/contacts');
  }

  public async createContact(data: {
    name: string;
    phone: string;
    email: string;
    isEmergency: boolean;
  }) {
    return this.request<{ id: string }>('/contacts', {
      method: 'POST',
      body: data,
    });
  }

  public async updateContact(
    id: string,
    updates: {
      name?: string;
      phone?: string;
      email?: string;
      isEmergency?: boolean;
    }
  ) {
    return this.request<{ id: string }>(`/contacts/${id}`, {
      method: 'PATCH',
      body: updates,
    });
  }

  public async deleteContact(id: string) {
    return this.request<void>(`/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  // Emergency Methods
  public async sendEmergencyAlert(contactId: string) {
    return this.request<void>(`/contacts/${contactId}/alert`, {
      method: 'POST',
    });
  }
}

export const apiClient = ApiClient.getInstance();
