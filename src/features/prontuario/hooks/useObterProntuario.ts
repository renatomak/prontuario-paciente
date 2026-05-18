import { useQuery } from "@tanstack/react-query";
import { obterProntuarioPort as defaultPort } from "@/shared/container";
import type { ObterProntuarioPort } from "../port/ObterProntuarioPort";

export function useObterProntuario(
  pacienteId: number,
  enabled = true,
  port: ObterProntuarioPort = defaultPort,
) {
  return useQuery({
    queryKey: ["prontuario", pacienteId],
    queryFn: () => port.obterPorPacienteId(pacienteId),
    enabled: !!pacienteId && enabled,
  });
}
