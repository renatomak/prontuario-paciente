export interface GerarArquivoPsicossocialPort {
  gerar(mes: number, ano: number): Promise<string>;
}
