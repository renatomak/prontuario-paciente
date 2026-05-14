import { DownloadArquivoRaasResponse } from "../types/RaasTypes";

export interface DownloadArquivoRaasPort {
  download(id: number): Promise<DownloadArquivoRaasResponse>;
}
