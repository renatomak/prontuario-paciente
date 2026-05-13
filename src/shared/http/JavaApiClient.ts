import { getPacienteApiBaseUrl } from "../env";
import { httpClient } from "../http";

export class JavaApiClient {
  private baseUrl: string;
  private commonHeaders: Record<string, string>;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? getPacienteApiBaseUrl();
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

  async getText(path: string): Promise<string> {
    const url = new URL(this.baseUrl + path);
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: this.commonHeaders,
    });
    if (!res.ok) {
      throw new Error(`Erro HTTP ${res.status}`);
    }
    return res.text();
  }
}
