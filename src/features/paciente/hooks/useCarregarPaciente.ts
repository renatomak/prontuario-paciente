import { useQuery } from "@tanstack/react-query";
import { pacienteRepository as defaultRepository } from "@/shared/container";
import type { PacientePort } from "../port/PacientePort";

/** Caso de uso: Carregar dados completos do paciente por ID. */
export function useCarregarPaciente(
  id: number,
  enabled = true,
  repository: PacientePort = defaultRepository,
) {
  return useQuery({
    queryKey: ["paciente", id],
    queryFn: () => repository.carregarPorId(id),
    enabled: !!id && enabled,
  });
}
