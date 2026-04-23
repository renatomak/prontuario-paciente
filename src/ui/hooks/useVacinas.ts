// src/ui/hooks/useVacinas.ts
import { useQuery } from "@tanstack/react-query";
import { listVacinasPaciente } from "../../application/vacina";
import { JavaApiVacinaAdapter } from "../../adapters/java-api/JavaApiVacinaAdapter";

const vacinaPort = new JavaApiVacinaAdapter();

export function useVacinas(pacienteId: number, enabled = true) {
  return useQuery({
    queryKey: ["vacinas", pacienteId],
    queryFn: () => listVacinasPaciente(pacienteId, vacinaPort),
    enabled: !!pacienteId && enabled,
  });
}
