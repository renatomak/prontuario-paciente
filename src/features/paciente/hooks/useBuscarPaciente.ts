import { useMutation } from "@tanstack/react-query";
import { pacienteRepository as defaultRepository } from "@/shared/container";
import type { PacientePort } from "../port/PacientePort";

/** Caso de uso: Buscar paciente por nome ou CPF. */
export function useBuscarPaciente(
  repository: PacientePort = defaultRepository,
) {
  return useMutation({
    mutationKey: ["paciente", "buscar"],
    mutationFn: (query: string) => repository.buscar({ query }),
  });
}
