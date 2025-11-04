const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api').replace(/\/$/, '');

export interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function buildOptions(method: HttpMethod, body?: unknown, customHeaders?: HeadersInit): RequestInit {
  const headers = new Headers(customHeaders);
  let serializedBody: BodyInit | undefined = undefined;

  if (body !== undefined) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    serializedBody = JSON.stringify(body);
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return {
    method,
    headers,
    body: serializedBody,
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers = new Headers(options.headers);

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let payload: unknown = null;

  if (text.length > 0) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const error = new Error(
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? String((payload as Record<string, unknown>).message)
        : 'Unexpected server error.'
    ) as ApiError;
    error.status = response.status;
    error.details = payload;
    throw error;
  }

  return payload as T;
}

export const apiClient = {
  get: <T>(path: string, headers?: HeadersInit) => request<T>(path, buildOptions('GET', undefined, headers)),
  post: <T>(path: string, body?: unknown, headers?: HeadersInit) =>
    request<T>(path, buildOptions('POST', body, headers)),
  put: <T>(path: string, body?: unknown, headers?: HeadersInit) =>
    request<T>(path, buildOptions('PUT', body, headers)),
  patch: <T>(path: string, body?: unknown, headers?: HeadersInit) =>
    request<T>(path, buildOptions('PATCH', body, headers)),
  delete: <T>(path: string, headers?: HeadersInit) =>
    request<T>(path, buildOptions('DELETE', undefined, headers)),
};

