import { JavaApiClient } from "@/shared/http/JavaApiClient";
import {
  ProntuarioResponseSchema,
  type ProntuarioResponse,
} from "../port/schemas";
import type { ProntuarioPort } from "../port/ProntuarioPort";

export class ProntuarioPersistenceAdapter implements ProntuarioPort {
  private client = new JavaApiClient();

  async obterPorPacienteId(pacienteId: number): Promise<ProntuarioResponse> {
    const raw = await this.client.get<Record<string, unknown>>(
      `/api/prontuario/${pacienteId}`,
    );
    if (!raw || typeof raw !== "object" || !("paciente" in raw)) {
      throw new Error("Resposta inválida da API de prontuário.");
    }
    if (!Array.isArray(raw.atendimentos)) {
      raw.atendimentos = [];
    }
    return ProntuarioResponseSchema.parse(raw);
  }
}
