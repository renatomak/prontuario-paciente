import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye, Loader2, Trash2 } from "lucide-react";
import type { ArquivoRaas } from "../domain/schemas";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
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
  return <Badge variant="outline">{s || "—"}</Badge>;
}

export interface RaasTabelaProps {
  arquivos: ArquivoRaas[];
  loading: boolean;
  carregado: boolean;
}

export function RaasTabela({ arquivos, loading, carregado }: RaasTabelaProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Ações</TableHead>
              <TableHead>Mês</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Data Geração</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Situação</TableHead>
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
                      <Button size="icon" variant="ghost" className="h-7 w-7" title="Baixar">
                        <Download className="h-4 w-4 text-green-600" />
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
                  <TableCell className="text-muted-foreground">{a.nomeEmpresa ?? "—"}</TableCell>
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
