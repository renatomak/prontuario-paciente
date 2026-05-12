import { useMutation } from "@tanstack/react-query";
import { pacienteRepository as defaultRepository } from "@/shared/container";
import type { PacienteRepository } from "../domain/PacienteRepository";

/** Caso de uso: Buscar paciente por nome ou CPF. */
export function useBuscarPaciente(
  repository: PacienteRepository = defaultRepository,
) {
  return useMutation({
    mutationKey: ["paciente", "buscar"],
    mutationFn: (query: string) => repository.buscar({ query }),
  });
}
