import { useState } from "react";
import { Paciente, PacienteResumo } from "@/domain/models";
import { usePacienteSearch } from "../ui/hooks/usePacienteSearch";
import { usePaciente } from "../ui/hooks/usePaciente";
import { useVacinas } from "../ui/hooks/useVacinas";
import { useProntuario } from "../ui/hooks/useProntuario";
// import { gerarProntuarioPdf } from "@/lib/prontuarioPdf";
// import { fetchProntuarioByPacienteId } from "@/lib/prontuarioApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PacienteDados } from "@/components/PacienteDados";
import { PacienteHeaderCard } from "@/components/PacienteHeaderCard";
import { ProntuarioAtendimentos } from "@/components/ProntuarioAtendimentos";
import { RaasArquivos } from "@/components/RaasArquivos";
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

  // Removido: função htmlToText usada apenas para PDF

  function formatCpfMask(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }

  function handleQueryChange(value: string) {
    const digits = value.replace(/\D/g, "");
    // Se parece um CPF (somente dígitos/pontuação de CPF), aplica máscara
    const isCpfLike = /^[\d.\-\s]*$/.test(value) && digits.length > 0;
    setQuery(isCpfLike ? formatCpfMask(value) : value);
  }

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    setPicker(null);
    setPacienteId(null);
    const raw = query.trim();
    const digits = raw.replace(/\D/g, "");
    // Se for CPF formatado (11 dígitos numéricos), envia apenas dígitos
    const searchTerm = digits.length === 11 && /^[\d.\-\s]*$/.test(raw) ? digits : raw;
    pacienteSearch.mutate(searchTerm, {
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
            <h1 className="text-lg font-bold text-foreground">POC Saúde Goiânia</h1>
            <p className="text-xs text-muted-foreground">Gerenciamento de pacientes da rede publica</p>
          </div>
        </div>
      </header>


      <main className="container py-8 space-y-6">
        <Tabs defaultValue="paciente" className="space-y-4">
          <TabsList className="h-12 bg-slate-800 p-1 gap-1">
            <TabsTrigger
              value="paciente"
              className="text-slate-200 hover:text-white data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900 font-semibold px-5 py-2"
            >
              Paciente
            </TabsTrigger>
            <TabsTrigger
              value="raas"
              className="text-slate-200 hover:text-white data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900 font-semibold px-5 py-2"
            >
              Gerar Arquivo do RAAS
            </TabsTrigger>
          </TabsList>
          <TabsContent value="paciente">
            {/* Conteúdo da aba Paciente: pode incluir busca, dados, etc. */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-3xl flex-wrap">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Buscar por Nome ou CPF (000.000.000-00)..."
                  inputMode="text"
                  maxLength={120}
                  className="pl-10 h-11"
                />
              </div>
              <Button type="submit" disabled={pacienteSearch.isPending} className="h-11 px-6">
                {pacienteSearch.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
              </Button>
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
                      paciente={paciente.data}
                    />
                  </TabsContent>
                  <TabsContent value="prontuarios">
                    <ProntuarioAtendimentos pacienteId={paciente.data.id} />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </TabsContent>
          <TabsContent value="raas">
            <RaasArquivos />
          </TabsContent>
        </Tabs>
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
