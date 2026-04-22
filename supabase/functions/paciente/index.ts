import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders, jsonError, jsonOk, mapPaciente } from "../_shared/mappers.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const url = new URL(req.url);
  try {
    const id = Number(url.searchParams.get("id"));
    if (!id) return jsonError("id obrigatório", 400, url.pathname);
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data, error } = await supabase
      .from("usuario_cadsus")
      .select(`
        cd_usu_cadsus, nm_usuario, cpf, sg_sexo, nm_mae, nm_pai, dt_nascimento, nr_telefone,
        endereco:endereco_usuario_cadsus(
          keyword, nm_logradouro, nm_comp_logradouro, nr_logradouro, cep, nm_bairro,
          tipo_logradouro:tipo_logradouro_cadsus(ds_tipo_logradouro),
          cidade(cod_cid, descricao, estado(sigla))
        )
      `)
      .eq("cd_usu_cadsus", id)
      .maybeSingle();
    if (error) return jsonError(error.message, 500, url.pathname);
    if (!data) return jsonError("Paciente não encontrado", 404, url.pathname);
    return jsonOk(mapPaciente(data));
  } catch (e) {
    return jsonError((e as Error).message, 500, url.pathname);
  }
});
