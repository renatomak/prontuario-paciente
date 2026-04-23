// src/ui/hooks/usePaciente.ts
import { useQuery } from "@tanstack/react-query";
import { loadPaciente } from "../../application/paciente";
import { JavaApiPacienteAdapter } from "../../adapters/java-api/JavaApiPacienteAdapter";

const pacientePort = new JavaApiPacienteAdapter();

export function usePaciente(id: number, enabled = true) {
  return useQuery({
    queryKey: ["paciente", id],
    queryFn: () => loadPaciente(id, pacientePort),
    enabled: !!id && enabled,
  });
}
