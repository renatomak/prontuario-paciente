import { limparHtml } from "@/lib/limparHtml";
import type { ProntuarioRegistroConteudo } from "@/features/prontuario/types";

export interface BlocoConteudo {
  label: string;
  texto: string;
  longText?: boolean;
}

export function blocosConteudo(c: ProntuarioRegistroConteudo): BlocoConteudo[] {
  const blocos: BlocoConteudo[] = [];
  const avaliacao = limparHtml(c.avaliacao);
  const evolucao = limparHtml(c.evolucao);
  const exame = limparHtml(c.exame);
  if (avaliacao) blocos.push({ label: "Avaliacao", texto: avaliacao });
  if (evolucao) blocos.push({ label: "Evolucao", texto: evolucao, longText: true });
  if (exame) blocos.push({ label: "Exame", texto: exame });
  return blocos;
}
