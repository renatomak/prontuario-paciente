/**
 * DTO bruto recebido do backend Java em snake_case.
 */
export interface PacienteProjection {
  id: number;
  nome: string;
  cpf?: string | null;
  sexo?: string | null;
  nome_mae?: string | null;
  nome_pai?: string | null;
  data_nascimento?: string | null;
  telefone?: string | null;
  idade?: string;
  endereco?: EnderecoProjection | null;
  cd_usu_cadsus?: number | string | null;
  cartao_sus?: string | null;
  nome_social?: string | null;
  pais_nascimento?: string | null;
  uf_nascimento?: string | null;
  municipio_nascimento?: string | null;
  raca?: string | null;
  etnia?: string | null;
  telefone_contato?: string | null;
  email?: string | null;
  pais_endereco?: string | null;
}

export interface EnderecoProjection {
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

export interface PacienteResumoProjection {
  id: number;
  nome: string;
  cpf: string | null;
  dataNascimento: string | null;
}
