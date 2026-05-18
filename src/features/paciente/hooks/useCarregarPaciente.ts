import { useQuery } from "@tanstack/react-query";
import { carregarPacientePort as defaultPort } from "@/shared/container";
import type { CarregarPacientePort } from "../port/CarregarPacientePort";

export function useCarregarPaciente(
  id: number,
  enabled = true,
  port: CarregarPacientePort = defaultPort,
) {
  return useQuery({
    queryKey: ["paciente", id],
    queryFn: () => port.carregarPorId(id),
    enabled: !!id && enabled,
  });
}
