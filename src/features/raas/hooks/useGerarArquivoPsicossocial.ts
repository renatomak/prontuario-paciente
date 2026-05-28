import { useMutation } from "@tanstack/react-query";
import { gerarArquivoPsicossocialPort as defaultPort } from "@/shared/container";
import type { GerarArquivoPsicossocialPort } from "../port/GerarArquivoPsicossocialPort";

export function useGerarArquivoPsicossocial(
  port: GerarArquivoPsicossocialPort = defaultPort,
) {
  return useMutation<string, unknown, { mes: number; ano: number }>({
    mutationKey: ["raas", "gerarPsicossocial"],
    mutationFn: ({ mes, ano }) => port.gerar(mes, ano),
  });
}
