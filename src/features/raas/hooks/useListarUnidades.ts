import { useQuery } from "@tanstack/react-query";
import { listarUnidadesRaasPort as defaultPort } from "@/shared/container";
import type { ListarUnidadesPort } from "../port";
import type { UnidadeResponse } from "../types/UnidadeResponse";

export function useListarUnidades(port: ListarUnidadesPort = defaultPort) {
  return useQuery<UnidadeResponse>({
    queryKey: ["raas", "listarUnidades"],
    queryFn: () => port.listarUnidades(),
  });
}
