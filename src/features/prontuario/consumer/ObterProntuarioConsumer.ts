import { JavaApiClient } from "@/shared/http/JavaApiClient";
import {
  ProntuarioResponseSchema,
  type ProntuarioResponse,
} from "../types/ObterProntuarioResponse";
import type { ObterProntuarioPort } from "../port/ObterProntuarioPort";

export class ObterProntuarioConsumer implements ObterProntuarioPort {
  constructor(private client: JavaApiClient = new JavaApiClient()) {}

  async obterPorPacienteId(pacienteId: number): Promise<ProntuarioResponse> {
    const raw = await this.client.get<Record<string, unknown>>(
      `/api/prontuario/${pacienteId}`,
    );
    if (!raw || typeof raw !== "object" || !("paciente" in raw)) {
      throw new Error("Resposta invalida da API de prontuario.");
    }
    if (!Array.isArray(raw.atendimentos)) {
      raw.atendimentos = [];
    }
    return ProntuarioResponseSchema.parse(raw);
  }
}
