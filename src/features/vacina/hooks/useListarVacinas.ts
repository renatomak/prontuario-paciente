import { useQuery } from "@tanstack/react-query";
import { vacinaRepository as defaultRepository } from "@/shared/container";
import type { VacinaPort } from "../port/VacinaPort";

export function useListarVacinas(
  pacienteId: number,
  enabled = true,
  repository: VacinaPort = defaultRepository,
) {
  return useQuery({
    queryKey: ["vacinas", pacienteId],
    queryFn: () => repository.listarPorPaciente(pacienteId),
    enabled: !!pacienteId && enabled,
  });
}
