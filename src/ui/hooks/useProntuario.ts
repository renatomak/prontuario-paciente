import { useMutation } from "@tanstack/react-query";
import { JavaApiProntuarioAdapter } from "../../adapters/java-api/JavaApiProntuarioAdapter";

const port = new JavaApiProntuarioAdapter();

export function useProntuario() {
  return useMutation({
    mutationFn: (pacienteId: number) => port.getByPacienteId(pacienteId),
    mutationKey: ["prontuario"],
  });
}
