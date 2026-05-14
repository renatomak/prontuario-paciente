import { useMutation } from "@tanstack/react-query";
import { listarArquivosRaasPort as defaultRepository } from "@/shared/container";
import type { ListarArquivoRaasPort } from "../port";
import type { ListarArquivosRaasRequest, ListarArquivosRaasResponse } from "../types/RaasTypes";

export function ListarArquivosRaasHooks(repository: ListarArquivoRaasPort = defaultRepository) {
  return useMutation<ListarArquivosRaasResponse, unknown, ListarArquivosRaasRequest>({
    mutationKey: ["raas", "listarArquivos"],
    mutationFn: (request: ListarArquivosRaasRequest) =>
      repository.listarArquivos(request),
  });
}
