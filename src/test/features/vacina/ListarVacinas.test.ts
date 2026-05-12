import { describe, it, expect, vi } from "vitest";
import { VacinaMapper } from "@/features/vacina/api/VacinaMapper";
import type { VacinaRepository } from "@/features/vacina/domain/VacinaRepository";
import type { VacinaResumoProjection } from "@/features/vacina/types/VacinaProjection";

class VacinaResumoProjectionBuilder {
  private dto: VacinaResumoProjection = {
    id_aplicacao: 100,
    data_aplicacao: "01/02/2024",
    nome_vacina: "BCG",
    dose: "1ª",
    estrategia: "ROTINA",
    status: 0,
  };
  comStatus(s: string | number) { this.dto.status = s; return this; }
  build(): VacinaResumoProjection { return { ...this.dto }; }
}

describe("VacinaMapper", () => {
  it("deveConverterResumoProjectionParaDominio", () => {
    const dto = new VacinaResumoProjectionBuilder().build();
    const dominio = VacinaMapper.resumoToDomain(dto);

    expect(dominio.idAplicacao).toBe(100);
    expect(dominio.nomeVacina).toBe("BCG");
    expect(dominio.dataAplicacao).toBe("01/02/2024");
  });

  it("deveTraduzirStatusNumericoParaTextoLegivel", () => {
    expect(VacinaMapper.resumoToDomain(new VacinaResumoProjectionBuilder().comStatus(0).build()).status).toBe("Aplicada");
    expect(VacinaMapper.resumoToDomain(new VacinaResumoProjectionBuilder().comStatus(1).build()).status).toBe("Aprazada");
    expect(VacinaMapper.resumoToDomain(new VacinaResumoProjectionBuilder().comStatus("Cancelada").build()).status).toBe("Cancelada");
  });
});

describe("ListarVacinas (caso de uso)", () => {
  it("deveDelegarChamadaAoRepositoryComPacienteId", async () => {
    const repo: VacinaRepository = {
      listarPorPaciente: vi.fn().mockResolvedValue([]),
      obterDetalhe: vi.fn(),
    };
    await repo.listarPorPaciente(42);
    expect(repo.listarPorPaciente).toHaveBeenCalledWith(42);
  });
});
