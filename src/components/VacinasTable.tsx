import { VacinaResumo, Paciente } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  vacinas: VacinaResumo[];
  onSelect: (idAplicacao: number) => void;
  selectedId?: number;
  paciente?: Paciente | null;
}

function formatCpf(cpf: string | null | undefined) {
  if (!cpf) return "";
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function fmtDate(d: string) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export function VacinasTable({ vacinas, onSelect, selectedId, paciente }: Props) {
  return (
    <div className="space-y-4">
      {paciente && (
        <Card className="p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Nome</Label>
              <Input value={paciente.nome} readOnly className="bg-muted/50" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">CPF</Label>
              <Input value={formatCpf(paciente.cpf)} readOnly className="bg-muted/50" />
            </div>
          </div>
        </Card>
      )}
      <Card className="overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/70 text-secondary-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Data Aplicação</th>
              <th className="text-left px-4 py-3 font-semibold">Vacina</th>
              <th className="text-left px-4 py-3 font-semibold">Dose</th>
              <th className="text-left px-4 py-3 font-semibold">Estratégia</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {vacinas.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Nenhuma vacina registrada.</td></tr>
            )}
            {vacinas.map((v) => (
              <tr
                key={v.idAplicacao}
                onClick={() => onSelect(v.idAplicacao)}
                className={`border-t border-border/60 cursor-pointer transition-colors hover:bg-accent/60 ${
                  selectedId === v.idAplicacao ? "bg-accent" : ""
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">{fmtDate(v.dataAplicacao)}</td>
                <td className="px-4 py-3">{v.nomeVacina}</td>
                <td className="px-4 py-3">{v.dose}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-xs">{v.estrategia ?? "—"}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border-0">{v.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
