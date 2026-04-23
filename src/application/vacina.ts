import type { VacinaPort } from "../ports";
import type { VacinaResumo, VacinaDetalhe } from "../domain/models";

export function listVacinasPaciente(id: number, vacinaPort: VacinaPort): Promise<VacinaResumo[]> {
  return vacinaPort.listByPaciente(id);
}

export function getVacinaDetalhe(idAplicacao: number, vacinaPort: VacinaPort): Promise<VacinaDetalhe> {
  return vacinaPort.getDetalhe(idAplicacao);
}
