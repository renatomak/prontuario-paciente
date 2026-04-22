import { supabase } from "@/integrations/supabase/client";

const FN_URL = `https://ssmxmfcophjtaltldkcx.supabase.co/functions/v1`;

async function callFn<T>(name: string, params: Record<string, string | number>): Promise<T> {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  };
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
  else headers.Authorization = `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`;

  const res = await fetch(`${FN_URL}/${name}?${qs}`, { headers });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.message ?? "Erro na requisição");
  return body as T;
}

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

export const api = {
  search: (query: string) => callFn<SearchResult>("pacientes-search", { query }),
  paciente: (id: number) => callFn<Paciente>("paciente", { id }),
  vacinas: (id: number) => callFn<VacinaResumo[]>("paciente-vacinas", { id }),
  vacinaDetalhe: (idAplicacao: number) =>
    callFn<VacinaDetalhe>("vacina-detalhe", { idAplicacao }),
};
