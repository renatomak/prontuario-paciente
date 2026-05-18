import { useMutation } from "@tanstack/react-query";
import { buscarPacientePort as defaultPort } from "@/shared/container";
import type { BuscarPacientePort } from "../port/BuscarPacientePort";

export function useBuscarPaciente(port: BuscarPacientePort = defaultPort) {
  return useMutation({
    mutationKey: ["paciente", "buscar"],
    mutationFn: (query: string) => port.buscar({ query }),
  });
}
