import { getApiBaseUrl } from "@/shared/env";

// ====== Tipos da resposta real da API Java ======
export interface ApiEndereco {
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

export interface ApiPaciente {
  id: number;
  nome: string;
  cpf?: string | null;
  sexo?: string | null;
  nome_mae?: string | null;
  nome_pai?: string | null;
  data_nascimento?: string | null;
  telefone?: string | null;
  endereco?: ApiEndereco | null;
}

export interface ApiUnidade {
  nome?: string | null;
  telefone?: string | null;
}

export interface ApiProfissional {
  nome?: string | null;
  tipo_conselho?: string | null;
  registro?: string | null;
  cbo?: string | null;
  cbo_descricao?: string | null;
}

export interface ApiRegistroConteudo {
  avaliacao?: string | null;
  evolucao?: string | null;
  exame?: string | null;
}

export interface ApiRegistro {
  data?: string | null;
  tipo?: string | null;
  conteudo: ApiRegistroConteudo;
}

export interface ApiAihDetalhes {
  data_cadastro?: string | null;
  principais_sinais?: string | null;
  condicoes_internacao?: string | null;
  principais_resultados?: string | null;
  diagnostico_inicial?: string | null;
}

export interface ApiAtendimento {
  data_chegada?: string | null;
  numero_atendimento?: string | null;
  tipo_atendimento?: string | null;
  classificacao_risco?: string | null;
  possui_aih?: boolean;
  aih_detalhes?: ApiAihDetalhes | null;
  unidade?: ApiUnidade | null;
  profissional?: ApiProfissional | null;
  registros: ApiRegistro[];
}
export interface ApiProntuarioResponse {
  paciente: ApiPaciente;
  atendimentos: ApiAtendimento[];
}

export async function fetchProntuarioByPacienteId(
  pacienteId: number,
): Promise<ApiProntuarioResponse> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/prontuario/${pacienteId}`);
  if (!res.ok) {
    throw new Error(`Erro ao buscar prontuário (HTTP ${res.status})`);
  }
  const data = (await res.json()) as ApiProntuarioResponse;
  if (!data || typeof data !== "object" || !("paciente" in data)) {
    throw new Error("Resposta inválida da API de prontuário.");
  }
  if (!Array.isArray(data.atendimentos)) {
    data.atendimentos = [];
  }
  return data;
}
