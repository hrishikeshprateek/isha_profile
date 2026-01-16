/**
 * Centralized API helper for authenticated admin requests
 * Automatically includes Firebase ID token in Authorization header
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
}

async function getAuthToken(): Promise<string | null> {
  // First try localStorage (client-side)
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  if (storedToken) {
    return storedToken;
  }

  // If on server-side or no stored token, return null
  // Server will read from cookies automatically
  return null;
}

export async function apiCall<T = Record<string, unknown>>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const { requireAuth = false, ...init } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> || {}),
  };

  // Add Firebase ID token if available
  if (requireAuth) {
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${process.env.NEXT_PUBLIC_API_URL || '/api'}${endpoint}`;

  const response = await fetch(url, {
    ...init,
    headers,
  });

  const data = await response.json();

  return {
    data,
    status: response.status,
  };
}

/**
 * GET request with optional auth
 */
export async function apiGet<T = Record<string, unknown>>(
  endpoint: string,
  requireAuth = false
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, { method: 'GET', requireAuth });
}

/**
 * POST request with optional auth
 */
export async function apiPost<T = Record<string, unknown>>(
  endpoint: string,
  body?: Record<string, unknown>,
  requireAuth = false
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    method: 'POST',
    requireAuth,
    body: JSON.stringify(body),
  });
}

/**
 * PUT request with optional auth
 */
export async function apiPut<T = Record<string, unknown>>(
  endpoint: string,
  body?: Record<string, unknown>,
  requireAuth = false
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    method: 'PUT',
    requireAuth,
    body: JSON.stringify(body),
  });
}

/**
 * DELETE request with optional auth
 */
export async function apiDelete<T = Record<string, unknown>>(
  endpoint: string,
  requireAuth = false
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, { method: 'DELETE', requireAuth });
}

