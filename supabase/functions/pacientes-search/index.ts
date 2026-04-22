import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  corsHeaders,
  jsonError,
  jsonOk,
  mapPaciente,
  mapResumo,
} from "../_shared/mappers.ts";

const PACIENTE_SELECT = `
  cd_usu_cadsus, nm_usuario, cpf, sg_sexo, nm_mae, nm_pai, dt_nascimento, nr_telefone,
  endereco:endereco_usuario_cadsus(
    keyword, nm_logradouro, nm_comp_logradouro, nr_logradouro, cep, nm_bairro,
    tipo_logradouro:tipo_logradouro_cadsus(ds_tipo_logradouro),
    cidade(cod_cid, descricao, estado(sigla))
  )
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  const url = new URL(req.url);
  try {
    const query = (url.searchParams.get("query") ?? "").trim();
    if (!query) return jsonError("query é obrigatório", 400, url.pathname);

    const digits = query.replace(/\D/g, "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (digits.length === 11) {
      // CPF: busca exata, retorna PacienteDTO ou 404
      const { data, error } = await supabase
        .from("usuario_cadsus")
        .select(PACIENTE_SELECT)
        .eq("cpf", digits)
        .maybeSingle();
      if (error) return jsonError(error.message, 500, url.pathname);
      if (!data) return jsonError("Paciente não encontrado", 404, url.pathname);
      return jsonOk({ tipo: "paciente", paciente: mapPaciente(data) });
    } else {
      // Nome: busca parcial, retorna lista de resumo
      const { data, error } = await supabase
        .from("usuario_cadsus")
        .select("cd_usu_cadsus, nm_usuario, cpf, dt_nascimento")
        .ilike("nm_usuario", `%${query}%`)
        .order("nm_usuario", { ascending: true })
        .limit(50);
      if (error) return jsonError(error.message, 500, url.pathname);
      return jsonOk({
        tipo: "lista",
        pacientes: (data ?? []).map(mapResumo),
      });
    }
  } catch (e) {
    return jsonError((e as Error).message, 500, url.pathname);
  }
});
