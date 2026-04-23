
import type { Paciente, PacienteResumo, SearchResult, VacinaResumo, VacinaDetalhe } from "../domain/models";
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


export const api = {
  search: (query: string) => callFn<SearchResult>("pacientes-search", { query }),
  paciente: (id: number) => callFn<Paciente>("paciente", { id }),
  vacinas: (id: number) => callFn<VacinaResumo[]>("paciente-vacinas", { id }),
  vacinaDetalhe: (idAplicacao: number) =>
    callFn<VacinaDetalhe>("vacina-detalhe", { idAplicacao }),
};
