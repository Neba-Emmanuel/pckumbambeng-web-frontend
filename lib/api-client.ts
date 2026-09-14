import { API_BASE_URL } from '@/lib/api-base';
/**
 * Shared fetch helper for the PC Kumba-Mbeng API.
 *
 * The backend always responds with a consistent envelope:
 *   success:  { success: true, data: <T>, meta?: <PaginationMeta> }
 *   error:    { success: false, error: { code, message, details? } }
 *
 * These helpers unwrap that envelope in ONE place so callers never have to
 * remember to read `data.data` / `data.meta`. This prevents the class of bug
 * where a component reads the wrong key (e.g. `data.sermons`) and silently
 * gets an empty list or the whole envelope object.
 */

const API_URL = API_BASE_URL;

/** Pagination metadata returned under `meta` for list endpoints. */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}

/** Shape of the backend success envelope. */
interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

/** Result returned to callers: the unwrapped data plus optional meta. */
export interface ApiResult<T> {
  data: T;
  meta?: PaginationMeta;
}

/**
 * Error thrown when the API responds with a non-OK status or an
 * unsuccessful envelope. Carries the backend error code and HTTP status
 * so callers can branch (e.g. on 401 or a specific `code`).
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    code: string,
    details?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Core request function. Sends credentials (httpOnly cookie) by default,
 * parses the JSON envelope, and returns the unwrapped `{ data, meta }`.
 *
 * Throws {@link ApiError} on any non-OK response or unsuccessful envelope.
 *
 * @param path   API path beginning with `/` (e.g. `/api/sermons`).
 * @param init   Standard fetch options. `credentials` defaults to `include`.
 */
export async function apiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResult<T>> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...init,
  });

  // Some endpoints (e.g. logout) may return an empty body.
  let body: ApiEnvelope<T> | null = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text) as ApiEnvelope<T>;
    } catch {
      body = null;
    }
  }

  if (!res.ok || (body && body.success === false)) {
    const message =
      body?.error?.message || `Request failed with status ${res.status}`;
    const code = body?.error?.code || 'REQUEST_FAILED';
    throw new ApiError(message, res.status, code, body?.error?.details);
  }

  // A successful response should carry the envelope; if not, fall back to
  // treating the whole body as the data for maximum compatibility.
  const data = (body?.data ?? body) as T;
  return { data, meta: body?.meta };
}

/** Convenience helper: unwrap and return only the `data` payload. */
export async function apiGet<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const { data } = await apiRequest<T>(path, { ...init, method: 'GET' });
  return data;
}

/** GET that also returns pagination `meta` (for list endpoints). */
export async function apiGetList<T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResult<T>> {
  return apiRequest<T>(path, { ...init, method: 'GET' });
}

/**
 * JSON-body request helper for POST/PUT/PATCH. Serializes `body` as JSON
 * and sets the appropriate Content-Type. For file uploads with FormData,
 * use {@link apiRequest} directly and pass the FormData as `init.body`.
 */
export async function apiSend<T>(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: unknown,
  init: RequestInit = {}
): Promise<ApiResult<T>> {
  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData;

  return apiRequest<T>(path, {
    ...init,
    method,
    headers: isFormData
      ? init.headers
      : { 'Content-Type': 'application/json', ...init.headers },
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
  });
}
