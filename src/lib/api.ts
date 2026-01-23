// API base URL - in production, this would come from environment
// For now, we'll use a placeholder that can be configured
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('auth-storage')
      ? JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token
      : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || 'Request failed',
      };
    }

    return {
      success: true,
      data,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Auth API endpoints
export const authAPI = {
  registerInit: async (payload: {
    first_name: string;
    last_name: string;
    email_id: string;
  }) => {
    return apiRequest('/auth/register-init', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  verifyOtp: async (payload: { email: string; otp: string }) => {
    return apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  registerComplete: async (payload: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => {
    return apiRequest('/auth/register-complete', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login: async (payload: { username: string; password: string }) => {
    return apiRequest<{ token: string; user: unknown }>('/api/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
