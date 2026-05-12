import { useQuery } from "@tanstack/react-query";
import { vacinaRepository as defaultRepository } from "@/shared/container";
import type { VacinaPort } from "../domain/VacinaPort";

/** Caso de uso: Obter detalhes de uma aplicacao de vacina. */
export function useObterVacinaDetalhe(
  idAplicacao: number,
  enabled = true,
  repository: VacinaPort = defaultRepository,
) {
  return useQuery({
    queryKey: ["vacinaDetalhe", idAplicacao],
    queryFn: () => repository.obterDetalhe(idAplicacao),
    enabled: !!idAplicacao && enabled,
  });
}
