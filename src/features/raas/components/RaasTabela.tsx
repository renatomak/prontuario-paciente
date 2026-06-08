import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye, FileText, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDownloadArquivoRaas, useGerarArquivoPsicossocial } from "../hooks";
import type { ListarArquivosRaasResponse } from "../types";

type ArquivoRaasTabelaItem = ListarArquivosRaasResponse["content"][number];

const MESES = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function nomeMes(m: number): string {
  return MESES[m - 1] ?? String(m);
}

function situacaoBadge(s: string) {
  if (s === "3")
    return (
      <Badge className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-100">
        Arquivo Gerado
      </Badge>
    );
  if (s === "6")
    return (
      <Badge className="bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-100">
        Cancelados
      </Badge>
    );
  return <Badge variant="outline">{s || "\u2014"}</Badge>;
}


function downloadTxt(conteudo: string, nomeArquivo: string) {
  const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface RaasTabelaProps {
  arquivos: ListarArquivosRaasResponse["content"];
  loading: boolean;
  carregado: boolean;
}

export function RaasTabela({ arquivos, loading, carregado }: RaasTabelaProps) {
  const [baixandoId, setBaixandoId] = useState<number | null>(null);
  const [gerandoId, setGerandoId] = useState<number | null>(null);
  const download = useDownloadArquivoRaas();
  const gerarPsicossocial = useGerarArquivoPsicossocial();

  async function handleDownload(arquivo: ArquivoRaasTabelaItem) {
    try {
      setBaixandoId(arquivo.id);
      const { nome, arquivo: conteudo } = await download.mutateAsync(arquivo.id);
      const nomeArquivo = (nome ?? "").split("/").pop() || `raas_${arquivo.id}`;
      const nomeBase = nomeArquivo
        .replace(/\.out$/i, "")
        .replace(/\.txt$/i, "");
      const nomeTxt = `${nomeBase}.txt`;
      downloadTxt(conteudo ?? "", nomeTxt);
    } catch {
      toast.error("Falha ao baixar o arquivo.");
    } finally {
      setBaixandoId(null);
    }
  }

  async function handleGerarPsicossocial(arquivo: ArquivoRaasTabelaItem) {
    try {
      setGerandoId(arquivo.id);
      const conteudo = await gerarPsicossocial.mutateAsync({
        mes: arquivo.mes,
        ano: arquivo.ano,
      });
      const nomeTxt = `raas_psicossocial_${arquivo.mes}_${arquivo.ano}.txt`;
      downloadTxt(conteudo ?? "", nomeTxt);
    } catch {
      toast.error("Falha ao gerar o arquivo psicossocial.");
    } finally {
      setGerandoId(null);
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Acoes</TableHead>
              <TableHead>Mes</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Data Geracao</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Situacao</TableHead>
              <TableHead className="text-right">Folhas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {!loading && !carregado && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground italic">
                  Clique em <strong className="not-italic">Procurar</strong> para listar os arquivos.
                </TableCell>
              </TableRow>
            )}
            {!loading && carregado && arquivos.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground italic">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              arquivos.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        title="Baixar"
                        disabled={baixandoId === a.id}
                        onClick={() => handleDownload(a)}
                      >
                        {baixandoId === a.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                        ) : (
                          <Download className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        title="Baixar (psicossocial - novo endpoint)"
                        disabled={gerandoId === a.id}
                        onClick={() => handleGerarPsicossocial(a)}
                      >
                        {gerandoId === a.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                        ) : (
                          <FileText className="h-4 w-4 text-emerald-600" />
                        )}
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" title="Visualizar">
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" title="Excluir">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{nomeMes(a.mes)}</TableCell>
                  <TableCell>{a.ano}</TableCell>
                  <TableCell>{a.dataGeracao}</TableCell>
                  <TableCell className="text-muted-foreground">{a.nomeEmpresa ?? "\u2014"}</TableCell>
                  <TableCell>{situacaoBadge(a.status)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {a.totalFolha.toLocaleString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
