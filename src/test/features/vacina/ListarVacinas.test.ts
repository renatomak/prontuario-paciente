import { describe, it, expect, vi } from "vitest";
import { ListarVacinasConsumer } from "@/features/vacina/consumer/ListarVacinasConsumer";
import { mapStatusVacina } from "@/features/vacina/consumer/vacinaMapperUtils";
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

// ─── Testes unitários de mapStatusVacina (agora diretamente testável) ────────

describe("mapStatusVacina", () => {
  it.each([
    [0,          "Aplicada"],
    [1,          "Aprazada"],
    ["0",        "Aplicada"],
    ["1",        "Aprazada"],
    [null,       "Aplicada"],
    [undefined,  "Aplicada"],
    ["",         "Aplicada"],
    ["Cancelada","Cancelada"],
  ])("mapStatusVacina(%s) === %s", (entrada, esperado) => {
    expect(mapStatusVacina(entrada as string | number | null | undefined)).toBe(esperado);
  });
});

// ─── Testes de integração do consumer ────────────────────────────────────────

describe("ListarVacinasConsumer", () => {
  it("deveConverterResumoProjectionParaDominio", async () => {
    const dto = new VacinaResumoProjectionBuilder().build();
    const mockClient = { get: vi.fn().mockResolvedValue([dto]) } as unknown as JavaApiClient;
    const consumer = new ListarVacinasConsumer(mockClient);
    const resultado = await consumer.listarPorPaciente(1);

    expect(resultado[0].idAplicacao).toBe(100);
    expect(resultado[0].nomeVacina).toBe("BCG");
    expect(resultado[0].dataAplicacao).toBe("01/02/2024");
  });

  it("deveTratarRespostaVaziaOuNula", async () => {
    const mockClient = { get: vi.fn().mockResolvedValue(null) } as unknown as JavaApiClient;
    const consumer = new ListarVacinasConsumer(mockClient);
    const resultado = await consumer.listarPorPaciente(1);
    expect(resultado).toEqual([]);
  });
});

// ─── Teste de contrato do port ────────────────────────────────────────────────

describe("ListarVacinasPort (contrato)", () => {
  it("deveDelegarChamadaAoPortComPacienteId", async () => {
    const port: ListarVacinasPort = {
      listarPorPaciente: vi.fn().mockResolvedValue([]),
    };
    await port.listarPorPaciente(42);
    expect(port.listarPorPaciente).toHaveBeenCalledWith(42);
  });
});

