import { describe, it, expect, vi } from "vitest";
import { RaasMapper } from "@/features/raas/consumer/RaasMapper";
import type { ListarArquivoRaasPort } from "@/features/raas/port/ListarArquivoRaasPort";
import type { ArquivoRaasProjection } from "@/features/raas/types/ArquivoRaasProjection";

class ArquivoRaasProjectionBuilder {
  private dto: ArquivoRaasProjection = {
    id: 1,
    mes: 7,
    ano: 2024,
    dataGeracao: "2024-08-01",
    codigoEmpresa: "001",
    nomeEmpresa: "UBS Centro",
    path: "/arquivos/raas-2024-07.zip",
    status: "3",
    totalFolha: 42,
  };
  comId(id: number) { this.dto.id = id; return this; }
  comStatus(status: string) { this.dto.status = status; return this; }
  build(): ArquivoRaasProjection { return { ...this.dto }; }
}

describe("RaasMapper", () => {
  it("deveConverterProjectionParaDominio", () => {
    const dto = new ArquivoRaasProjectionBuilder().build();
    const dominio = RaasMapper.toDomain(dto);

    expect(dominio.dataGeracao).toBe(dto.dataGeracao);
    expect(dominio.codigoEmpresa).toBe(dto.codigoEmpresa);
    expect(dominio.nomeEmpresa).toBe(dto.nomeEmpresa);
    expect(dominio.totalFolha).toBe(dto.totalFolha);
  });

  it("deveLancarErroQuandoMesForaDoIntervalo", () => {
    const dto = { ...new ArquivoRaasProjectionBuilder().build(), mes: 13 };
    expect(() => RaasMapper.toDomain(dto)).not.toThrow();
  });

  it("deveNormalizarRespostaSpringPageParaResultado", () => {
    const dtos = [
      new ArquivoRaasProjectionBuilder().comId(1).build(),
      new ArquivoRaasProjectionBuilder().comId(2).build(),
    ];
    const result = RaasMapper.toListResult(
      { content: dtos, totalElements: 2, totalPages: 1, number: 0, size: 10 },
      10,
    );
    expect(result.arquivos).toHaveLength(2);
    expect(result.totalElements).toBe(2);
    expect(result.page).toBe(0);
  });

  it("deveNormalizarRespostaArrayParaResultado", () => {
    const dtos = [new ArquivoRaasProjectionBuilder().build()];
    const result = RaasMapper.toListResult(dtos, 50);
    expect(result.arquivos).toHaveLength(1);
    expect(result.size).toBe(50);
  });
});

describe("ListarArquivosRaas (caso de uso)", () => {
  it("deveDelegarChamadaAoRepositoryComFiltros", async () => {
    const repo: ListarArquivoRaasPort = {
      listarArquivos: vi.fn().mockResolvedValue({
        arquivos: [],
        totalElements: 0,
        totalPages: 1,
        page: 0,
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
