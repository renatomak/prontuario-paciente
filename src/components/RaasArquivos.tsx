import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Loader2,
  FileArchive,
  Download,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "sonner";
import { JavaApiRaasAdapter } from "@/adapters/java-api/JavaApiRaasAdapter";

// Função utilitária para buscar unidades
async function fetchUnidades(): Promise<Array<{ id: number; nome: string }>> {
  const resp = await fetch("http://localhost:8081/api/v1/unidades");
  if (!resp.ok) throw new Error("Falha ao buscar unidades");
  return resp.json();
}

// Interface local removida. Usaremos um tipo inline para o estado.

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function nomeMes(m: string | number | undefined): string {
  if (m == null) return "";
  if (typeof m === "number") return MESES[m - 1] ?? String(m);
  const n = Number(m);
  if (!Number.isNaN(n) && n >= 1 && n <= 12) return MESES[n - 1];
  return String(m);
}

function situacaoBadge(s: string) {
  const v = (s || "").toLowerCase();
  if (v.includes("gerado"))
    return <Badge className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-100">Arquivo Gerado</Badge>;
  if (v.includes("sem"))
    return <Badge className="bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-100">Sem Registros</Badge>;
  if (v.includes("pendente"))
    return <Badge variant="outline">Pendente</Badge>;
  return <Badge variant="outline">{s || "—"}</Badge>;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function RaasArquivos() {
  const [competencia, setCompetencia] = useState<string>("");
  const [situacao, setSituacao] = useState<string>("");
  const [unidade, setUnidade] = useState<string>("");
  const [unidades, setUnidades] = useState<Array<{ id: number; nome: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [arquivos, setArquivos] = useState<Array<{
    id: number;
    mes: number;
    ano: number;
    dataGeracao: string;
    codigoEmpresa: string | null;
    nomeEmpresa: string | null;
    path: string;
    status: string;
    totalFolha: number;
  }>>([]);
  const [carregado, setCarregado] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.max(1, Math.ceil(arquivos.length / pageSize));
  const pageItems = useMemo(() => {
    const start = page * pageSize;
    return arquivos.slice(start, start + pageSize);
  }, [arquivos, page, pageSize]);

  async function carregar(filtrar: boolean = false) {
    setLoading(true);
    try {
      let params: Record<string, string | null> = {};
      if (filtrar) {
        let mes: string | undefined = undefined;
        let ano: string | undefined = undefined;
        if (competencia.match(/^\d{2}\/\d{4}$/)) {
          [mes, ano] = competencia.split("/");
        }
        params.mes = mes || null;
        params.ano = ano || null;
        params.codigoEmpresa = unidade || null;
        params.situacao = situacao || null;
        // Se for busca padrão (sem filtro), envia tudo null
        if (!filtrar) {
          params = { mes: null, ano: null, codigoEmpresa: null, situacao: null };
        }
      }
      const resp = await JavaApiRaasAdapter.listarArquivosRaas(params);
      const mapped = resp.map((r, i) => ({
        id: r.id ?? i,
        mes: r.mes,
        ano: r.ano,
        dataGeracao: r.data_geracao,
        codigoEmpresa: r.codigo_empresa,
        nomeEmpresa: r.nome_empresa,
        path: r.path,
        status: r.status,
        totalFolha: r.total_folha,
      }));
      setArquivos(mapped);
      setTotalElements(mapped.length);
      setPage(0);
      setCarregado(true);
    } catch (err) {
      console.error(err);
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message?: string }).message) : "Falha ao carregar arquivos do RAAS.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  // Carregar unidades e arquivos ao montar
  useEffect(() => {
    fetchUnidades()
      .then(setUnidades)
      .catch(() => setUnidades([]));
    carregar(false); // Carrega arquivos ao abrir a aba
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileArchive className="h-5 w-5 text-primary" />
          Gerar Arquivo do RAAS
        </h2>
        <p className="text-sm text-muted-foreground">
          Unidade Saúde / RAAS / Processo / Gerar Arquivo do RAAS
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Busca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="competencia">Competência</Label>
              <Input
                id="competencia"
                placeholder="MM/AAAA"
                value={competencia}
                onChange={(e) => setCompetencia(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Situação</Label>
              <Select
                value={situacao || "todos"}
                onValueChange={(v) => setSituacao(v === "todos" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="3">Arquivo Gerado</SelectItem>
                  <SelectItem value="6">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="unidade">Unidade</Label>
              <Select
                value={unidade || "todas"}
                onValueChange={(v) => setUnidade(v === "todas" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {unidades.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>{u.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Button
              onClick={() => carregar(true)}
              disabled={loading}
              className="gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Procurar
            </Button>
          </div>
        </CardContent>
      </Card>

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
              {!loading && carregado && pageItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground italic">
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                pageItems.map((a) => (
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
                    <TableCell>
                      {a.status === "3"
                        ? "Arquivo Gerado"
                        : a.status === "6"
                        ? "Cancelados"
                        : a.status || "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{a.totalFolha.toLocaleString("pt-BR")}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginação */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setPage(0)}
          disabled={loading || page === 0}
          title="Primeira página"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={loading || page === 0}
          title="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-2 tabular-nums">
          {page + 1} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={loading || page >= totalPages - 1}
          title="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setPage(totalPages - 1)}
          disabled={loading || page >= totalPages - 1}
          title="Última página"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => {
            setPageSize(Number(v));
            setPage(0);
          }}
        >
          <SelectTrigger className="h-8 w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground ml-2">
          Total de itens: {(totalElements || arquivos.length).toLocaleString("pt-BR")}
        </span>
      </div>
    </div>
  );
}
