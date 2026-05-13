import { useQuery } from "@tanstack/react-query";
import { prontuarioRepository as defaultRepository } from "@/shared/container";
import type { ProntuarioPort } from "../port/ProntuarioPort";

/** Caso de uso: Obter prontuario (atendimentos) de um paciente. */
export function useObterProntuario(
  pacienteId: number,
  enabled = true,
  repository: ProntuarioPort = defaultRepository,
) {
  return useQuery({
    queryKey: ["prontuario", pacienteId],
    queryFn: () => repository.obterPorPacienteId(pacienteId),
    enabled: !!pacienteId && enabled,
  });
}
