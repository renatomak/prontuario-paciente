import { useQuery } from "@tanstack/react-query";
import { pacienteRepository as defaultRepository } from "@/shared/container";
import type { PacienteRepository } from "../domain/PacienteRepository";

/** Caso de uso: Carregar dados completos do paciente por ID. */
export function useCarregarPaciente(
  id: number,
  enabled = true,
  repository: PacienteRepository = defaultRepository,
) {
  return useQuery({
    queryKey: ["paciente", id],
    queryFn: () => repository.carregarPorId(id),
    enabled: !!id && enabled,
  });
}
