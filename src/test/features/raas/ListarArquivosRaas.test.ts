import { describe, it, expect, vi } from "vitest";
import type { ListarArquivoRaasPort } from "@/features/raas/port/ListarArquivoRaasPort";

describe("ListarArquivosRaas (caso de uso)", () => {
  it("deveDelegarChamadaAoRepositoryComFiltros", async () => {
    const repo: ListarArquivoRaasPort = {
      listarArquivos: vi.fn().mockResolvedValue({
        content: [],
        totalElements: 0,
        totalPages: 1,
        number: 0,
        size: 10,
      }),
    };

    await repo.listarArquivos({
      competencia: "07/2024",
      situacao: "3",
      page: 0,
      size: 1000,
    });

    expect(repo.listarArquivos).toHaveBeenCalledWith(
      expect.objectContaining({ competencia: "07/2024", situacao: "3" }),
    );
  });
});
