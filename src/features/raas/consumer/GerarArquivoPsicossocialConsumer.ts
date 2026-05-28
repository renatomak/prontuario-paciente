import { JavaApiClient } from "@/shared/http/JavaApiClient";
import { getRaasApiBaseUrl } from "@/shared/env";
import type { GerarArquivoPsicossocialPort } from "../port/GerarArquivoPsicossocialPort";

export class GerarArquivoPsicossocialConsumer implements GerarArquivoPsicossocialPort {
  private client = new JavaApiClient(getRaasApiBaseUrl());

  async gerar(mes: number, ano: number): Promise<string> {
    return this.client.getText(`/api/v1/raas/psicossocial/gerar/${mes}/${ano}`);
  }
}
