import { useState, useEffect, useRef, useCallback } from "react";
import { FileArchive } from "lucide-react";
import { toast } from "sonner";
import { RaasFiltros } from "./RaasFiltros";
import { RaasTabela } from "./RaasTabela";
import { RaasPaginacao } from "./RaasPaginacao";
import { useListarArquivosRaas, useListarUnidades } from "../hooks";
import type { ListarArquivosRaasRequest } from "../types";

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;
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
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const [carregado, setCarregado] = useState(false);

  const listar = useListarArquivosRaas();
  const unidadesQuery = useListarUnidades();
  const unidades = unidadesQuery.data ?? [];

  const listarRef = useRef(listar.mutate);
  useEffect(() => {
    listarRef.current = listar.mutate;
  });

  const arquivos = listar.data?.content ?? [];
  const totalElements = listar.data?.totalElements ?? 0;
  const totalPages = Math.max(1, listar.data?.totalPages ?? 1);
  const pageAtual = listar.data?.number ?? paginacao.page;
  const tamanhoAtual = listar.data?.size ?? paginacao.pageSize;

  const buscar = useCallback((
    filtrosAtivos: FiltrosState,
    { page, pageSize }: PaginacaoState,
  ) => {
    const request: ListarArquivosRaasRequest = {
      competencia: filtrosAtivos.competencia || undefined,
      codigoEmpresa: filtrosAtivos.unidade || undefined,
      situacao: filtrosAtivos.situacao || undefined,
      page,
      size: pageSize,
    };

    listarRef.current(request, {
      onSuccess: () => setCarregado(true),
      onError: (err) => toast.error(extractErrorMessage(err)),
    });
  }, []);

  useEffect(() => {
    buscar(
      { competencia: "", situacao: "", unidade: "" },
      { page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE },
    );
  }, [buscar]);

  function handleProcurar() {
    const novaPaginacao = { page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE };
    setPaginacao(novaPaginacao);
    buscar(filtros, novaPaginacao);
  }

  function handlePageChange(newPage: number) {
    const novaPaginacao = { ...paginacao, page: newPage };
    setPaginacao(novaPaginacao);
    buscar(filtros, novaPaginacao);
  }

  function handlePageSizeChange(newSize: number) {
    const novaPaginacao = { page: DEFAULT_PAGE, pageSize: newSize };
    setPaginacao(novaPaginacao);
    buscar(filtros, novaPaginacao);
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
        arquivos={arquivos}
        loading={listar.isPending}
        carregado={carregado}
      />

      <RaasPaginacao
        page={pageAtual}
        totalPages={totalPages}
        pageSize={tamanhoAtual}
        totalElements={totalElements}
        loading={listar.isPending}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
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