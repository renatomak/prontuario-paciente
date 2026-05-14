import { useEffect, useMemo, useState } from "react";
import { FileArchive } from "lucide-react";
import { toast } from "sonner";
import { RaasFiltros } from "./RaasFiltros";
import { RaasTabela } from "./RaasTabela";
import { RaasPaginacao } from "./RaasPaginacao";
import type { ArquivoRaas, ListarArquivosRaasResponse } from "../types/RaasTypes";
import { ListarArquivosRaasHooks, ListarUnidadesHooks } from "../hooks";

const PAGE_SIZE_DEFAULT = 10;
const FALLBACK_ERROR_MESSAGE = "Falha ao carregar arquivos do RAAS.";

function extractArquivos(data: ListarArquivosRaasResponse | unknown): ArquivoRaas[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (
    typeof data === "object" &&
    data !== null &&
    "content" in data &&
    Array.isArray((data as ListarArquivosRaasResponse).content)
  ) {
    return (data as ListarArquivosRaasResponse).content;
  }
  if (
    typeof data === "object" &&
    data !== null &&
    "arquivos" in data &&
    Array.isArray((data as ListarArquivosRaasResponse).arquivos)
  ) {
    return (data as ListarArquivosRaasResponse).arquivos ?? [];
  }
  return [];
}

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

  const listarArquivosRaas = ListarArquivosRaasHooks();
  const listarUnidades = ListarUnidadesHooks();
  const { mutate, isPending, data } = listarArquivosRaas;
  const unidades = listarUnidades.data ?? [];

  const isLoading = isPending || listarUnidades.isLoading;

  function carregarPagina(page: number, pageSize: number) {
    mutate(
      {
        competencia: filtros.competencia || undefined,
        codigoEmpresa: filtros.unidade || undefined,
        situacao: filtros.situacao || undefined,
        page,
        size: pageSize,
      },
      {
        onSuccess: () => setCarregado(true),
        onError: (err: unknown) => toast.error(extractErrorMessage(err)),
      },
    );
  }

  useEffect(() => {
    mutate(
      { page: 0, size: PAGE_SIZE_DEFAULT },
      {
        onSuccess: () => setCarregado(true),
        onError: (err: unknown) => toast.error(extractErrorMessage(err)),
      },
    );
  }, [mutate]);

  const arquivos = useMemo(
    () => extractArquivos(data),
    [data],
  );

  const response = data as ListarArquivosRaasResponse | undefined;
  const totalElements = response?.totalElements ?? 0;
  const totalPages = Math.max(1, response?.totalPages ?? 1);
  const currentPage = response?.number ?? paginacao.page;

  function handleProcurar() {
    setPaginacao((prev) => ({ ...prev, page: 0 }));
    carregarPagina(0, paginacao.pageSize);
  }

  function handlePageSizeChange(newSize: number) {
    setPaginacao({ page: 0, pageSize: newSize });
    carregarPagina(0, newSize);
  }

  function handlePageChange(newPage: number) {
    setPaginacao((prev) => ({ ...prev, page: newPage }));
    carregarPagina(newPage, paginacao.pageSize);
  }

  return (
    <div className="space-y-4">
      <Header />

      <RaasFiltros
        competencia={filtros.competencia}
        situacao={filtros.situacao}
        unidade={filtros.unidade}
        listarUnidades={unidades}
        loading={isLoading}
        onCompetenciaChange={(v) => setFiltros((prev) => ({ ...prev, competencia: v }))}
        onSituacaoChange={(v) => setFiltros((prev) => ({ ...prev, situacao: v }))}
        onUnidadeChange={(v) => setFiltros((prev) => ({ ...prev, unidade: v }))}
        onProcurar={handleProcurar}
      />

      <RaasTabela
        arquivos={arquivos}
        loading={isPending}
        carregado={carregado}
      />

      <RaasPaginacao
        page={currentPage}
        totalPages={totalPages}
        pageSize={paginacao.pageSize}
        totalElements={totalElements}
        loading={isPending}
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