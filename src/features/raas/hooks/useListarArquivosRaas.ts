import { useMutation } from "@tanstack/react-query";
import { raasRepository as defaultRepository } from "@/shared/container";
import type { RaasRepository } from "../domain/RaasRepository";
import type { ListarArquivosRaasRequest } from "../types/ListarArquivosRaasRequest";

/**
 * Caso de uso: Listar arquivos do RAAS-PSI.
 *
 * Depende da interface `RaasRepository`; em testes, passe um mock
 * via parâmetro `repository`.
 */
export function useListarArquivosRaas(repository: RaasRepository = defaultRepository) {
  return useMutation({
    mutationKey: ["raas", "listarArquivos"],
    mutationFn: (request: ListarArquivosRaasRequest) =>
      repository.listarArquivos(request),
  });
}
