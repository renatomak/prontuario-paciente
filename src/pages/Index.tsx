import { useState } from "react";
import type { PacienteResumoResponse } from "@/features/paciente/domain/schemas";
import { formatCpfMask } from "@/shared/formatters";
import { useBuscarPaciente } from "@/features/paciente/hooks/useBuscarPaciente";
import { useCarregarPaciente } from "@/features/paciente/hooks/useCarregarPaciente";
import { useListarVacinas } from "@/features/vacina/hooks/useListarVacinas";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PacienteDados } from "@/features/paciente/components/PacienteDados";
import { PacienteHeaderCard } from "@/features/paciente/components/PacienteHeaderCard";
import { PacientesPickerDialog } from "@/features/paciente/components/PacientesPickerDialog";
import { ProntuarioAtendimentos } from "@/features/prontuario/components/ProntuarioAtendimentos";
import { RaasArquivos } from "@/features/raas/components/RaasArquivos";
import { VacinasTable } from "@/features/vacina/components/VacinasTable";
import { VacinaDetalheSheet } from "@/features/vacina/components/VacinaDetalheSheet";
import { Search, Loader2, Syringe } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [query, setQuery] = useState("");

  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [picker, setPicker] = useState<PacienteResumo[] | null>(null);
  const [selectedVacina, setSelectedVacina] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const pacienteSearch = useBuscarPaciente();
  const paciente = useCarregarPaciente(pacienteId ?? 0, !!pacienteId && !picker);
  const vacinas = useListarVacinas(pacienteId ?? 0, !!pacienteId && !picker);

  function handleQueryChange(value: string) {
    const digits = value.replace(/\D/g, "");
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
