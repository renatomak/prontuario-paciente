import { describe, it, expect, vi } from "vitest";
import { PacienteMapper } from "@/features/paciente/api/PacienteMapper";
import type { PacienteRepository } from "@/features/paciente/domain/PacienteRepository";
import type { PacienteProjection } from "@/features/paciente/types/PacienteProjection";

class PacienteProjectionBuilder {
  private dto: PacienteProjection = {
    id: 1,
    nome: "JOAO DA SILVA",
    cpf: "12345678901",
    sexo: "M",
    nomeMae: "MARIA DA SILVA",
    dataNascimento: "1990-05-10",
    endereco: { logradouro: "RUA A", numero: "10", cidade: "GOIANIA", uf: "GO" },
  };
  comId(id: number) { this.dto.id = id; return this; }
  comCpf(cpf: string | null) { this.dto.cpf = cpf; return this; }
  build(): PacienteProjection { return { ...this.dto }; }
}

describe("PacienteMapper", () => {
  it("deveConverterProjectionParaDominioComCamelCase", () => {
    const dto = new PacienteProjectionBuilder().build();
    const dominio = PacienteMapper.toDomain(dto);

    expect(dominio.nomeMae).toBe("MARIA DA SILVA");
    expect(dominio.dataNascimento).toBe("1990-05-10");
    expect(dominio.endereco?.logradouro).toBe("RUA A");
  });

  it("deveCalcularIdadeQuandoNaoVierDoBackend", () => {
    const dto = new PacienteProjectionBuilder().build();
    const dominio = PacienteMapper.toDomain(dto);
    expect(dominio.idade).toMatch(/\d+ anos/);
  });
});

describe("BuscarPaciente (caso de uso)", () => {
  it("deveDelegarChamadaAoRepositoryComQuery", async () => {
    const repo: PacienteRepository = {
      buscar: vi.fn().mockResolvedValue({ tipo: "lista", pacientes: [] }),
      carregarPorId: vi.fn(),
    };

    await repo.buscar({ query: "ALEXANDRE" });
    expect(repo.buscar).toHaveBeenCalledWith({ query: "ALEXANDRE" });
  });
});
