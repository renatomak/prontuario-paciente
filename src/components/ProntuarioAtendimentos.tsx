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

function htmlToText(html?: string | null): string {
  if (!html) return "";
  const withBreaks = html
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/\s*(p|div|li|tr|h[1-6])\s*>/gi, "\n")
    .replace(/<\s*li\s*[^>]*>/gi, "• ");
  const tmp = document.createElement("div");
  tmp.innerHTML = withBreaks;
  const text = tmp.textContent || tmp.innerText || "";
  return text
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

interface Bloco {
  label: string;
  texto: string;
}

function blocosConteudo(c: MockRegistroConteudo): Bloco[] {
  const out: Bloco[] = [];
  const av = htmlToText(c.avaliacao);
  const ev = htmlToText(c.evolucao);
  const ex = htmlToText(c.exame);
  if (av) out.push({ label: "Avaliação", texto: av });
  if (ev) out.push({ label: "Evolução", texto: ev });
  if (ex) out.push({ label: "Exame", texto: ex });
  return out;
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
  const enderecoStr = paciente.endereco
    ? [
        paciente.endereco.tipo_logradouro,
        paciente.endereco.logradouro,
        paciente.endereco.numero,
        paciente.endereco.bairro,
        paciente.endereco.cidade && `${paciente.endereco.cidade} - ${paciente.endereco.uf ?? ""}`,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

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
          <Info label="CPF" value={paciente.cpf ?? ""} />
          <Info label="Dt. Nascimento" value={paciente.data_nascimento ?? ""} />
          <Info label="Sexo" value={paciente.sexo ?? ""} />
          <Info label="Mãe" value={paciente.nome_mae ?? ""} />
          <Info label="Telefone" value={paciente.telefone ?? ""} />
          <Info label="Endereço" value={enderecoStr} />
        </CardContent>
      </Card>

      <div className="space-y-3">
        {atendimentos.length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-8">
            Nenhum atendimento registrado.
          </p>
        )}
        {atendimentos.map((a, idx) => {
          const prof = a.profissional;
          return (
            <Card key={idx}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-primary" />
                      {a.unidade?.nome}
                      {a.unidade?.telefone && (
                        <span className="text-xs text-muted-foreground">({a.unidade.telefone})</span>
                      )}
                    </div>
                    {a.tipo_atendimento && (
                      <div className="text-xs text-muted-foreground">{a.tipo_atendimento}</div>
                    )}
                    {prof?.nome && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        <User className="h-3.5 w-3.5" />
                        <span className="font-medium">{prof.nome}</span>
                        {prof.tipo_conselho && prof.registro && (
                          <span>({prof.tipo_conselho}: {prof.registro})</span>
                        )}
                        {prof.cbo_descricao && (
                          <span className="inline-flex items-center gap-1">
                            <Stethoscope className="h-3 w-3" />
                            {prof.cbo_descricao}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {a.numero_atendimento && (
                      <Badge variant="outline">Nº {a.numero_atendimento}</Badge>
                    )}
                    {a.classificacao_risco && (
                      <Badge variant="outline">{a.classificacao_risco}</Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {a.data_chegada}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {(a.registros ?? []).length === 0 && (
                  <p className="text-xs italic text-muted-foreground">(Sem registros clínicos)</p>
                )}
                {a.registros?.map((r: MockRegistro, ri) => {
                  const blocos = blocosConteudo(r.conteudo);
                  return (
                    <div key={ri} className="rounded-md border border-border/60 bg-card p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <Badge variant="secondary">{r.tipo}</Badge>
                        <span className="text-xs text-muted-foreground">{r.data}</span>
                      </div>
                      {blocos.length > 0 ? (
                        <div className="space-y-2">
                          {blocos.map((b, bi) => (
                            <div key={bi} className="space-y-0.5">
                              <p className="text-xs font-semibold text-muted-foreground">{b.label}</p>
                              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                {b.texto}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs italic text-muted-foreground">(Sem conteúdo)</p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
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
