export interface PacienteProjection {
  id: number;
  nome: string;
  cpf?: string | null;
  sexo?: string | null;
  nomeMae?: string | null;
  nomePai?: string | null;
  dataNascimento?: string | null;
  telefone?: string | null;
  idade?: string;
  endereco?: EnderecoProjection | null;
  cdUsuCadsus?: number | string | null;
  cartaoSus?: string | null;
  nomeSocial?: string | null;
  paisNascimento?: string | null;
  ufNascimento?: string | null;
  municipioNascimento?: string | null;
  raca?: string | null;
  etnia?: string | null;
  telefoneContato?: string | null;
  email?: string | null;
  paisEndereco?: string | null;
}

export interface EnderecoProjection {
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

export interface PacienteResumoProjection {
  id: number;
  nome: string;
  cpf: string | null;
  dataNascimento: string | null;
}
