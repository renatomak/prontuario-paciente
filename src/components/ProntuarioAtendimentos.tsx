import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, FileText, MapPin, User, Calendar } from "lucide-react";
import { toast } from "sonner";
import ProntuarioPDFMock from "@/lib/ProntuarioPDFMock";
import { getLogoBase64 } from "@/lib/logoGoiania";
import { patientMockData, type MockProntuario } from "@/data/patientMock";

// CPF fixo usado internamente nesta aba para fins de teste do novo fluxo de PDF.
// Independe do CPF buscado no fluxo principal.
const CPF_FIXO_TESTE = "121.694.411-31";

interface Props {
  data?: MockProntuario;
}

export function ProntuarioAtendimentos({ data: _data }: Props = {}) {
  // Sempre força o uso do mock referente ao CPF de teste, ignorando qualquer dado externo.
  const data: MockProntuario = {
    ...patientMockData,
    paciente: { ...patientMockData.paciente, cpf: CPF_FIXO_TESTE },
  };
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    try {
      setDownloading(true);
      const logoBase64 = await getLogoBase64();
      const blob = await pdf(<ProntuarioPDF data={data} logoBase64={logoBase64} />).toBlob();
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Prontuário de Atendimentos
          </h2>
          <p className="text-sm text-muted-foreground">
            {atendimentos.length} atendimento{atendimentos.length === 1 ? "" : "s"} registrado
            {atendimentos.length === 1 ? "" : "s"}
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
                  {a.profissional && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      {a.profissional}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {a.tipoRegistro && <Badge variant="secondary">{a.tipoRegistro}</Badge>}
                  {a.classificacaoRisco && <Badge variant="outline">{a.classificacaoRisco}</Badge>}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {a.chegada}
                  </div>
                </div>
              </div>
            </CardHeader>
            {a.conteudo && (
              <CardContent className="pt-0">
                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {a.conteudo}
                </p>
              </CardContent>
            )}
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
