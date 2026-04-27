import { useState, useMemo } from "react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, FileText, MapPin, User, Calendar, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import ProntuarioPDFMock from "@/lib/ProntuarioPDFMock";
import { getLogoBase64 } from "@/lib/logoGoiania";
import {
  patientMockData,
  type MockProntuario,
  type MockRegistro,
  type MockRegistroConteudo,
} from "@/data/patientMock";

// CPF fixo usado internamente nesta aba para fins de teste do novo fluxo de PDF.
const CPF_FIXO_TESTE = "121.694.411-31";

interface Props {
  data?: MockProntuario;
}

function renderConteudo(c: MockRegistroConteudo): string[] {
  const linhas: string[] = [];
  if (c.subtitulo) linhas.push(c.subtitulo);
  if (c.motivoConsulta) linhas.push(`Motivo: ${c.motivoConsulta}`);
  if (c.historico) linhas.push(`Histórico: ${c.historico}`);
  if (c.evolucao) linhas.push(c.evolucao);
  if (c.observacao) linhas.push(`Obs.: ${c.observacao}`);
  const antro: string[] = [];
  if (c.peso != null) antro.push(`Peso: ${c.peso}kg`);
  if (c.altura != null) antro.push(`Altura: ${c.altura}cm`);
  if (c.perimetroCefalico != null) antro.push(`PC: ${c.perimetroCefalico}cm`);
  if (antro.length) linhas.push(antro.join("  |  "));
  if (c.cid?.codigo) linhas.push(`CID: ${c.cid.codigo} - ${c.cid.descricao ?? ""}`);
  if (c.procedimentos?.length) linhas.push(`Procedimentos: ${c.procedimentos.join("; ")}`);
  if (c.exames?.itens?.length) {
    linhas.push(`Exames (${c.exames.grupo ?? ""}): ${c.exames.itens.join("; ")}`);
  }
  return linhas;
}

export function ProntuarioAtendimentos({ data: _data }: Props = {}) {
  const data: MockProntuario = useMemo(
    () => ({
      ...patientMockData,
      paciente: { ...patientMockData.paciente, cpf: CPF_FIXO_TESTE },
    }),
    [],
  );
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    try {
      setDownloading(true);
      const logoBase64 = await getLogoBase64();
      const blob = await pdf(<ProntuarioPDFMock data={data} logoBase64={logoBase64} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cpfDigits = (data.paciente.cpf || "").replace(/\D/g, "");
      a.download = `prontuario_${cpfDigits || data.paciente.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF gerado com sucesso.");
    } catch (err) {
      console.error(err);
      toast.error("Falha ao gerar PDF.");
    } finally {
      setDownloading(false);
    }
  }

  const { paciente, atendimentos } = data;
  const totalRegistros = atendimentos.reduce((acc, a) => acc + (a.registros?.length ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Prontuário de Atendimentos
          </h2>
          <p className="text-sm text-muted-foreground">
            {atendimentos.length} atendimento{atendimentos.length === 1 ? "" : "s"} • {totalRegistros}{" "}
            registro{totalRegistros === 1 ? "" : "s"}
          </p>
        </div>
        <Button onClick={handleDownload} disabled={downloading} className="gap-2">
          {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Baixar PDF
        </Button>
      </div>

      <Card className="bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Paciente</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <Info label="Nome" value={paciente.nome} />
          <Info label="CPF" value={paciente.cpf} />
          <Info label="Dt. Nascimento" value={paciente.dataNascimento} />
          <Info label="Idade" value={paciente.idade} />
          <Info label="Mãe" value={paciente.mae} />
          <Info label="CNS" value={paciente.cns} />
        </CardContent>
      </Card>

      <div className="space-y-3">
        {atendimentos.length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-8">
            Nenhum atendimento registrado.
          </p>
        )}
        {atendimentos.map((a, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    {a.unidade}
                  </div>
                  {a.tipoAtendimento && (
                    <div className="text-xs text-muted-foreground">{a.tipoAtendimento}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {a.numeroAtendimento && (
                    <Badge variant="outline">Nº {a.numeroAtendimento}</Badge>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {a.chegada}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {a.registros?.map((r: MockRegistro, ri) => {
                const linhas = renderConteudo(r.conteudo);
                return (
                  <div key={ri} className="rounded-md border border-border/60 bg-card p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 text-xs">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{r.profissional?.nome}</span>
                        {r.profissional?.tipoRegistro && r.profissional?.registro && (
                          <span className="text-muted-foreground">
                            ({r.profissional.tipoRegistro} {r.profissional.registro})
                          </span>
                        )}
                        {r.profissional?.cboDescricao && (
                          <span className="text-muted-foreground inline-flex items-center gap-1">
                            <Stethoscope className="h-3 w-3" />
                            {r.profissional.cboDescricao}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{r.tipo}</Badge>
                        {r.conteudo.classificacaoRisco && (
                          <Badge variant="outline">{r.conteudo.classificacaoRisco}</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{r.dataRegistro}</span>
                      </div>
                    </div>
                    {linhas.length > 0 && (
                      <div className="space-y-1.5">
                        {linhas.map((l, li) => (
                          <p
                            key={li}
                            className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap"
                          >
                            {l}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="font-medium text-muted-foreground min-w-[110px]">{label}:</span>
      <span className="text-foreground">{value || "—"}</span>
    </div>
  );
}
