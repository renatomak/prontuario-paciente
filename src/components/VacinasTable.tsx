import { VacinaResumo } from "@/lib/api";
import type { Paciente } from "@/domain/models";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, FileDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { imprimirCartaoVacinacao } from "@/lib/CartaoVacinaPrint";
import { getLogoBase64 } from "@/lib/logoGoiania";
import { toast } from "sonner";

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

export function VacinasTable({ vacinas, onSelect, selectedId }: Props) {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/70 text-secondary-foreground">
            <tr>
              <th className="w-12 px-4 py-3"></th>
              <th className="text-left px-4 py-3 font-semibold">Data Aplicação</th>
              <th className="text-left px-4 py-3 font-semibold">Vacina</th>
              <th className="text-left px-4 py-3 font-semibold">Dose</th>
              <th className="text-left px-4 py-3 font-semibold">Estratégia</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {vacinas.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Nenhuma vacina registrada.</td></tr>
            )}
            <TooltipProvider delayDuration={150}>
              {vacinas.map((v) => (
                <tr
                  key={v.idAplicacao}
                  onClick={() => onSelect(v.idAplicacao)}
                  className={`group border-t border-border/60 cursor-pointer transition-colors hover:bg-accent/60 ${
                    selectedId === v.idAplicacao ? "bg-accent" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label="Ver detalhes da vacina"
                          onClick={(e) => { e.stopPropagation(); onSelect(v.idAplicacao); }}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors group-hover:text-primary"
                        >
                          <Search className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Ver detalhes</TooltipContent>
                    </Tooltip>
                  </td>
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
            </TooltipProvider>
          </tbody>
        </table>
      </div>
    </Card>
    </div>
  );
}
