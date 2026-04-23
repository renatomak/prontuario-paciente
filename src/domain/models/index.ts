export interface PacienteResumo {
  id: number;
  nome: string;
  cpf: string | null;
  dataNascimento: string | null;
}

export interface Endereco {
  keyword: string | null;
  tipoLogradouro: string | null;
  logradouro: string | null;
  complemento: string | null;
  numero: string | null;
  cep: string | null;
  bairro: string | null;
  cidadeId: number | null;
  cidade: string | null;
  uf: string | null;
}

export interface Paciente {
  id: number;
  nome: string;
  cpf: string | null;
  sexo: string | null;
  nomeMae: string | null;
  nomePai: string | null;
  dataNascimento: string | null;
  telefone: string | null;
  idade: string;
  endereco: Endereco | null;
}

export interface VacinaResumo {
  idAplicacao: number;
  dataAplicacao: string;
  nomeVacina: string;
  dose: string;
  estrategia: string | null;
  status: string;
}

export interface VacinaDetalhe {
  idAplicacao: number;
  nrAtendimento: string | null;
  doseCodigo: number | null;
  dose: string;
  estrategia: string | null;
  nomeVacina: string;
  descricaoVacina: string | null;
  lote: string | null;
  validadeLote: string | null;
  fabricanteNome: string | null;
  fabricanteCnpj: string | null;
  dataAplicacao: string;
  localAtendimento: string | null;
  turno: string | null;
  grupoAtendimento: string | null;
  gestante: boolean;
  puerpera: boolean;
  historico: boolean;
  foraEsquema: boolean;
  viajante: boolean;
  novoFrasco: boolean;
  viaAdministracao: string | null;
  localAplicacao: string | null;
  observacao: string | null;
  status: string;
  profissionalNome: string | null;
  profissionalConselho: string | null;
  profissionalRegistro: string | null;
  profissionalCns: string | null;
  unidadeNome: string | null;
  unidadeCnes: string | null;
  rndsSituacao: string | null;
  rndsUuid: string | null;
}

export type SearchResult =
  | { tipo: "paciente"; paciente: Paciente }
  | { tipo: "lista"; pacientes: PacienteResumo[] };
