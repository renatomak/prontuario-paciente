// src/shared/http.ts
// Cliente HTTP genérico para adapters

export interface ApiError extends Error {
  status: number;
  details?: any;
}

export class ApiErrorImpl extends Error implements ApiError {
  status: number;
  details?: any;
  constructor(status: number, message: string, details?: any) {
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
    let body: any = null;
    try { body = await res.json(); } catch {}
    if (!res.ok) {
      const msg = body?.message || `Erro HTTP ${res.status}`;
      throw new ApiErrorImpl(res.status, msg, body);
    }
    return body as T;
  } finally {
    clearTimeout(id);
  }
}
