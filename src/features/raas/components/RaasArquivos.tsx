import { useEffect, useMemo, useState } from "react";
import { FileArchive } from "lucide-react";
import { toast } from "sonner";
import { RaasFiltros } from "./RaasFiltros";
import { RaasTabela } from "./RaasTabela";
import { RaasPaginacao } from "./RaasPaginacao";
import type { ListarArquivosRaasResponse } from "../types/RaasTypes";
import { ListarArquivosRaasHooks, ListarUnidadesHooks } from "../hooks";

const PAGE_SIZE_DEFAULT = 10;
const FETCH_SIZE = 1000;
const FALLBACK_ERROR_MESSAGE = "Falha ao carregar arquivos do RAAS.";

function extractArquivos(data: ListarArquivosRaasResponse | unknown): unknown[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (
    typeof data === "object" &&
    data !== null &&
    "arquivos" in data &&
    Array.isArray((data as ListarArquivosRaasResponse).arquivos)
  ) {
    return (data as ListarArquivosRaasResponse).arquivos;
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
  const unidades = listarUnidades.data ?? [];

  const isLoading = listarArquivosRaas.isPending || listarUnidades.isLoading;

  useEffect(() => {
    if (listarArquivosRaas.isPending || listarArquivosRaas.isSuccess) return;
    listarArquivosRaas.mutate(
      { page: 0, size: FETCH_SIZE },
      { onSuccess: () => setCarregado(true) },
    );
  }, []);

  const arquivos = useMemo(
    () => extractArquivos(listarArquivosRaas.data),
    [listarArquivosRaas.data],
  );

  const totalElements =
    (listarArquivosRaas.data as ListarArquivosRaasResponse)?.totalElements ?? 0;

  const totalPages = Math.max(1, Math.ceil(arquivos.length / paginacao.pageSize));

  const pageItems = useMemo(() => {
    const start = paginacao.page * paginacao.pageSize;
    return arquivos.slice(start, start + paginacao.pageSize);
  }, [arquivos, paginacao]);

  function handleProcurar() {
    listarArquivosRaas.mutate(
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
        onError: (err: unknown) => toast.error(extractErrorMessage(err)),
      },
    );
  }

  function handlePageSizeChange(newSize: number) {
    setPaginacao({ page: 0, pageSize: newSize });
  }

  function handlePageChange(newPage: number) {
    setPaginacao((prev) => ({ ...prev, page: newPage }));
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
        arquivos={pageItems}
        loading={listarArquivosRaas.isPending}
        carregado={carregado}
      />

      <RaasPaginacao
        page={paginacao.page}
        totalPages={totalPages}
        pageSize={paginacao.pageSize}
        totalElements={totalElements}
        loading={listarArquivosRaas.isPending}
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