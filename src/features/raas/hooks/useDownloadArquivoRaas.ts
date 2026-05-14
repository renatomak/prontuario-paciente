import { useMutation } from "@tanstack/react-query";
import { downloadArquivoRaasPort as defaultPort } from "@/shared/container";
import type { DownloadArquivoRaasPort } from "../port";
import type { DownloadArquivoRaasResponse } from "../types/DownloadArquivoRaasResponse";

export function useDownloadArquivoRaas(port: DownloadArquivoRaasPort = defaultPort) {
  return useMutation<DownloadArquivoRaasResponse, unknown, number>({
    mutationKey: ["raas", "downloadArquivo"],
    mutationFn: (id) => port.download(id),
  });
}
