// src/adapters/java-api/JavaApiClient.ts
import { getApiBaseUrl } from "../../shared/env";
import { httpClient } from "../../shared/http";

export class JavaApiClient {
  private baseUrl: string;
  private commonHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = getApiBaseUrl();
    this.commonHeaders = {};
  }

  async get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
    const url = new URL(this.baseUrl + path);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
    }
    return httpClient<T>(url.toString(), {
      method: "GET",
      headers: this.commonHeaders,
    });
  }
}
