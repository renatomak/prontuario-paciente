import { useMutation } from "@tanstack/react-query";
import { raasRepository as defaultRepository } from "@/shared/container";
import type { ListarArquivoRaasPort } from "../port/ListarArquivoRaasPort";
import type { ListarArquivosRaasRequest, ListarArquivosRaasResponse } from "../types/raas";

export function useListarArquivosRaas(repository: ListarArquivoRaasPort = defaultRepository) {
  return useMutation<ListarArquivosRaasResponse, unknown, ListarArquivosRaasRequest>({
    mutationKey: ["raas", "listarArquivos"],
    mutationFn: (request: ListarArquivosRaasRequest) =>
      repository.listarArquivos(request),
  });
}
