import { useQuery } from "@tanstack/react-query";
import { listarUnidadesRaasPort } from "@/shared/container";
import type { ListarUnidadesPort } from "../port";
import type { UnidadeResponse } from "../types/UnidadeResponse";

export function ListarUnidadesHooks(consumer: ListarUnidadesPort = listarUnidadesRaasPort) {
  return useQuery<UnidadeResponse>({
    queryKey: ["raas", "listarUnidades"],
    queryFn: () => consumer.listarUnidades(),
  });
}
