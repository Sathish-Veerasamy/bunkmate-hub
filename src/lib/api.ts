// ============================================
// API CONFIGURATION
// ============================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_PREFIX = '/api/v3';

// ============================================
// TYPES
// ============================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

// ============================================
// CORE API REQUEST FUNCTION
// ============================================
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { params?: Record<string, string | number | boolean> } = {}
): Promise<ApiResponse<T>> {
  try {
    let url = `${API_BASE_URL}${API_PREFIX}${endpoint}`;

    if (options.params) {
      const queryString = new URLSearchParams(
        Object.entries(options.params).map(([k, v]) => [k, String(v)])
      ).toString();
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Always include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => null);

    // 🔐 AUTH FAILURE HANDLING
    if (response.status === 401 || response.status === 403) {
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return {
        success: false,
        error: 'Authentication failed. Please login again.',
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data?.message || data?.error || `Request failed (${response.status})`,
      };
    }

    return {
      success: true,
      data,
      message: data?.message,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error',
    };
  }
}

// ============================================
// HTTP HELPERS
// ============================================
async function get<T>(endpoint: string, options?: RequestOptions) {
  return apiRequest<T>(endpoint, { method: 'GET', ...options });
}

async function post<T>(endpoint: string, payload?: unknown, options?: RequestOptions) {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: payload ? JSON.stringify(payload) : undefined,
    ...options,
  });
}

async function put<T>(endpoint: string, payload?: unknown, options?: RequestOptions) {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: payload ? JSON.stringify(payload) : undefined,
    ...options,
  });
}

async function patch<T>(endpoint: string, payload?: unknown, options?: RequestOptions) {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: payload ? JSON.stringify(payload) : undefined,
    ...options,
  });
}

async function del<T>(endpoint: string, payload?: unknown, options?: RequestOptions) {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
    body: payload ? JSON.stringify(payload) : undefined,
    ...options,
  });
}

// ============================================
// EXPORTED API
// ============================================
export const api = {
  get,
  post,
  put,
  patch,
  del,
  request: apiRequest,
};

// ============================================
// AUTH APIs
// ============================================
export const authAPI = {
  registerInit: (payload: {
    first_name: string;
    last_name: string;
    email_id: string;
  }) => api.post('/auth/register-init', payload),

  verifyOtp: (payload: { email_id: string; otp: string }) =>
    api.post('/auth/verify-otp', payload),

  completeRegister: (payload: {
    email_id: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => api.post('/auth/complete-register', payload),

  // Login — JWT stored in HTTP-only cookie by backend
  login: (payload: { username: string; password: string }) =>
    api.post<any>('/auth/login', payload),

  // Clears HTTP-only cookies server-side
  logout: () => api.post('/auth/logout'),

  // Refresh access token via cookie
  refresh: () => api.post('/auth/refresh'),
};

// ============================================
// ORG / TENANT APIs
// ============================================
export const orgAPI = {
  // Body: { tenantId } — matches backend spec exactly
  selectTenant: (tenantId: string | number) =>
    api.post<any>('/auth/select-tenant', { tenantId }),

  createOrg: (payload: {
    orgName: string;
    orgType?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  }) => api.post('/auth/org/create', payload),
};

// ============================================
// MODULES API
// ============================================
export const modulesAPI = {
  getModules: () => api.get<any[]>('/modules'),
};
