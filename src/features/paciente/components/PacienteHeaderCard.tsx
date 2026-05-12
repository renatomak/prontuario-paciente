import { Paciente } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  paciente: Paciente;
}

function formatCpf(cpf: string | null | undefined) {
  if (!cpf) return "";
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function fmtDate(d: string | null | undefined) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return d;
  return `${day}/${m}/${y}`;
}

export function PacienteHeaderCard({ paciente }: Props) {
  return (
    <Card className="p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5 md:col-span-1">
          <Label className="text-xs text-muted-foreground">Nome</Label>
          <Input value={paciente.nome} readOnly className="bg-muted/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">CPF</Label>
          <Input value={formatCpf(paciente.cpf)} readOnly className="bg-muted/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Data de Nascimento</Label>
          <Input value={fmtDate(paciente.dataNascimento)} readOnly className="bg-muted/50" />
        </div>
      </div>
    </Card>
  );
}
