import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders, jsonError, jsonOk, mapVacinaDetalhe } from "../_shared/mappers.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const url = new URL(req.url);
  try {
    const id = Number(url.searchParams.get("idAplicacao"));
    if (!id) return jsonError("idAplicacao obrigatório", 400, url.pathname);
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data, error } = await supabase
      .from("vac_aplicacao")
      .select(`
        *,
        tipo_vacina(ds_vacina),
        calendario(ds_calendario),
        fabricante(ds_fabricante, cnpj),
        profissional(nome, conselho, registro, cns),
        unidade(nome, cnes)
      `)
      .eq("cd_vac_aplicacao", id)
      .maybeSingle();
    if (error) return jsonError(error.message, 500, url.pathname);
    if (!data) return jsonError("Aplicação não encontrada", 404, url.pathname);
    return jsonOk(mapVacinaDetalhe(data));
  } catch (e) {
    return jsonError((e as Error).message, 500, url.pathname);
  }
});
