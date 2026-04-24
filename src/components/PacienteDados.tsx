import { Paciente } from "@/lib/api";
import { Card } from "@/components/ui/card";

interface Props { paciente: Paciente }

function fmtDateBR(d: string | null) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return d;
  return `${day}/${m}/${y}`;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground min-h-5 border-b border-border/60 pb-1">
        {value || "—"}
      </span>
    </div>
  );
}

export function PacienteDados({ paciente }: Props) {
  const e = paciente.endereco;
  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">Dados do Paciente</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2"><Field label="Paciente" value={paciente.nome} /></div>
          <Field label="Idade" value={paciente.idade} />
          <Field label="CPF" value={paciente.cpf} />
          <Field label="Sexo" value={paciente.sexo} />
          <Field label="Data de Nascimento" value={fmtDateBR(paciente.dataNascimento)} />
          <Field label="Nome da Mãe" value={paciente.nomeMae} />
          <Field label="Nome do Pai" value={paciente.nomePai} />
          <Field label="Telefone" value={paciente.telefone} />
        </div>
      </Card>

      {e && (
        <Card className="p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-3">
              <Field label="Logradouro" value={`${e.tipoLogradouro ?? ""} ${e.logradouro ?? ""}`.trim()} />
            </div>
            <div className="md:col-span-1">
              <Field label="Número" value={e.numero} />
            </div>
            <div className="md:col-span-2">
              <Field label="Bairro" value={e.bairro} />
            </div>
            <div className="md:col-span-2">
              <Field label="Complemento" value={e.complemento} />
            </div>
            <div className="md:col-span-1">
              <Field label="CEP" value={e.cep} />
            </div>
            <div className="md:col-span-2">
              <Field label="Cidade" value={e.cidade} />
            </div>
            <div className="md:col-span-1">
              <Field label="UF" value={e.uf} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
