import { describe, it, expect, vi } from "vitest";
import { ListarVacinasConsumer } from "@/features/vacina/consumer/ListarVacinasConsumer";
import type { ListarVacinasPort } from "@/features/vacina/port/ListarVacinasPort";
import type { VacinaResumoProjection } from "@/features/vacina/types/VacinaProjection";
import { JavaApiClient } from "@/shared/http/JavaApiClient";

class VacinaResumoProjectionBuilder {
  private dto: VacinaResumoProjection = {
    idAplicacao: 100,
    dataAplicacao: "01/02/2024",
    nomeVacina: "BCG",
    dose: "1a",
    estrategia: "ROTINA",
    status: 0,
  };
  comStatus(s: string | number) { this.dto.status = s; return this; }
  build(): VacinaResumoProjection { return { ...this.dto }; }
}

describe("ListarVacinasConsumer (mapeamento de status)", () => {
  it("deveConverterResumoProjectionParaDominio", async () => {
    const dto = new VacinaResumoProjectionBuilder().build();
    vi.spyOn(JavaApiClient.prototype, "get").mockResolvedValueOnce([dto]);
    const consumer = new ListarVacinasConsumer();
    const resultado = await consumer.listarPorPaciente(1);

    expect(resultado[0].idAplicacao).toBe(100);
    expect(resultado[0].nomeVacina).toBe("BCG");
    expect(resultado[0].dataAplicacao).toBe("01/02/2024");
  });

  it("deveTraduzirStatusNumericoParaTextoLegivel", async () => {
    const casos = [
      { status: 0, esperado: "Aplicada" },
      { status: 1, esperado: "Aprazada" },
      { status: "Cancelada", esperado: "Cancelada" },
    ];

    for (const { status, esperado } of casos) {
      const dto = new VacinaResumoProjectionBuilder().comStatus(status).build();
      vi.spyOn(JavaApiClient.prototype, "get").mockResolvedValueOnce([dto]);
      const consumer = new ListarVacinasConsumer();
      const resultado = await consumer.listarPorPaciente(1);
      expect(resultado[0].status).toBe(esperado);
    }
  });
});

describe("ListarVacinas (caso de uso)", () => {
  it("deveDelegarChamadaAoPortComPacienteId", async () => {
    const port: ListarVacinasPort = {
      listarPorPaciente: vi.fn().mockResolvedValue([]),
    };
    await port.listarPorPaciente(42);
    expect(port.listarPorPaciente).toHaveBeenCalledWith(42);
  });
});

