import { useObterVacinaDetalhe as useVacinaDetalhe } from "../hooks";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { FieldDisplay } from "@/components/FieldDisplay";

interface Props {
  idAplicacao: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function YesNo({ v }: { v: boolean }) {
  return <span>{v ? "Sim" : "Nao"}</span>;
}

export function VacinaDetalheSheet({ idAplicacao, open, onOpenChange }: Props) {
  const { data: detalhe, isLoading: loading } = useVacinaDetalhe(idAplicacao ?? 0, open && !!idAplicacao);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-primary">Detalhes da Aplicacao</SheetTitle>
        </SheetHeader>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {detalhe && (
          <div className="space-y-6 mt-6">
            <section>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Dados da Aplicacao</h4>
              <div className="grid grid-cols-2 gap-4">
                <FieldDisplay label="Nr Atendimento" value={detalhe.nrAtendimento} labelClassName="text-[11px]" />
                <FieldDisplay label="Status" value={detalhe.status} labelClassName="text-[11px]" />
                <FieldDisplay label="Vacina" value={detalhe.nomeVacina} labelClassName="text-[11px]" />
                <FieldDisplay label="Dose" value={detalhe.dose} labelClassName="text-[11px]" />
                <FieldDisplay label="Estrategia" value={detalhe.estrategia} labelClassName="text-[11px]" />
                <FieldDisplay label="Data de Aplicacao" value={detalhe.dataAplicacao} labelClassName="text-[11px]" />
                <FieldDisplay label="Lote" value={detalhe.lote} labelClassName="text-[11px]" />
                <FieldDisplay label="Validade do Lote" value={detalhe.validadeLote} labelClassName="text-[11px]" />
                <FieldDisplay label="Via Administracao" value={detalhe.viaAdministracao} labelClassName="text-[11px]" />
                <FieldDisplay label="Local Aplicacao" value={detalhe.localAplicacao} labelClassName="text-[11px]" />
              </div>
            </section>

            <section>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Atendimento</h4>
              <div className="grid grid-cols-2 gap-4">
                <FieldDisplay label="Local Atendimento" value={detalhe.localAtendimento} labelClassName="text-[11px]" />
                <FieldDisplay label="Turno" value={detalhe.turno} labelClassName="text-[11px]" />
                <FieldDisplay label="Grupo de Atendimento" value={detalhe.grupoAtendimento} labelClassName="text-[11px]" />
                <FieldDisplay label="Gestante" value={<YesNo v={detalhe.gestante} />} labelClassName="text-[11px]" />
                <FieldDisplay label="Puerpera" value={<YesNo v={detalhe.puerpera} />} labelClassName="text-[11px]" />
                <FieldDisplay label="Historico" value={<YesNo v={detalhe.historico} />} labelClassName="text-[11px]" />
                <FieldDisplay label="Fora de Esquema" value={<YesNo v={detalhe.foraEsquema} />} labelClassName="text-[11px]" />
                <FieldDisplay label="Viajante" value={<YesNo v={detalhe.viajante} />} labelClassName="text-[11px]" />
                <FieldDisplay label="Novo Frasco" value={<YesNo v={detalhe.novoFrasco} />} labelClassName="text-[11px]" />
              </div>
            </section>

            <section>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Fabricante</h4>
              <div className="grid grid-cols-2 gap-4">
                <FieldDisplay label="Laboratorio" value={detalhe.fabricanteNome} labelClassName="text-[11px]" />
                <FieldDisplay label="CNPJ" value={detalhe.fabricanteCnpj} labelClassName="text-[11px]" />
              </div>
            </section>

            <section>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Profissional & Unidade</h4>
              <div className="grid grid-cols-2 gap-4">
                <FieldDisplay label="Profissional" value={detalhe.profissionalNome} labelClassName="text-[11px]" />
                <FieldDisplay label="Conselho" value={`${detalhe.profissionalConselho ?? ""} ${detalhe.profissionalRegistro ?? ""}`.trim()} labelClassName="text-[11px]" />
                <FieldDisplay label="CNS" value={detalhe.profissionalCns} labelClassName="text-[11px]" />
                <FieldDisplay label="Unidade" value={detalhe.unidadeNome} labelClassName="text-[11px]" />
                <FieldDisplay label="CNES" value={detalhe.unidadeCnes} labelClassName="text-[11px]" />
              </div>
            </section>

            <section>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">RNDS</h4>
              <div className="grid grid-cols-2 gap-4">
                <FieldDisplay label="Situacao" value={detalhe.rndsSituacao} labelClassName="text-[11px]" />
                <FieldDisplay label="UUID" value={detalhe.rndsUuid} labelClassName="text-[11px]" />
              </div>
            </section>

            {detalhe.observacao && (
              <section>
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Observacao</h4>
                <p className="text-sm">{detalhe.observacao}</p>
              </section>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
