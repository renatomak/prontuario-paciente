// src/ui/hooks/usePacienteSearch.ts
import { useMutation } from "@tanstack/react-query";
import { searchPaciente } from "../../application/paciente";
import { JavaApiPacienteAdapter } from "../../adapters/java-api/JavaApiPacienteAdapter";

const pacientePort = new JavaApiPacienteAdapter();

export function usePacienteSearch() {
  return useMutation({
    mutationFn: (query: string) => searchPaciente(query, pacientePort),
    mutationKey: ["pacienteSearch"],
  });
}
