import { DownloadArquivoRaasResponse } from "../types/DownloadArquivoRaasResponse";


export interface DownloadArquivoRaasPort {
  download(id: number): Promise<DownloadArquivoRaasResponse>;
}
