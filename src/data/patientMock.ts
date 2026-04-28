import rawMock from "./prontuarioResponseMock.json";

export interface MockEndereco {
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

export interface MockPaciente {
  id: number;
  nome: string;
  cpf?: string | null;
  sexo?: string | null;
  nome_mae?: string | null;
  nome_pai?: string | null;
  data_nascimento?: string | null;
  telefone?: string | null;
  endereco?: MockEndereco | null;
}

export interface MockUnidade {
  nome?: string | null;
  telefone?: string | null;
}

export interface MockProfissional {
  nome?: string | null;
  tipo_conselho?: string | null;
  registro?: string | null;
  cbo?: string | null;
  cbo_descricao?: string | null;
}

export interface MockRegistroConteudo {
  avaliacao?: string | null;
  evolucao?: string | null;
  exame?: string | null;
}

export interface MockRegistro {
  data?: string | null;
  tipo?: string | null;
  conteudo: MockRegistroConteudo;
}

export interface MockAtendimento {
  data_chegada?: string | null;
  numero_atendimento?: string | null;
  tipo_atendimento?: string | null;
  classificacao_risco?: string | null;
  unidade?: MockUnidade | null;
  profissional?: MockProfissional | null;
  registros: MockRegistro[];
}

export interface MockProntuario {
  paciente: MockPaciente;
  atendimentos: MockAtendimento[];
}

export const patientMockData: MockProntuario = rawMock as MockProntuario;
