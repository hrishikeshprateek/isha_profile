'use client';

import { useState, useCallback } from 'react';
import { apiCall, apiGet, apiPost, apiPut, apiDelete, ApiRequestOptions, ApiResponse } from '@/lib/api-client';

interface UseAdminApiOptions {
  onSuccess?: (data: Record<string, unknown>) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for making authenticated admin API calls
 * Automatically handles loading state and error handling
 * Includes Firebase token in Authorization header
 */
export function useAdminApi(options: UseAdminApiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async (endpoint: string, apiOptions: ApiRequestOptions = {}) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiCall(endpoint, {
          ...apiOptions,
          requireAuth: true,
        });

        if (result.status >= 400) {
          const errorMsg = (result.data as Record<string, unknown>)?.error || `Request failed with status ${result.status}`;
          setError(String(errorMsg));
          options.onError?.(String(errorMsg));
          throw new Error(String(errorMsg));
        }

        options.onSuccess?.(result.data as Record<string, unknown>);
        return result.data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        options.onError?.(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const get = useCallback(
    (endpoint: string) => request(endpoint, { method: 'GET' }),
    [request]
  );

  const post = useCallback(
    (endpoint: string, body?: Record<string, unknown>) =>
      request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    [request]
  );

  const put = useCallback(
    (endpoint: string, body?: Record<string, unknown>) =>
      request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    [request]
  );

  const del = useCallback(
    (endpoint: string) => request(endpoint, { method: 'DELETE' }),
    [request]
  );

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    delete: del,
  };
}

