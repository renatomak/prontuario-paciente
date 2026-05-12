import { useQuery } from "@tanstack/react-query";
import { prontuarioRepository as defaultRepository } from "@/shared/container";
import type { ProntuarioRepository } from "../domain/ProntuarioRepository";

/** Caso de uso: Obter prontuário (atendimentos) de um paciente. */
export function useObterProntuario(
  pacienteId: number,
  enabled = true,
  repository: ProntuarioRepository = defaultRepository,
) {
  return useQuery({
    queryKey: ["prontuario", pacienteId],
    queryFn: () => repository.obterPorPacienteId(pacienteId),
    enabled: !!pacienteId && enabled,
  });
}
