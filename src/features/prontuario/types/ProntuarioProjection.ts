// Projections (DTOs crus vindos do backend Java).

export interface ProntuarioEnderecoProjection {
  keyword?: string | null;
  tipoLogradouro?: string | null;
  logradouro?: string | null;
  complemento?: string | null;
  numero?: string | null;
  cep?: string | null;
  bairro?: string | null;
  cidadeId?: number | null;
  cidade?: string | null;
  uf?: string | null;
}

export interface ProntuarioPacienteProjection {
  id: number;
  nome: string;
  cpf?: string | null;
  sexo?: string | null;
  nomeMae?: string | null;
  nomePai?: string | null;
  dataNascimento?: string | null;
  telefone?: string | null;
  endereco?: ProntuarioEnderecoProjection | null;
  cdUsuCadsus?: number | string | null;
}

export interface ProntuarioRegistroProjection {
  data?: string | null;
  tipo?: string | null;
  conteudo: {
    avaliacao?: string | null;
    evolucao?: string | null;
    exame?: string | null;
  };
}

export interface ProntuarioAtendimentoProjection {
  dataChegada?: string | null;
  numeroAtendimento?: string | null;
  tipoAtendimento?: string | null;
  classificacaoRisco?: string | null;
  possuiAih?: boolean;
  aihDetalhes?: {
    dataCadastro?: string | null;
    principaisSinais?: string | null;
    condicoesInternacao?: string | null;
    principaisResultados?: string | null;
    diagnosticoInicial?: string | null;
  } | null;
  unidade?: { nome?: string | null; telefone?: string | null } | null;
  profissional?: {
    nome?: string | null;
    tipoConselho?: string | null;
    registro?: string | null;
    cbo?: string | null;
    cboDescricao?: string | null;
  } | null;
  registros?: ProntuarioRegistroProjection[];
}

export interface ProntuarioProjection {
  paciente: ProntuarioPacienteProjection;
  atendimentos?: ProntuarioAtendimentoProjection[];
}
