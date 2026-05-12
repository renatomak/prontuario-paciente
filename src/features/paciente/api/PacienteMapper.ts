import type { PacienteResponse, EnderecoResponse, PacienteResumoResponse } from "../domain/schemas";
import type {
  PacienteProjection,
  EnderecoProjection,
  PacienteResumoProjection,
} from "../types/PacienteProjection";

export class PacienteMapper {
  static enderecoToDomain(e?: EnderecoProjection | null): EnderecoResponse | null {
    if (!e) return null;
    return {
      keyword: e.keyword ?? null,
      tipoLogradouro: e.tipoLogradouro ?? null,
      logradouro: e.logradouro ?? null,
      complemento: e.complemento ?? null,
      numero: e.numero ?? null,
      cep: e.cep ?? null,
      bairro: e.bairro ?? null,
      cidadeId: e.cidadeId ?? null,
      cidade: e.cidade ?? null,
      uf: e.uf ?? null,
    };
  }

  static toDomain(p: PacienteProjection): PacienteResponse {
    return {
      id: p.id,
      nome: p.nome,
      cpf: p.cpf ?? null,
      sexo: p.sexo ?? null,
      nomeMae: p.nomeMae ?? null,
      nomePai: p.nomePai ?? null,
      dataNascimento: p.dataNascimento ?? null,
      telefone: p.telefone ?? null,
      idade: p.idade ?? "",
      endereco: PacienteMapper.enderecoToDomain(p.endereco),
      cdUsuCadsus: p.cdUsuCadsus ?? p.cartaoSus ?? null,
      cartaoSus: p.cartaoSus ?? null,
      nomeSocial: p.nomeSocial ?? null,
      paisNascimento: p.paisNascimento ?? null,
      ufNascimento: p.ufNascimento ?? null,
      municipioNascimento: p.municipioNascimento ?? null,
      raca: p.raca ?? null,
      etnia: p.etnia ?? null,
      telefoneContato: p.telefoneContato ?? null,
      email: p.email ?? null,
      paisEndereco: p.paisEndereco ?? null,
    };
  }

  static resumoToDomain(r: PacienteResumoProjection): PacienteResumoResponse {
    return {
      id: r.id,
      nome: r.nome,
      cpf: r.cpf,
      dataNascimento: r.dataNascimento,
    };
  }
}
