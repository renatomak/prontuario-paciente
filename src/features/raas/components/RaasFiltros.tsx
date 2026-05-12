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
import { Loader2, Search } from "lucide-react";

export interface RaasFiltrosProps {
  competencia: string;
  situacao: string;
  unidade: string;
  unidades: Array<{ id: number; nome: string }>;
  loading: boolean;
  onCompetenciaChange: (v: string) => void;
  onSituacaoChange: (v: string) => void;
  onUnidadeChange: (v: string) => void;
  onProcurar: () => void;
}

export function RaasFiltros({
  competencia,
  situacao,
  unidade,
  unidades,
  loading,
  onCompetenciaChange,
  onSituacaoChange,
  onUnidadeChange,
  onProcurar,
}: RaasFiltrosProps) {
  return (
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
              onChange={(e) => onCompetenciaChange(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Situação</Label>
            <Select
              value={situacao || "todos"}
              onValueChange={(v) => onSituacaoChange(v === "todos" ? "" : v)}
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
              onValueChange={(v) => onUnidadeChange(v === "todas" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {unidades.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Button onClick={onProcurar} disabled={loading} className="gap-2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Procurar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
