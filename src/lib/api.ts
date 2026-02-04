import { supabase } from "@/integrations/supabase/client";

// ============================================
// TYPES
// ============================================
interface ApiResponse<T = unknown> {
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
// CORE API REQUEST FUNCTION (via Edge Function Proxy)
// ============================================
async function apiRequest<T>(
  endpoint: string,
  options: { method?: string; body?: unknown; params?: Record<string, string | number | boolean> } = {}
): Promise<ApiResponse<T>> {
  try {
    // Get token from auth storage
    const token = localStorage.getItem('auth-storage')
      ? JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token
      : null;

    // Build endpoint with query params if provided
    let finalEndpoint = endpoint;
    if (options.params) {
      const queryString = new URLSearchParams(
        Object.entries(options.params).map(([key, value]) => [key, String(value)])
      ).toString();
      finalEndpoint += `?${queryString}`;
    }

    // Call the edge function proxy
    const { data, error } = await supabase.functions.invoke('api-proxy', {
      body: {
        endpoint: finalEndpoint,
        method: options.method || 'GET',
        body: options.body,
        token,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Request failed',
      };
    }

    // Check if the response indicates an error
    if (data && data.success === false) {
      return {
        success: false,
        error: data.error || data.message || 'Request failed',
      };
    }

    return {
      success: true,
      data,
      message: data?.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ============================================
// HTTP METHOD HELPERS
// ============================================

/**
 * GET request
 * @example
 * const result = await api.get<User[]>('/users');
 * const result = await api.get<User>('/users/1');
 * const result = await api.get<User[]>('/users', { params: { page: 1, limit: 10 } });
 */
async function get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'GET',
    ...options,
  });
}

/**
 * POST request
 * @example
 * const result = await api.post<User>('/users', { name: 'John', email: 'john@example.com' });
 */
async function post<T>(endpoint: string, payload?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: payload,
    ...options,
  });
}

/**
 * PUT request
 * @example
 * const result = await api.put<User>('/users/1', { name: 'John Updated' });
 */
async function put<T>(endpoint: string, payload?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: payload,
    ...options,
  });
}

/**
 * PATCH request
 * @example
 * const result = await api.patch<User>('/users/1', { name: 'John Updated' });
 */
async function patch<T>(endpoint: string, payload?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: payload,
    ...options,
  });
}

/**
 * DELETE request
 * @example
 * const result = await api.del('/users/1');
 * const result = await api.del('/users/1', { reason: 'inactive' });
 */
async function del<T>(endpoint: string, payload?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
    body: payload,
    ...options,
  });
}

// ============================================
// EXPORTED API OBJECT
// ============================================
export const api = {
  get,
  post,
  put,
  patch,
  del,
  request: apiRequest, // For custom requests
};

// ============================================
// AUTH API ENDPOINTS
// ============================================
export const authAPI = {
  // Step 1: Initialize registration and send OTP
  registerInit: (payload: { first_name: string; last_name: string; email_id: string }) =>
    api.post('/auth/register-init', payload),

  // Step 2: Verify OTP
  verifyOtp: (payload: { email_id: string; otp: string }) =>
    api.post('/auth/verify-otp', payload),

  // Step 3: Complete registration with password
  completeRegister: (payload: { email_id: string; password: string }) =>
    api.post('/auth/complete-register', payload),

  // Login
  login: (payload: { username: string; password: string }) =>
    api.post<{ token: string; user: unknown; message?: string }>('/auth/login', payload),

  // Forgot password
  forgotPassword: (payload: { email_id: string; new_password: string }) =>
    api.post('/auth/forgot_password', payload),
};

// ============================================
// ORGANIZATION/TENANT API ENDPOINTS
// ============================================
export const orgAPI = {
  // Create organization/tenant
  createTenant: (payload: { 
    org_name: string; 
    org_type?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  }) => api.post<{ tenant_id: string; message: string }>('/org/create-tenant', payload),

  // Get tenant details
  getTenant: (tenantId: string) => 
    api.get<{ tenant: unknown }>(`/org/tenant/${tenantId}`),
};

// ============================================
// USAGE EXAMPLES (for reference)
// ============================================
/*

// Import the api
import { api } from '@/lib/api';

// -------- GET Examples --------
// Simple GET
const users = await api.get<User[]>('/users');

// GET with query params
const paginatedUsers = await api.get<User[]>('/users', { 
  params: { page: 1, limit: 10, search: 'john' } 
});

// GET single item
const user = await api.get<User>('/users/123');


// -------- POST Examples --------
// Create new resource
const newUser = await api.post<User>('/users', {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210'
});


// -------- PUT Examples --------
// Full update
const updatedUser = await api.put<User>('/users/123', {
  name: 'John Updated',
  email: 'john.updated@example.com',
  phone: '9876543211'
});


// -------- PATCH Examples --------
// Partial update
const patchedUser = await api.patch<User>('/users/123', {
  name: 'Only Name Changed'
});


// -------- DELETE Examples --------
// Simple delete
const deleted = await api.del('/users/123');

// Delete with payload
const deletedWithReason = await api.del('/users/123', { reason: 'inactive' });


// -------- Response Handling --------
const result = await api.get<User[]>('/users');

if (result.success) {
  console.log('Data:', result.data);
} else {
  console.error('Error:', result.error);
}


// -------- Custom Headers --------
const result = await api.get<User[]>('/users', {
  headers: { 'X-Custom-Header': 'value' }
});

*/
