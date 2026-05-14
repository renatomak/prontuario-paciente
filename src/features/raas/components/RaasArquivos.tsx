import { useState } from "react";
import { FileArchive } from "lucide-react";
import { toast } from "sonner";
import { RaasFiltros } from "./RaasFiltros";
import { RaasTabela } from "./RaasTabela";
import { RaasPaginacao } from "./RaasPaginacao";
import { useListarArquivosRaas, useListarUnidades } from "../hooks";
import type { ListarArquivosRaasRequest } from "../types";

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

export function RaasArquivos() {
  const [filtros, setFiltros] = useState<FiltrosState>({
    competencia: "",
    situacao: "",
    unidade: "",
  });

  // null = usar defaults do backend (page=0, size=10)
  const [page, setPage] = useState<number | null>(null);
  const [pageSize, setPageSize] = useState<number | null>(null);
  const [carregado, setCarregado] = useState(false);

  const listar = useListarArquivosRaas();
  const unidadesQuery = useListarUnidades();
  const unidades = unidadesQuery.data ?? [];

  const arquivos = listar.data?.arquivos ?? [];
  const totalElements = listar.data?.totalElements ?? 0;
  const totalPages = Math.max(1, listar.data?.totalPages ?? 1);
  const currentPage = listar.data?.page ?? page ?? 0;
  const currentSize = listar.data?.size ?? pageSize ?? 10;

  function buscar(overrides: Partial<{ page: number | null; size: number | null }> = {}) {
    const nextPage = overrides.page !== undefined ? overrides.page : page;
    const nextSize = overrides.size !== undefined ? overrides.size : pageSize;

    const request: ListarArquivosRaasRequest = {
      competencia: filtros.competencia || undefined,
      codigoEmpresa: filtros.unidade || undefined,
      situacao: filtros.situacao || undefined,
      page: nextPage ?? undefined,
      size: nextSize ?? undefined,
    };

    listar.mutate(request, {
      onSuccess: () => setCarregado(true),
      onError: (err) => toast.error(extractErrorMessage(err)),
    });
  }

  function handleProcurar() {
    // Primeira busca (ou nova busca): zera paginação e deixa backend aplicar defaults.
    setPage(null);
    setPageSize(null);
    buscar({ page: null, size: null });
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    buscar({ page: newPage, size: pageSize ?? currentSize });
  }

  function handlePageSizeChange(newSize: number) {
    setPage(0);
    setPageSize(newSize);
    buscar({ page: 0, size: newSize });
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
        page={currentPage}
        totalPages={totalPages}
        pageSize={currentSize}
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
