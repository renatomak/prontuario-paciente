import type { ProntuarioPort } from "../../ports";
import type { ProntuarioRegistro } from "../../domain/models";
import { JavaApiClient } from "./JavaApiClient";

export class JavaApiProntuarioAdapter implements ProntuarioPort {
  private client = new JavaApiClient();

  async getByPacienteId(id: number): Promise<ProntuarioRegistro[]> {
    return this.client.get<ProntuarioRegistro[]>(`/api/prontuario/${id}`);
  }
}
