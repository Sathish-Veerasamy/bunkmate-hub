// ============================================
// API CONFIGURATION - Change these as needed
// ============================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_PREFIX = '/api/v3';

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
// CORE API REQUEST FUNCTION
// ============================================
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { params?: Record<string, string | number | boolean> } = {}
): Promise<ApiResponse<T>> {
  try {
    // Get token from auth storage
    const token = localStorage.getItem('auth-storage')
      ? JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token
      : null;

    // Build headers - automatically includes Content-Type and Authorization
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    // Build URL with query params if provided
    let url = `${API_BASE_URL}${API_PREFIX}${endpoint}`;
    if (options.params) {
      const queryString = new URLSearchParams(
        Object.entries(options.params).map(([key, value]) => [key, String(value)])
      ).toString();
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || `Request failed with status ${response.status}`,
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
    body: payload ? JSON.stringify(payload) : undefined,
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
    body: payload ? JSON.stringify(payload) : undefined,
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
    body: payload ? JSON.stringify(payload) : undefined,
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
    body: payload ? JSON.stringify(payload) : undefined,
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
  sendOtp: (payload: { first_name?: string; last_name?: string; email_id: string }) =>
    api.post('/auth/send_otp', payload),

  verifyOtp: (payload: { email_id: string; otp: string }) =>
    api.post('/auth/verify_otp', payload),

  register: (payload: { email_id: string; password: string; first_name: string; last_name: string }) =>
    api.post('/auth/register', payload),

  login: (payload: { username: string; password: string }) =>
    api.post<{ token: string; user: unknown }>('/auth/login', payload),

  forgotPassword: (payload: { email_id: string; new_password: string }) =>
    api.post('/auth/forgot_password', payload),
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


// -------- Full URL Construction --------
// Base URL: import.meta.env.VITE_API_BASE_URL (e.g., https://api.example.com)
// Prefix: /api/v3
// Endpoint: /users
// Final: https://api.example.com/api/v3/users

*/
