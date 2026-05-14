import { JavaApiClient } from "@/shared/http/JavaApiClient";
import { getRaasApiBaseUrl } from "@/shared/env";
import type { ListarUnidadesPort } from "../port";
import type { UnidadeResponse } from "../types/UnidadeResponse";

export class ListarUnidadesConsumer implements ListarUnidadesPort {
  private client = new JavaApiClient(getRaasApiBaseUrl());

  async listarUnidades(): Promise<UnidadeResponse> {
    return this.client.get<UnidadeResponse>("/api/v1/unidades");
  }
}
