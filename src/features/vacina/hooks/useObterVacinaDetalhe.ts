import { useQuery } from "@tanstack/react-query";
import { obterVacinaDetalhePort as defaultPort } from "@/shared/container";
import type { ObterVacinaDetalhePort } from "../port";

export function useObterVacinaDetalhe(
  idAplicacao: number,
  enabled = true,
  port: ObterVacinaDetalhePort = defaultPort,
) {
  return useQuery({
    queryKey: ["vacinaDetalhe", idAplicacao],
    queryFn: () => port.obterDetalhe(idAplicacao),
    enabled: !!idAplicacao && enabled,
  });
}
