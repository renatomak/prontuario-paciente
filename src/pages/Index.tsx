import { useState } from "react";
import { api, Paciente, PacienteResumo, VacinaResumo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PacienteDados } from "@/components/PacienteDados";
import { VacinasTable } from "@/components/VacinasTable";
import { VacinaDetalheSheet } from "@/components/VacinaDetalheSheet";
import { PacientesPickerDialog } from "@/components/PacientesPickerDialog";
import { Search, Loader2, Syringe } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [vacinas, setVacinas] = useState<VacinaResumo[]>([]);
  const [picker, setPicker] = useState<PacienteResumo[] | null>(null);
  const [selectedVacina, setSelectedVacina] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  async function loadPaciente(id: number) {
    setLoading(true);
    try {
      const [p, v] = await Promise.all([api.paciente(id), api.vacinas(id)]);
      setPaciente(p);
      setVacinas(v);
      setPicker(null);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setPaciente(null);
    setVacinas([]);
    try {
      const res = await api.search(query.trim());
      if (res.tipo === "paciente") {
        setPaciente(res.paciente);
        const v = await api.vacinas(res.paciente.id);
        setVacinas(v);
      } else {
        if (res.pacientes.length === 0) {
          toast.info("Nenhum paciente encontrado.");
        } else if (res.pacientes.length === 1) {
          await loadPaciente(res.pacientes[0].id);
        } else {
          setPicker(res.pacientes);
        }
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
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
        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por Nome ou CPF..."
              className="pl-10 h-11"
            />
          </div>
          <Button type="submit" disabled={loading} className="h-11 px-6">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
          </Button>
        </form>

        {!paciente && !loading && (
          <div className="text-center py-20 text-muted-foreground">
            <Syringe className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Digite um nome ou CPF para iniciar a consulta.</p>
            <p className="text-xs mt-2">Ex.: <code className="bg-muted px-2 py-0.5 rounded">ALEXANDRE</code> ou <code className="bg-muted px-2 py-0.5 rounded">12345678901</code></p>
          </div>
        )}

        {paciente && (
          <Tabs defaultValue="dados" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dados">Dados do Paciente</TabsTrigger>
              <TabsTrigger value="vacinas">Vacinas ({vacinas.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="dados">
              <PacienteDados paciente={paciente} />
            </TabsContent>
            <TabsContent value="vacinas">
              <VacinasTable
                vacinas={vacinas}
                selectedId={selectedVacina ?? undefined}
                onSelect={(id) => { setSelectedVacina(id); setSheetOpen(true); }}
              />
            </TabsContent>
          </Tabs>
        )}
      </main>

      {picker && (
        <PacientesPickerDialog
          pacientes={picker}
          open={!!picker}
          onOpenChange={(o) => !o && setPicker(null)}
          onSelect={(id) => loadPaciente(id)}
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
