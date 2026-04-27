import type { ProntuarioPort } from "../../ports";
import type { ProntuarioRegistro } from "../../domain/models";
import { JavaApiClient } from "./JavaApiClient";

export class JavaApiProntuarioAdapter implements ProntuarioPort {
  private client = new JavaApiClient();

  async getByPacienteId(id: number): Promise<ProntuarioRegistro[]> {
    const raw = await this.client.get<unknown>(`/api/prontuario/${id}`);
    // Normaliza para array, tolerando respostas envelopadas { data: [...] } ou { content: [...] }
    let arr: unknown[] = [];
    if (Array.isArray(raw)) {
      arr = raw;
    } else if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      if (Array.isArray(obj.data)) arr = obj.data as unknown[];
      else if (Array.isArray(obj.content)) arr = obj.content as unknown[];
      else if (Array.isArray(obj.registros)) arr = obj.registros as unknown[];
    }
    console.info("[Prontuario] paciente", id, "registros recebidos:", arr.length, raw);
    return arr as ProntuarioRegistro[];
  }
}
