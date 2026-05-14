import { useEffect, useMemo, useRef, useState } from "react";
import { FileArchive } from "lucide-react";
import { toast } from "sonner";
import { RaasFiltros } from "./RaasFiltros";
import { RaasTabela } from "./RaasTabela";
import { RaasPaginacao } from "./RaasPaginacao";
import type { ListarArquivosRaasResponse } from "../types/RaasTypes";
import { ListarArquivosRaasHooks, ListarUnidadesHooks } from "../hooks";

export function RaasArquivos() {
  const [competencia, setCompetencia] = useState("");
  const [situacao, setSituacao] = useState("");
  const [unidade, setUnidade] = useState("");
  const [carregado, setCarregado] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const listarArquivosRaasHooks = ListarArquivosRaasHooks();
  const listarUnidades = ListarUnidadesHooks().data ?? [];
  const inicializado = useRef(false);

  useEffect(() => {
    if (inicializado.current) return;
    inicializado.current = true;
    listarArquivosRaasHooks.mutate(
      { page: 0, size: 1000 },
      {
        onSuccess: () => {
          setCarregado(true);
        },
      },
    );
  }, []);

  function procurar() {
    listarArquivosRaasHooks.mutate(
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

  const data = listarArquivosRaasHooks.data as ListarArquivosRaasResponse | undefined;
  const arquivos = useMemo(() => data?.arquivos ?? [], [data?.arquivos]);
  const totalElements = data?.totalElements ?? 0;

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
          Unidade Saude / RAAS / Processo / Gerar Arquivo do RAAS
        </p>
      </div>

      <RaasFiltros
        competencia={competencia}
        situacao={situacao}
        unidade={unidade}
        listarUnidades={listarUnidades}
        loading={listarArquivosRaasHooks.isPending || ListarUnidadesHooks().isLoading}
        onCompetenciaChange={setCompetencia}
        onSituacaoChange={setSituacao}
        onUnidadeChange={setUnidade}
        onProcurar={procurar}
      />

      <RaasTabela
        arquivos={pageItems}
        loading={listarArquivosRaasHooks.isPending}
        carregado={carregado}
      />

      <RaasPaginacao
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalElements={totalElements}
        loading={listarArquivosRaasHooks.isPending}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(0);
        }}
      />
    </div>
  );
}
