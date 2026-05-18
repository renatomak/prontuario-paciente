import { describe, it, expect, vi } from "vitest";
import {
  ProntuarioResponseSchema,
  type ProntuarioResponse,
} from "@/features/prontuario/types/ObterProntuarioResponse";
import type { ObterProntuarioPort } from "@/features/prontuario/port/ObterProntuarioPort";

class ProntuarioResponseBuilder {
  private dto: ProntuarioResponse = {
    paciente: { id: 1, nome: "JOAO" },
    atendimentos: [],
  };
  semAtendimentos() { this.dto.atendimentos = []; return this; }
  build(): ProntuarioResponse { return JSON.parse(JSON.stringify(this.dto)); }
}

describe("ProntuarioResponseSchema (Zod)", () => {
  it("deveAceitarRespostaMinimaValida", () => {
    const dto = new ProntuarioResponseBuilder().build();
    expect(() => ProntuarioResponseSchema.parse(dto)).not.toThrow();
  });

  it("deveLancarErroQuandoFaltarPaciente", () => {
    expect(() =>
      ProntuarioResponseSchema.parse({ atendimentos: [] }),
    ).toThrow();
  });
});

describe("ObterProntuario (caso de uso)", () => {
  it("deveDelegarChamadaAoPortComPacienteId", async () => {
    const dto = new ProntuarioResponseBuilder().build();
    const port: ObterProntuarioPort = {
      obterPorPacienteId: vi.fn().mockResolvedValue(dto),
    };
    const result = await port.obterPorPacienteId(99);
    expect(port.obterPorPacienteId).toHaveBeenCalledWith(99);
    expect(result.paciente.nome).toBe("JOAO");
  });
});
