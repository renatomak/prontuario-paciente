import rawMock from "./prontuarioResponseMock.json";

export interface MockEndereco {
  rua: string;
  cidade: string;
  quadra?: string | null;
  lote?: string | null;
}

export interface MockPaciente {
  id: string;
  nome: string;
  nomeSocial?: string | null;
  sexo: string;
  mae: string;
  dataNascimento: string;
  idade: string;
  cpf: string;
  cns: string;
  endereco: MockEndereco;
  telefone: string;
  celular: string;
}

export interface MockProfissional {
  nome: string;
  registro?: string;
  tipoRegistro?: string;
  cbo?: string;
  cboDescricao?: string;
}

export interface MockExames {
  grupo?: string;
  itens?: string[];
}

export interface MockCid {
  codigo?: string;
  descricao?: string;
}

export interface MockRegistroConteudo {
  subtitulo?: string | null;
  motivoConsulta?: string | null;
  classificacaoRisco?: string | null;
  historico?: string | null;
  evolucao?: string | null;
  observacao?: string | null;
  peso?: number | null;
  altura?: number | null;
  perimetroCefalico?: number | null;
  procedimentos?: string[] | null;
  cid?: MockCid | null;
  exames?: MockExames | null;
}

export interface MockRegistro {
  profissional: MockProfissional;
  tipoAtendimento?: string;
  dataRegistro: string;
  tipo: string;
  conteudo: MockRegistroConteudo;
}

export interface MockAtendimento {
  unidade: string;
  telefone?: string | null;
  chegada: string;
  saida?: string | null;
  tempoPermanencia?: string | null;
  numeroAtendimento?: string | null;
  tipoAtendimento?: string;
  registros: MockRegistro[];
}

export interface MockDocumento {
  titulo: string;
  orgao: string;
  sistema: string;
  unidadeEmissora: string;
  prefeitura: string;
  emitidoPor: string;
  dataEmissao: string;
  sistema_versao: string;
  totalPaginas: number;
  enderecoUnidade: string;
  cidadeUnidade: string;
  telefoneUnidade: string;
}

export interface MockProntuario {
  documento: MockDocumento;
  paciente: MockPaciente;
  atendimentos: MockAtendimento[];
  listaProblemas?: unknown[];
}

const documentoPadrao: MockDocumento = {
  titulo: "PRONTUÁRIO DE ATENDIMENTOS",
  orgao: "Secretaria Municipal de Saúde de Goiânia - GO",
  sistema: "SUS - SISTEMA ÚNICO DE SAÚDE",
  unidadeEmissora: "UPA - VILA NOVA",
  prefeitura: "Prefeitura Municipal de Goiânia - GO",
  emitidoPor: "MARIA EDUARDA HUMMEL OLIVEIRA",
  dataEmissao: "18/08/2025 15:50 BRT",
  sistema_versao: "CELK Saúde v3.1.293.3 - CELK SISTEMAS LTDA",
  totalPaginas: 7,
  enderecoUnidade: "Industrial - Setor Leste Vila Nova - CEP 74635-040",
  cidadeUnidade: "GOIANIA - GO",
  telefoneUnidade: "(62) 3524-1824",
};

const raw = rawMock as {
  paciente: MockPaciente;
  atendimentos: MockAtendimento[];
  listaProblemas?: unknown[];
};

export const patientMockData: MockProntuario = {
  documento: documentoPadrao,
  paciente: raw.paciente,
  atendimentos: raw.atendimentos,
  listaProblemas: raw.listaProblemas ?? [],
};
