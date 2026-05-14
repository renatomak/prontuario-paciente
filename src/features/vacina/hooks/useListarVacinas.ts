import { useQuery } from "@tanstack/react-query";
import { listarVacinasPort as defaultPort } from "@/shared/container";
import type { ListarVacinasPort } from "../port";

export function useListarVacinas(
  pacienteId: number,
  enabled = true,
  port: ListarVacinasPort = defaultPort,
) {
  return useQuery({
    queryKey: ["vacinas", pacienteId],
    queryFn: () => port.listarPorPaciente(pacienteId),
    enabled: !!pacienteId && enabled,
  });
}
