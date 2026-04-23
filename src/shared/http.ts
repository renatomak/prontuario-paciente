export interface ApiError extends Error {
  status: number;
  details?: unknown;
}

export class ApiErrorImpl extends Error implements ApiError {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export interface HttpClientOptions {
  timeout?: number;
  headers?: Record<string, string>;
}

export async function httpClient<T>(
  url: string,
  options: RequestInit & HttpClientOptions = {}
): Promise<T> {
  const { timeout = 10000, headers = {}, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    });
    let body: unknown = null;
    try { body = await res.json(); } catch { /* empty */ }
    if (!res.ok) {
      let msg = `Erro HTTP ${res.status}`;
      if (body && typeof body === 'object' && 'message' in body) {
        msg = String((body as { message?: unknown }).message ?? msg);
      }
      throw new ApiErrorImpl(res.status, msg, body);
    }
    return body as T;
  } finally {
    clearTimeout(id);
  }
}
