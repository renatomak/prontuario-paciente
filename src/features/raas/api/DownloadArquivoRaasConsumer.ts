import { JavaApiClient } from "@/shared/http/JavaApiClient";
import { getRaasApiBaseUrl } from "@/shared/env";

import { DownloadArquivoRaasPort } from "../port/DownloadArquivoRaasPort";
import { DownloadArquivoRaasResponse } from "../types/DownloadArquivoRaasResponse";

export class DownloadArquivoRaasConsumer implements DownloadArquivoRaasPort {
  private client = new JavaApiClient(getRaasApiBaseUrl());

  async download(id: number): Promise<DownloadArquivoRaasResponse> {
    return this.client.get<DownloadArquivoRaasResponse>(`/api/v1/raas/${id}`);
  }
}