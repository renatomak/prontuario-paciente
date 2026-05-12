import { getApiBaseUrl } from "@/shared/env";
import {
  ProntuarioResponseSchema,
  type ProntuarioResponse,
} from "../domain/schemas";
import type { ProntuarioRepository } from "../domain/ProntuarioRepository";

export class ProntuarioPersistenceAdapter implements ProntuarioRepository {
  async obterPorPacienteId(pacienteId: number): Promise<ProntuarioResponse> {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/api/prontuario/${pacienteId}`);
    if (!res.ok) {
      throw new Error(`Erro ao buscar prontuário (HTTP ${res.status})`);
    }
    const raw = await res.json();
    if (!raw || typeof raw !== "object" || !("paciente" in raw)) {
      throw new Error("Resposta inválida da API de prontuário.");
    }
    if (!Array.isArray((raw as { atendimentos?: unknown }).atendimentos)) {
      (raw as { atendimentos: unknown[] }).atendimentos = [];
    }
    return ProntuarioResponseSchema.parse(raw);
  }
}
