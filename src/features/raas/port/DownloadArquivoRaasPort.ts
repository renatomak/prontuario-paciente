import { DownloadArquivoRaasResponse } from "../types/raas";

export interface DownloadArquivoRaasPort {
  download(id: number): Promise<DownloadArquivoRaasResponse>;
}
