import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

interface RaasArquivo {
  id: number;
  mes: string;
  ano: number;
  dataGeracao: string; // ISO ou dd/mm/yyyy
  unidade: string | null;
  situacao: "Arquivo Gerado" | "Sem Registros" | "Pendente";
  folhas: number;
}

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// Mock provisório enquanto o endpoint real não está disponível.
const MOCK_DATA: RaasArquivo[] = [
  { id: 1, mes: "Janeiro", ano: 2026, dataGeracao: "04/05/2026", unidade: null, situacao: "Arquivo Gerado", folhas: 2 },
  { id: 2, mes: "Maio", ano: 2026, dataGeracao: "04/05/2026", unidade: "CAPS AD3 NOROESTE", situacao: "Sem Registros", folhas: 0 },
  { id: 3, mes: "Novembro", ano: 2025, dataGeracao: "02/12/2025", unidade: null, situacao: "Arquivo Gerado", folhas: 994 },
  { id: 4, mes: "Outubro", ano: 2025, dataGeracao: "31/10/2025", unidade: null, situacao: "Arquivo Gerado", folhas: 1839 },
  { id: 5, mes: "Setembro", ano: 2025, dataGeracao: "03/10/2025", unidade: null, situacao: "Arquivo Gerado", folhas: 1894 },
  { id: 6, mes: "Agosto", ano: 2025, dataGeracao: "04/09/2025", unidade: null, situacao: "Arquivo Gerado", folhas: 1765 },
  { id: 7, mes: "Julho", ano: 2025, dataGeracao: "04/08/2025", unidade: null, situacao: "Arquivo Gerado", folhas: 1356 },
  { id: 8, mes: "Junho", ano: 2025, dataGeracao: "03/07/2025", unidade: null, situacao: "Arquivo Gerado", folhas: 1785 },
  { id: 9, mes: "Maio", ano: 2025, dataGeracao: "04/06/2025", unidade: null, situacao: "Arquivo Gerado", folhas: 1664 },
  { id: 10, mes: "Abril", ano: 2025, dataGeracao: "08/05/2025", unidade: null, situacao: "Arquivo Gerado", folhas: 1883 },
];

function situacaoBadge(s: RaasArquivo["situacao"]) {
  if (s === "Arquivo Gerado")
    return <Badge className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-100">Arquivo Gerado</Badge>;
  if (s === "Sem Registros")
    return <Badge className="bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-100">Sem Registros</Badge>;
  return <Badge variant="outline">Pendente</Badge>;
}

export function RaasArquivos() {
  const [competencia, setCompetencia] = useState<string>("");
  const [situacao, setSituacao] = useState<string>("todos");
  const [unidade, setUnidade] = useState<string>("todas");
  const [loading, setLoading] = useState(false);
  const [arquivos, setArquivos] = useState<RaasArquivo[]>([]);

  const unidades = useMemo(() => {
    const set = new Set<string>();
    MOCK_DATA.forEach((a) => a.unidade && set.add(a.unidade));
    return Array.from(set).sort();
  }, []);

  async function carregar() {
    setLoading(true);
    try {
      // TODO: substituir pelo endpoint real, ex.:
      // const res = await fetch(`${getApiBaseUrl()}/api/raas/arquivos?competencia=${competencia}&situacao=${situacao}&unidade=${unidade}`);
      await new Promise((r) => setTimeout(r, 250));
      let data = [...MOCK_DATA];
      if (competencia) {
        const [mm, yyyy] = competencia.split("/");
        if (mm && yyyy) {
          const mesNome = MESES[Number(mm) - 1];
          data = data.filter((d) => d.mes === mesNome && d.ano === Number(yyyy));
        }
      }
      if (situacao !== "todos") {
        data = data.filter((d) => d.situacao === situacao);
      }
      if (unidade !== "todas") {
        data = data.filter((d) => d.unidade === unidade);
      }
      setArquivos(data);
    } catch (err) {
      console.error(err);
      toast.error("Falha ao carregar arquivos do RAAS.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
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
              <Select value={situacao} onValueChange={setSituacao}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Arquivo Gerado">Arquivo Gerado</SelectItem>
                  <SelectItem value="Sem Registros">Sem Registros</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Unidade</Label>
              <Select value={unidade} onValueChange={setUnidade}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {unidades.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Button onClick={carregar} disabled={loading} className="gap-2">
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
              {!loading && arquivos.length === 0 && (
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
                    <TableCell className="font-medium">{a.mes}</TableCell>
                    <TableCell>{a.ano}</TableCell>
                    <TableCell>{a.dataGeracao}</TableCell>
                    <TableCell className="text-muted-foreground">{a.unidade ?? "—"}</TableCell>
                    <TableCell>{situacaoBadge(a.situacao)}</TableCell>
                    <TableCell className="text-right tabular-nums">{a.folhas.toLocaleString("pt-BR")}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Total de itens: {arquivos.length.toLocaleString("pt-BR")}
      </p>
    </div>
  );
}
