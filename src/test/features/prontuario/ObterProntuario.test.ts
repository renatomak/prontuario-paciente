import { describe, it, expect, vi } from "vitest";
import {
  ProntuarioResponseSchema,
  type ProntuarioResponse,
} from "@/features/prontuario/domain/schemas";
import type { ProntuarioRepository } from "@/features/prontuario/domain/ProntuarioRepository";

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
  it("deveDelegarChamadaAoRepositoryComPacienteId", async () => {
    const dto = new ProntuarioResponseBuilder().build();
    const repo: ProntuarioRepository = {
      obterPorPacienteId: vi.fn().mockResolvedValue(dto),
    };
    const result = await repo.obterPorPacienteId(99);
    expect(repo.obterPorPacienteId).toHaveBeenCalledWith(99);
    expect(result.paciente.nome).toBe("JOAO");
  });
});
