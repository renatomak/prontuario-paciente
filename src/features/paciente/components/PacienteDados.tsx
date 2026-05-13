import type { PacienteResponse } from "@/features/paciente/port/schemas";
import { Card } from "@/components/ui/card";
import { FieldDisplay } from "@/components/FieldDisplay";

interface Props { paciente: PacienteResponse }

export function PacienteDados({ paciente }: Props) {
  const e = paciente.endereco;
  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">Dados do Paciente</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2"><FieldDisplay label="Paciente" value={paciente.nome} /></div>
          <FieldDisplay label="Idade" value={paciente.idade} />
          <FieldDisplay label="CPF" value={paciente.cpf} />
          <FieldDisplay label="Sexo" value={paciente.sexo} />
          <FieldDisplay label="Data de Nascimento" value={paciente.dataNascimento} />
          <FieldDisplay label="Nome da Mae" value={paciente.nomeMae} />
          <FieldDisplay label="Nome do Pai" value={paciente.nomePai} />
          <FieldDisplay label="Telefone" value={paciente.telefone} />
        </div>
      </Card>

      {e && (
        <Card className="p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">Endereco</h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-3">
              <FieldDisplay label="Logradouro" value={`${e.tipoLogradouro ?? ""} ${e.logradouro ?? ""}`.trim()} />
            </div>
            <div className="md:col-span-1">
              <FieldDisplay label="Numero" value={e.numero} />
            </div>
            <div className="md:col-span-2">
              <FieldDisplay label="Bairro" value={e.bairro} />
            </div>
            <div className="md:col-span-2">
              <FieldDisplay label="Complemento" value={e.complemento} />
            </div>
            <div className="md:col-span-1">
              <FieldDisplay label="CEP" value={e.cep} />
            </div>
            <div className="md:col-span-2">
              <FieldDisplay label="Cidade" value={e.cidade} />
            </div>
            <div className="md:col-span-1">
              <FieldDisplay label="UF" value={e.uf} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
