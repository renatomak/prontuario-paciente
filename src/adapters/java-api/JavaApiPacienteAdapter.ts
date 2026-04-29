import type { PacientePort } from "../../ports";
import type { Paciente, PacienteResumo, SearchResult, Endereco } from "../../domain/models";
import { JavaApiClient } from "./JavaApiClient";
import { ApiErrorImpl } from "../../shared/http";

// Tipo cru retornado pela API Java (snake_case)
interface RawEndereco {
  keyword?: string | null;
  tipo_logradouro?: string | null;
  logradouro?: string | null;
  complemento?: string | null;
  numero?: string | null;
  cep?: string | null;
  bairro?: string | null;
  cidade_id?: number | null;
  cidade?: string | null;
  uf?: string | null;
}

interface RawPaciente {
  id: number;
  nome: string;
  cpf?: string | null;
  sexo?: string | null;
  nome_mae?: string | null;
  nome_pai?: string | null;
  data_nascimento?: string | null;
  telefone?: string | null;
  idade?: string;
  endereco?: RawEndereco | null;
  cd_usu_cadsus?: number | string | null;
}

function parseDataNascimento(dataNascimento: string | null | undefined): Date | null {
  if (!dataNascimento) return null;
  // DD/MM/YYYY
  const dmy = dataNascimento.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const d = parseInt(dmy[1], 10);
    const m = parseInt(dmy[2], 10);
    const y = parseInt(dmy[3], 10);
    if (m < 1 || m > 12 || d < 1 || d > 31) return null;
    return new Date(Date.UTC(y, m - 1, d));
  }
  // ISO YYYY-MM-DD
  const iso = dataNascimento.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3]));
  }
  return null;
}

function calcIdade(dataNascimento: string | null | undefined): string {
  const nasc = parseDataNascimento(dataNascimento);
  if (!nasc) return "";
  const hoje = new Date();
  let anos = hoje.getUTCFullYear() - nasc.getUTCFullYear();
  const m = hoje.getUTCMonth() - nasc.getUTCMonth();
  if (m < 0 || (m === 0 && hoje.getUTCDate() < nasc.getUTCDate())) anos--;
  return `${anos} anos`;
}

function mapEndereco(e?: RawEndereco | null): Endereco | null {
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

function mapPaciente(p: RawPaciente): Paciente {
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
    endereco: mapEndereco(p.endereco),
    cd_usu_cadsus: p.cd_usu_cadsus ?? null,
  };
}

export class JavaApiPacienteAdapter implements PacientePort {
  private client = new JavaApiClient();

  async search(query: string): Promise<SearchResult> {
    const cpfRegex = /^\d{11}$/;

    if (cpfRegex.test(query)) {
      try {
        const paciente = await this.client.get<RawPaciente>(
          "/api/pacientes/search/cpf",
          { cpf: query }
        );
        return { tipo: "paciente", paciente: mapPaciente(paciente) };
      } catch (e) {
        if (e instanceof ApiErrorImpl && e.status === 404) {
          return { tipo: "lista", pacientes: [] };
        }
        throw e;
      }
    }

    const lista = await this.client.get<PacienteResumo[]>("/api/pacientes/search/nome", {
      nome: query,
    });
    return { tipo: "lista", pacientes: lista };
  }

  async getById(id: number): Promise<Paciente> {
    const paciente = await this.client.get<RawPaciente>(`/api/pacientes/${id}`);
    return mapPaciente(paciente);
  }
}
