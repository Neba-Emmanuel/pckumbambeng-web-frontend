import { API_BASE_URL } from '@/lib/api-base';
import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: handle 401 redirects and error parsing
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: { message?: string } }>) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Parse a user-friendly error message from an axios error response.
 * Expects the backend error format: { error: { message: "..." } }
 */
export function parseApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { error?: { message?: string } }
      | undefined;
    if (data?.error?.message) {
      return data.error.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export { apiClient };
export default apiClient;
