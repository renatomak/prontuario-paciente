import type { PacienteResponse } from "@/features/paciente/port/schemas";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  paciente: PacienteResponse;
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
          <Input value={paciente.cpf ?? ""} readOnly className="bg-muted/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Data de Nascimento</Label>
          <Input value={paciente.dataNascimento ?? ""} readOnly className="bg-muted/50" />
        </div>
      </div>
    </Card>
  );
}
