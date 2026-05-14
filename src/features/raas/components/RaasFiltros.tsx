import Button from "@/components/ui/button";
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

interface Unidade {
  id: number;
  nome: string;
}

export interface RaasFiltrosProps {
  competencia: string;
  situacao: string;
  unidade: string;
  listarUnidades: Unidade[];
  loading: boolean;
  onCompetenciaChange: (v: string) => void;
  onSituacaoChange: (v: string) => void;
  onUnidadeChange: (v: string) => void;
  onProcurar: () => void;
}

const SITUACOES = [
  { value: "3", label: "Arquivo Gerado" },
  { value: "6", label: "Cancelados" },
] as const;

const TODOS_VALUE = "todos";
const TODAS_VALUE = "todas";

export function RaasFiltros({
  competencia,
  situacao,
  unidade,
  listarUnidades: unidades = [],
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
          <CompetenciaField value={competencia} onChange={onCompetenciaChange} />
          <SituacaoField value={situacao} onChange={onSituacaoChange} />
          <UnidadeField value={unidade} unidades={unidades} onChange={onUnidadeChange} />
        </div>
        <ProcurarButton loading={loading} onClick={onProcurar} />
      </CardContent>
    </Card>
  );
}

function CompetenciaField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor="competencia">Competência</Label>
      <Input
        id="competencia"
        placeholder="MM/AAAA"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SituacaoField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label>Situação</Label>
      <Select
        value={value || TODOS_VALUE}
        onValueChange={(v) => onChange(v === TODOS_VALUE ? "" : v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODOS_VALUE}>Todos</SelectItem>
          {SITUACOES.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function UnidadeField({
  value,
  unidades,
  onChange,
}: {
  value: string;
  unidades: Unidade[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor="unidade">Unidade</Label>
      <Select
        value={value || TODAS_VALUE}
        onValueChange={(v) => onChange(v === TODAS_VALUE ? "" : v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODAS_VALUE}>Todas</SelectItem>
          {unidades.map((u) => (
            <SelectItem key={u.id} value={String(u.id)}>
              {u.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ProcurarButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <Button onClick={onClick} disabled={loading} className="gap-2">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
      Procurar
    </Button>
  );
}