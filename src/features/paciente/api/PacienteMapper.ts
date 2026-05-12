import type { Paciente, Endereco, PacienteResumo } from "../domain/schemas";
import type {
  PacienteProjection,
  EnderecoProjection,
  PacienteResumoProjection,
} from "../types/PacienteProjection";

function parseDataNascimento(d?: string | null): Date | null {
  if (!d) return null;
  const dmy = d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const day = +dmy[1], m = +dmy[2], y = +dmy[3];
    if (m < 1 || m > 12 || day < 1 || day > 31) return null;
    return new Date(Date.UTC(y, m - 1, day));
  }
  const iso = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3]));
  return null;
}

function calcIdade(d?: string | null): string {
  const nasc = parseDataNascimento(d);
  if (!nasc) return "";
  const hoje = new Date();
  let anos = hoje.getUTCFullYear() - nasc.getUTCFullYear();
  const m = hoje.getUTCMonth() - nasc.getUTCMonth();
  if (m < 0 || (m === 0 && hoje.getUTCDate() < nasc.getUTCDate())) anos--;
  return `${anos} anos`;
}

export class PacienteMapper {
  static enderecoToDomain(e?: EnderecoProjection | null): Endereco | null {
    if (!e) return null;
    return {
      keyword: e.keyword ?? null,
      tipoLogradouro: e.tipo_logradouro ?? null,
      logradouro: e.logradouro ?? null,
      complemento: e.complemento ?? null,
      numero: e.numero ?? null,
      cep: e.cep ?? null,
      bairro: e.bairro ?? null,
      cidadeId: e.cidade_id ?? null,
      cidade: e.cidade ?? null,
      uf: e.uf ?? null,
    };
  }

  static toDomain(p: PacienteProjection): Paciente {
    return {
      id: p.id,
      nome: p.nome,
      cpf: p.cpf ?? null,
      sexo: p.sexo ?? null,
      nomeMae: p.nome_mae ?? null,
      nomePai: p.nome_pai ?? null,
      dataNascimento: p.data_nascimento ?? null,
      telefone: p.telefone ?? null,
      idade: p.idade ?? calcIdade(p.data_nascimento),
      endereco: PacienteMapper.enderecoToDomain(p.endereco),
      cd_usu_cadsus: p.cd_usu_cadsus ?? p.cartao_sus ?? null,
      cartaoSus: p.cartao_sus ?? null,
      nomeSocial: p.nome_social ?? null,
      paisNascimento: p.pais_nascimento ?? null,
      ufNascimento: p.uf_nascimento ?? null,
      municipioNascimento: p.municipio_nascimento ?? null,
      raca: p.raca ?? null,
      etnia: p.etnia ?? null,
      telefoneContato: p.telefone_contato ?? null,
      email: p.email ?? null,
      paisEndereco: p.pais_endereco ?? null,
    };
  }

  static resumoToDomain(r: PacienteResumoProjection): PacienteResumo {
    return {
      id: r.id,
      nome: r.nome,
      cpf: r.cpf,
      dataNascimento: r.dataNascimento,
    };
  }
}
