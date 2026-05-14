import type { UnidadeResponse } from "../types/UnidadeResponse";

export interface ListarUnidadesPort {
  listarUnidades(): Promise<UnidadeResponse>;
}
