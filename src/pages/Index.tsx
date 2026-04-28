import { useState } from "react";
import { Paciente, PacienteResumo } from "@/domain/models";
import { usePacienteSearch } from "../ui/hooks/usePacienteSearch";
import { usePaciente } from "../ui/hooks/usePaciente";
import { useVacinas } from "../ui/hooks/useVacinas";
import { useProntuario } from "../ui/hooks/useProntuario";
import { gerarProntuarioPdf } from "@/lib/prontuarioPdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PacienteDados } from "@/components/PacienteDados";
import { PacienteHeaderCard } from "@/components/PacienteHeaderCard";
import { ProntuarioAtendimentos } from "@/components/ProntuarioAtendimentos";
import { VacinasTable } from "@/components/VacinasTable";
import { VacinaDetalheSheet } from "@/components/VacinaDetalheSheet";
import { PacientesPickerDialog } from "@/components/PacientesPickerDialog";
import { Search, Loader2, Syringe, FileDown } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [query, setQuery] = useState("");

  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [picker, setPicker] = useState<PacienteResumo[] | null>(null);
  const [selectedVacina, setSelectedVacina] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const pacienteSearch = usePacienteSearch();
  const paciente = usePaciente(pacienteId ?? 0, !!pacienteId && !picker);
  const vacinas = useVacinas(pacienteId ?? 0, !!pacienteId && !picker);
  const prontuario = useProntuario();

  function htmlToText(html: string | null | undefined): string {
    if (!html) return "";
    // Decodifica entidades e remove tags HTML preservando quebras de linha
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

  async function handleGerarProntuario() {
    if (!paciente.data) return;
    try {
      const res = await fetch(`http://localhost:8083/api/prontuario/${paciente.data.id}`);
      if (!res.ok) throw new Error("Erro ao buscar registros do prontuário");
      const data = await res.json();
      console.log("Resposta da API:", data);

      const p = data.paciente ?? {};
      const end = p.endereco ?? null;

      // Mapeia paciente para o modelo do frontend
      const pacientePdf = {
        id: p.id,
        nome: p.nome,
        cpf: p.cpf ?? null,
        sexo: p.sexo ?? null,
        nomeMae: p.nome_mae ?? null,
        nomePai: p.nome_pai ?? null,
        dataNascimento: p.data_nascimento ?? null,
        telefone: p.telefone ?? null,
        idade: "",
        endereco: end
          ? {
              keyword: end.keyword ?? null,
              tipoLogradouro: end.tipo_logradouro ?? null,
              logradouro: end.logradouro ?? null,
              complemento: end.complemento ?? null,
              numero: end.numero ?? null,
              cep: end.cep ?? null,
              bairro: end.bairro ?? null,
              cidadeId: end.cidade_id ?? null,
              cidade: end.cidade ?? null,
              uf: end.uf ?? null,
            }
          : null,
      };

      // Novo formato: atendimentos[] com registros[] aninhados.
      // Achatamos cada registro em ProntuarioRegistro do PDF.
      const atendimentos: any[] = Array.isArray(data.atendimentos) ? data.atendimentos : [];
      const registrosPdf = atendimentos.flatMap((a: any) => {
        const unidadeNome = a?.unidade?.nome ?? "";
        const unidadeTel = a?.unidade?.telefone ? ` (${a.unidade.telefone})` : "";
        const unidadeStr = `${unidadeNome}${unidadeTel}`.trim();
        const prof = a?.profissional ?? {};
        const profStr = [
          prof.nome,
          prof.tipo_conselho && prof.registro ? `${prof.tipo_conselho}: ${prof.registro}` : null,
          prof.cbo ? `CBO: (${prof.cbo})${prof.cbo_descricao ? " " + prof.cbo_descricao : ""}` : null,
        ]
          .filter(Boolean)
          .join("   ");
        const tipoAtend = a?.tipo_atendimento ?? "";
        const numAtend = a?.numero_atendimento ? `Nº ${a.numero_atendimento}` : "";
        const classRisco = a?.classificacao_risco ?? null;
        const dataChegada = a?.data_chegada ?? "";

        const registros: any[] = Array.isArray(a?.registros) ? a.registros : [];
        if (registros.length === 0) {
          return [
            {
              dataRegistro: dataChegada,
              profissional: profStr,
              unidade: unidadeStr,
              tipoRegistro: [tipoAtend, numAtend].filter(Boolean).join(" - "),
              classificacaoRisco: classRisco,
              conteudo: "(Sem registros clínicos)",
            },
          ];
        }
        return registros.map((r: any) => {
          const partes: string[] = [];
          const av = htmlToText(r?.conteudo?.avaliacao);
          const ev = htmlToText(r?.conteudo?.evolucao);
          const ex = htmlToText(r?.conteudo?.exame);
          if (av) partes.push(`Avaliação:\n${av}`);
          if (ev) partes.push(`Evolução:\n${ev}`);
          if (ex) partes.push(`Exame:\n${ex}`);
          const conteudo = partes.join("\n\n") || "(Sem conteúdo)";
          const tipo = [r?.tipo, tipoAtend, numAtend].filter(Boolean).join(" - ");
          return {
            dataRegistro: r?.data ?? dataChegada,
            profissional: profStr,
            unidade: unidadeStr,
            tipoRegistro: tipo,
            classificacaoRisco: classRisco,
            conteudo,
          };
        });
      });

      console.info("[Prontuario] atendimentos:", atendimentos.length, "registros achatados:", registrosPdf.length);

      await gerarProntuarioPdf(pacientePdf, registrosPdf);
      if (!registrosPdf.length) {
        toast.warning("Prontuário gerado, mas sem atendimentos retornados pela API.");
      } else {
        toast.success(`Prontuário gerado (${registrosPdf.length} registros).`);
      }
    } catch (err) {
      toast.error("Falha ao gerar PDF do prontuário.");
      console.error(err);
    }
  }

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    setPicker(null);
    setPacienteId(null);
    pacienteSearch.mutate(query.trim(), {
      onSuccess: (res) => {
        if (res.tipo === "paciente") {
          setPacienteId(res.paciente.id);
        } else {
          if (res.pacientes.length === 0) {
            toast.info("Nenhum paciente encontrado.");
          } else if (res.pacientes.length === 1) {
            setPacienteId(res.pacientes[0].id);
          } else {
            setPicker(res.pacientes);
          }
        }
      },
      onError: (e: unknown) => {
        if (e && typeof e === 'object' && 'message' in e) {
          toast.error((e as { message?: string }).message || "Erro na busca");
        } else {
          toast.error("Erro na busca");
        }
      },
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container py-5 flex items-center gap-3">
          <div className="bg-primary text-primary-foreground rounded-lg p-2">
            <Syringe className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Prontuário do Paciente</h1>
            <p className="text-xs text-muted-foreground">Consulta de pacientes e histórico vacinal</p>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-3xl flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por Nome ou CPF..."
              className="pl-10 h-11"
            />
          </div>
          <Button type="submit" disabled={pacienteSearch.isPending} className="h-11 px-6">
            {pacienteSearch.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
          </Button>
          {paciente.data && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleGerarProntuario}
              disabled={prontuario.isPending}
              className="h-11 px-5"
            >
              {prontuario.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <FileDown className="h-4 w-4" />
                  Gerar Prontuário
                </>
              )}
            </Button>
          )}
        </form>

        {!pacienteId && !pacienteSearch.isPending && (
          <div className="text-center py-20 text-muted-foreground">
            <Syringe className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Digite um nome ou CPF para iniciar a consulta.</p>
            <p className="text-xs mt-2">Ex.: <code className="bg-muted px-2 py-0.5 rounded">ALEXANDRE</code> ou <code className="bg-muted px-2 py-0.5 rounded">12345678901</code></p>
          </div>
        )}

        {paciente.data && (
          <div className="space-y-4">
            <PacienteHeaderCard paciente={paciente.data} />
            <Tabs defaultValue="dados" className="space-y-4">
              <TabsList>
                <TabsTrigger value="dados">Dados do Paciente</TabsTrigger>
                <TabsTrigger value="vacinas">Vacinas ({vacinas.data?.length ?? 0})</TabsTrigger>
                <TabsTrigger value="prontuarios">Prontuários de Atendimentos</TabsTrigger>
              </TabsList>
              <TabsContent value="dados">
                <PacienteDados paciente={paciente.data} />
              </TabsContent>
              <TabsContent value="vacinas">
                <VacinasTable
                  vacinas={vacinas.data || []}
                  selectedId={selectedVacina ?? undefined}
                  onSelect={(id) => { setSelectedVacina(id); setSheetOpen(true); }}
                />
              </TabsContent>
              <TabsContent value="prontuarios">
                <ProntuarioAtendimentos />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {picker && (
        <PacientesPickerDialog
          pacientes={picker}
          open={!!picker}
          onOpenChange={(o) => !o && setPicker(null)}
          onSelect={(id) => {
            setPicker(null);
            setPacienteId(id);
          }}
        />
      )}

      <VacinaDetalheSheet
        idAplicacao={selectedVacina}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
};

export default Index;
