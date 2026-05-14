import { JavaApiClient } from "@/shared/http/JavaApiClient";
import { getRaasApiBaseUrl } from "@/shared/env";
import type { DownloadArquivoRaasResponse } from "../types/RaasTypes";
import { DownloadArquivoRaasPort } from "../port";

export class DownloadArquivoRaasConsumer implements DownloadArquivoRaasPort {
  private client = new JavaApiClient(getRaasApiBaseUrl());

  async download(id: number): Promise<DownloadArquivoRaasResponse> {
    return this.client.get<DownloadArquivoRaasResponse>(`/api/v1/raas/${id}`);
  }
}