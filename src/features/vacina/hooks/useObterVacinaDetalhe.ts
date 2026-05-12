import { useQuery } from "@tanstack/react-query";
import { vacinaRepository as defaultRepository } from "@/shared/container";
import type { VacinaRepository } from "../domain/VacinaRepository";

/** Caso de uso: Obter detalhes de uma aplicação de vacina. */
export function useObterVacinaDetalhe(
  idAplicacao: number,
  enabled = true,
  repository: VacinaRepository = defaultRepository,
) {
  return useQuery({
    queryKey: ["vacinaDetalhe", idAplicacao],
    queryFn: () => repository.obterDetalhe(idAplicacao),
    enabled: !!idAplicacao && enabled,
  });
}
