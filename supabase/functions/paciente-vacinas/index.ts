import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders, jsonError, jsonOk, mapVacinaResumo } from "../_shared/mappers.ts";

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
      .from("vac_aplicacao")
      .select(`
        cd_vac_aplicacao, dt_aplicacao, ds_vacina, cd_doses, status,
        tipo_vacina(ds_vacina),
        calendario(ds_calendario)
      `)
      .eq("cd_usu_cadsus", id)
      .neq("status", 2)
      .order("dt_aplicacao", { ascending: true });
    if (error) return jsonError(error.message, 500, url.pathname);
    return jsonOk((data ?? []).map(mapVacinaResumo));
  } catch (e) {
    return jsonError((e as Error).message, 500, url.pathname);
  }
});
