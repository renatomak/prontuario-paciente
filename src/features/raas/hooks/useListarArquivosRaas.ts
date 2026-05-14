import { useMutation } from "@tanstack/react-query";
import { listarArquivosRaasPort as defaultPort } from "@/shared/container";
import type { ListarArquivoRaasPort } from "../port";
import type {
  ListarArquivosRaasRequest,
  ListarArquivosRaasResponse,
} from "../types/RaasTypes";

/**
 * Caso de uso: listar arquivos do RAAS. Modelado como mutation pois é
 * disparado sob demanda (clique em "Procurar"), nunca em mount.
 */
export function useListarArquivosRaas(port: ListarArquivoRaasPort = defaultPort) {
  return useMutation<ListarArquivosRaasResponse, unknown, ListarArquivosRaasRequest>({
    mutationKey: ["raas", "listarArquivos"],
    mutationFn: (request) => port.listarArquivos(request),
  });
}
