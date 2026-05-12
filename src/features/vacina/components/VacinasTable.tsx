import { VacinaResumo } from "@/lib/api";
import type { Paciente } from "@/domain/models";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, FileDown, Syringe, RefreshCw, Calendar, Building2, User, FlaskConical } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { imprimirCartaoVacinacao } from "@/lib/CartaoVacinaPrint";
import { getLogoBase64 } from "@/lib/logoGoiania";
import { toast } from "sonner";
import { useMemo } from "react";

interface Props {
  vacinas: VacinaResumo[];
  onSelect: (idAplicacao: number) => void;
  selectedId?: number;
  paciente?: Paciente;
}

function fmtDate(d: string) {
  if (!d) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) return d;
  const isoMatch = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, y, m, day] = isoMatch;
    return `${day}/${m}/${y}`;
  }
  return d;
}

function getYear(d: string): string {
  if (!d) return "—";
  const iso = d.match(/^(\d{4})-/);
  if (iso) return iso[1];
  const br = d.match(/\/(\d{4})$/);
  if (br) return br[1];
  return "—";
}

function isAprazada(status: string): boolean {
  return /apraz/i.test(status);
}

function isReforco(dose: string): boolean {
  return /refor/i.test(dose);
}

function isUnica(dose: string): boolean {
  return /única|unica/i.test(dose);
}

export function VacinasTable({ vacinas, onSelect, selectedId, paciente }: Props) {
  async function handleGerarCartao() {
    if (!paciente) {
      toast.error("Dados do paciente indisponíveis para gerar o cartão.");
      return;
    }
    try {
      const logo = await getLogoBase64();
      imprimirCartaoVacinacao(paciente, vacinas, logo);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao gerar cartão de vacinação.";
      toast.error(msg);
    }
  }

  // Agrupa por ano (mantém ordem descendente vinda do backend)
  const grupos = useMemo(() => {
    const map = new Map<string, VacinaResumo[]>();
    vacinas.forEach((v) => {
      const ano = getYear(v.dataAplicacao);
      if (!map.has(ano)) map.set(ano, []);
      map.get(ano)!.push(v);
    });
    return Array.from(map.entries());
  }, [vacinas]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <div className="text-sm text-muted-foreground">
          {vacinas.length} {vacinas.length === 1 ? "registro" : "registros"} de imunização
        </div>
        <Button onClick={handleGerarCartao} disabled={!paciente} className="gap-2">
          <FileDown className="h-4 w-4" />
          Gerar Cartão de Vacinação
        </Button>
      </div>

      {vacinas.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          Nenhuma vacina registrada.
        </Card>
      )}

      <TooltipProvider delayDuration={150}>
        <div className="space-y-6">
          {grupos.map(([ano, lista]) => (
            <section key={ano} className="space-y-2">
              <div className="flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur py-1 z-10">
                <Calendar className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">{ano}</h3>
                <span className="text-xs text-muted-foreground">({lista.length})</span>
                <div className="flex-1 h-px bg-border ml-2" />
              </div>

              <div className="grid gap-2">
                {lista.map((v) => {
                  const aprazada = isAprazada(v.status);
                  const Icon = isReforco(v.dose) ? RefreshCw : Syringe;
                  return (
                    <Card
                      key={v.idAplicacao}
                      onClick={() => onSelect(v.idAplicacao)}
                      className={`group cursor-pointer transition-all hover:shadow-md hover:border-primary/40 border-l-4 ${
                        aprazada ? "border-l-amber-500" : "border-l-emerald-500"
                      } ${selectedId === v.idAplicacao ? "ring-2 ring-primary/40" : ""}`}
                    >
                      <div className="p-3 sm:p-4 flex items-start gap-3">
                        <div
                          className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                            aprazada
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                          aria-hidden
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div className="min-w-0">
                              <h4 className="font-semibold text-foreground leading-tight break-words">
                                {v.nomeVacina || "—"}
                              </h4>
                              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {fmtDate(v.dataAplicacao)}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  isUnica(v.dose)
                                    ? "border-primary/40 text-primary"
                                    : "border-border"
                                }`}
                              >
                                {v.dose || "—"}
                              </Badge>
                              <Badge
                                className={`text-xs border-0 ${
                                  aprazada
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                    : "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                }`}
                              >
                                {v.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <FlaskConical className="h-3 w-3 shrink-0" />
                              <span className="truncate" title={v.laboratorio ?? "--"}>
                                {v.laboratorio || "--"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Building2 className="h-3 w-3 shrink-0" />
                              <span className="truncate" title={v.estabelecimento ?? "--"}>
                                {v.estabelecimento || "--"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <User className="h-3 w-3 shrink-0" />
                              <span className="truncate" title={v.profissional ?? "--"}>
                                {v.profissional || "--"}
                              </span>
                            </div>
                          </div>

                          {v.estrategia && (
                            <div className="mt-1.5 text-[11px] text-muted-foreground">
                              Estratégia: <span className="text-foreground">{v.estrategia}</span>
                            </div>
                          )}
                        </div>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              aria-label="Ver detalhes da vacina"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelect(v.idAplicacao);
                              }}
                              className="shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              <Search className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Ver detalhes (lote, etc.)</TooltipContent>
                        </Tooltip>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
