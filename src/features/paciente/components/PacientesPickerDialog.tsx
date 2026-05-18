import type { PacienteResumoResponse } from "@/features/paciente/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  pacientes: PacienteResumoResponse[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: number) => void;
}

export function PacientesPickerDialog({ pacientes, open, onOpenChange, onSelect }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Selecione um paciente ({pacientes.length} resultados)</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-border">
          {pacientes.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="w-full text-left py-3 px-2 hover:bg-accent rounded-md transition-colors"
            >
              <div className="font-medium text-foreground">{p.nome}</div>
              <div className="text-xs text-muted-foreground mt-1 flex gap-4">
                <span>CPF: {p.cpf ?? "\u2014"}</span>
                <span>Nasc.: {p.dataNascimento ?? "\u2014"}</span>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
