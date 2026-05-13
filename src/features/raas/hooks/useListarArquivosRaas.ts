import { useMutation } from "@tanstack/react-query";
import { raasRepository as defaultRepository } from "@/shared/container";
import type { RaasPort } from "../port/RaasPort";
import type { ListarArquivosRaasRequest } from "../types/ListarArquivosRaasRequest";

export function useListarArquivosRaas(repository: RaasPort = defaultRepository) {
  return useMutation({
    mutationKey: ["raas", "listarArquivos"],
    mutationFn: (request: ListarArquivosRaasRequest) =>
      repository.listarArquivos(request),
  });
}
