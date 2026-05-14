import { useMemo, useState } from "react";
import { FileArchive } from "lucide-react";
import { toast } from "sonner";
import { RaasFiltros } from "./RaasFiltros";
import { RaasTabela } from "./RaasTabela";
import { RaasPaginacao } from "./RaasPaginacao";
import { useListarArquivosRaas, useListarUnidades } from "../hooks";

const PAGE_SIZE_DEFAULT = 10;
const FETCH_SIZE = 1000;
const FALLBACK_ERROR_MESSAGE = "Falha ao carregar arquivos do RAAS.";

function extractErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: string }).message);
  }
  return FALLBACK_ERROR_MESSAGE;
}

interface FiltrosState {
  competencia: string;
  situacao: string;
  unidade: string;
}

interface PaginacaoState {
  page: number;
  pageSize: number;
}

export function RaasArquivos() {
  const [filtros, setFiltros] = useState<FiltrosState>({
    competencia: "",
    situacao: "",
    unidade: "",
  });

  const [paginacao, setPaginacao] = useState<PaginacaoState>({
    page: 0,
    pageSize: PAGE_SIZE_DEFAULT,
  });

  const [carregado, setCarregado] = useState(false);

  const listar = useListarArquivosRaas();
  const unidadesQuery = useListarUnidades();
  const unidades = unidadesQuery.data ?? [];

  const arquivos = listar.data?.arquivos ?? [];
  const totalElements = listar.data?.totalElements ?? 0;
  const totalPages = Math.max(1, Math.ceil(arquivos.length / paginacao.pageSize));

  const pageItems = useMemo(() => {
    const start = paginacao.page * paginacao.pageSize;
    return arquivos.slice(start, start + paginacao.pageSize);
  }, [arquivos, paginacao]);

  function handleProcurar() {
    listar.mutate(
      {
        competencia: filtros.competencia,
        codigoEmpresa: filtros.unidade || undefined,
        situacao: filtros.situacao || undefined,
        page: 0,
        size: FETCH_SIZE,
      },
      {
        onSuccess: () => {
          setCarregado(true);
          setPaginacao((prev) => ({ ...prev, page: 0 }));
        },
        onError: (err) => toast.error(extractErrorMessage(err)),
      },
    );
  }

  return (
    <div className="space-y-4">
      <Header />

      <RaasFiltros
        competencia={filtros.competencia}
        situacao={filtros.situacao}
        unidade={filtros.unidade}
        listarUnidades={unidades}
        loading={listar.isPending || unidadesQuery.isLoading}
        onCompetenciaChange={(v) => setFiltros((prev) => ({ ...prev, competencia: v }))}
        onSituacaoChange={(v) => setFiltros((prev) => ({ ...prev, situacao: v }))}
        onUnidadeChange={(v) => setFiltros((prev) => ({ ...prev, unidade: v }))}
        onProcurar={handleProcurar}
      />

      <RaasTabela
        arquivos={pageItems}
        loading={listar.isPending}
        carregado={carregado}
      />

      <RaasPaginacao
        page={paginacao.page}
        totalPages={totalPages}
        pageSize={paginacao.pageSize}
        totalElements={totalElements}
        loading={listar.isPending}
        onPageChange={(p) => setPaginacao((prev) => ({ ...prev, page: p }))}
        onPageSizeChange={(s) => setPaginacao({ page: 0, pageSize: s })}
      />
    </div>
  );
}

function Header() {
  return (
    <div>
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <FileArchive className="h-5 w-5 text-primary" />
        Gerar Arquivo do RAAS
      </h2>
      <p className="text-sm text-muted-foreground">
        Unidade Saude / RAAS / Processo / Gerar Arquivo do RAAS
      </p>
    </div>
  );
}
