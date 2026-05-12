import { useObterVacinaDetalhe as useVacinaDetalhe } from "@/features/vacina/hooks/useObterVacinaDetalhe";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";

interface Props {
  idAplicacao: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground min-h-5 border-b border-border/60 pb-1">
        {value || "\u2014"}
      </span>
    </div>
  );
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
                <Field label="Nr Atendimento" value={detalhe.nrAtendimento} />
                <Field label="Status" value={detalhe.status} />
                <Field label="Vacina" value={detalhe.nomeVacina} />
                <Field label="Dose" value={detalhe.dose} />
                <Field label="Estrategia" value={detalhe.estrategia} />
                <Field label="Data de Aplicacao" value={detalhe.dataAplicacao} />
                <Field label="Lote" value={detalhe.lote} />
                <Field label="Validade do Lote" value={detalhe.validadeLote} />
                <Field label="Via Administracao" value={detalhe.viaAdministracao} />
                <Field label="Local Aplicacao" value={detalhe.localAplicacao} />
              </div>
            </section>

            <section>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Atendimento</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Local Atendimento" value={detalhe.localAtendimento} />
                <Field label="Turno" value={detalhe.turno} />
                <Field label="Grupo de Atendimento" value={detalhe.grupoAtendimento} />
                <Field label="Gestante" value={<YesNo v={detalhe.gestante} />} />
                <Field label="Puerpera" value={<YesNo v={detalhe.puerpera} />} />
                <Field label="Historico" value={<YesNo v={detalhe.historico} />} />
                <Field label="Fora de Esquema" value={<YesNo v={detalhe.foraEsquema} />} />
                <Field label="Viajante" value={<YesNo v={detalhe.viajante} />} />
                <Field label="Novo Frasco" value={<YesNo v={detalhe.novoFrasco} />} />
              </div>
            </section>

            <section>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Fabricante</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Laboratorio" value={detalhe.fabricanteNome} />
                <Field label="CNPJ" value={detalhe.fabricanteCnpj} />
              </div>
            </section>

            <section>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Profissional & Unidade</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Profissional" value={detalhe.profissionalNome} />
                <Field label="Conselho" value={`${detalhe.profissionalConselho ?? ""} ${detalhe.profissionalRegistro ?? ""}`.trim()} />
                <Field label="CNS" value={detalhe.profissionalCns} />
                <Field label="Unidade" value={detalhe.unidadeNome} />
                <Field label="CNES" value={detalhe.unidadeCnes} />
              </div>
            </section>

            <section>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">RNDS</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Situacao" value={detalhe.rndsSituacao} />
                <Field label="UUID" value={detalhe.rndsUuid} />
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
