import { useEffect, useMemo, useState } from "react";
import { FileArchive } from "lucide-react";
import { toast } from "sonner";
import { useListarArquivosRaas } from "../hooks/useListarArquivosRaas";
import { RaasFiltros } from "./RaasFiltros";
import { RaasTabela } from "./RaasTabela";
import { RaasPaginacao } from "./RaasPaginacao";

async function fetchUnidades(): Promise<Array<{ id: number; nome: string }>> {
  const resp = await fetch("http://localhost:8081/api/v1/unidades");
  if (!resp.ok) throw new Error("Falha ao buscar unidades");
  return resp.json();
}

export function RaasArquivos() {
  const [competencia, setCompetencia] = useState("");
  const [situacao, setSituacao] = useState("");
  const [unidade, setUnidade] = useState("");
  const [unidades, setUnidades] = useState<Array<{ id: number; nome: string }>>([]);
  const [carregado, setCarregado] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const listar = useListarArquivosRaas();

  useEffect(() => {
    fetchUnidades()
      .then(setUnidades)
      .catch(() => setUnidades([]));
  }, []);

  function procurar() {
    listar.mutate(
      {
        competencia,
        codigoEmpresa: unidade || undefined,
        situacao: situacao || undefined,
        page: 0,
        size: 1000,
      },
      {
        onSuccess: () => {
          setCarregado(true);
          setPage(0);
        },
        onError: (err: unknown) => {
          const msg =
            err && typeof err === "object" && "message" in err
              ? String((err as { message?: string }).message)
              : "Falha ao carregar arquivos do RAAS.";
          toast.error(msg);
        },
      },
    );
  }

  const arquivos = listar.data?.arquivos ?? [];
  const totalElements = listar.data?.totalElements ?? 0;

  const totalPages = Math.max(1, Math.ceil(arquivos.length / pageSize));
  const pageItems = useMemo(() => {
    const start = page * pageSize;
    return arquivos.slice(start, start + pageSize);
  }, [arquivos, page, pageSize]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileArchive className="h-5 w-5 text-primary" />
          Gerar Arquivo do RAAS
        </h2>
        <p className="text-sm text-muted-foreground">
          Unidade Saúde / RAAS / Processo / Gerar Arquivo do RAAS
        </p>
      </div>

      <RaasFiltros
        competencia={competencia}
        situacao={situacao}
        unidade={unidade}
        unidades={unidades}
        loading={listar.isPending}
        onCompetenciaChange={setCompetencia}
        onSituacaoChange={setSituacao}
        onUnidadeChange={setUnidade}
        onProcurar={procurar}
      />

      <RaasTabela
        arquivos={pageItems}
        loading={listar.isPending}
        carregado={carregado}
      />

      <RaasPaginacao
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalElements={totalElements}
        loading={listar.isPending}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(0);
        }}
      />
    </div>
  );
}
