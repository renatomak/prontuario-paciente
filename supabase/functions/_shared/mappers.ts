// Helpers de mapeamento DB -> DTO simplificado

export function calcIdade(dtNascimento: string | null): string {
  if (!dtNascimento) return "";
  const nasc = new Date(dtNascimento);
  const hoje = new Date();
  let anos = hoje.getFullYear() - nasc.getFullYear();
  let meses = hoje.getMonth() - nasc.getMonth();
  let dias = hoje.getDate() - nasc.getDate();
  if (dias < 0) {
    meses--;
    const prevMonth = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
    dias += prevMonth.getDate();
  }
  if (meses < 0) {
    anos--;
    meses += 12;
  }
  return `${anos}a ${meses}m ${dias}d`;
}

export function doseLabel(cd: number | null): string {
  switch (cd) {
    case 1: return "1ª Dose";
    case 2: return "2ª Dose";
    case 3: return "3ª Dose";
    case 4: return "4ª Dose";
    case 5: return "Dose Única";
    case 6: return "Reforço";
    case 7: return "1º Reforço";
    case 8: return "2º Reforço";
    case 9: return "Dose Única";
    case 10: return "Dose Inicial";
    case 38: return "Reforço";
    default: return cd != null ? String(cd) : "";
  }
}

export function statusLabel(s: number | null): string {
  switch (s) {
    case 1: return "Aplicada";
    case 2: return "Cancelada";
    case 3: return "Aprazada";
    default: return s != null ? String(s) : "";
  }
}

export function mapPaciente(row: any) {
  return {
    id: row.cd_usu_cadsus,
    nome: row.nm_usuario,
    cpf: row.cpf,
    sexo: row.sg_sexo,
    nomeMae: row.nm_mae,
    nomePai: row.nm_pai,
    dataNascimento: row.dt_nascimento,
    telefone: row.nr_telefone,
    idade: calcIdade(row.dt_nascimento),
    endereco: row.endereco
      ? {
          keyword: row.endereco.keyword,
          tipoLogradouro: row.endereco.tipo_logradouro?.ds_tipo_logradouro ?? null,
          logradouro: row.endereco.nm_logradouro,
          complemento: row.endereco.nm_comp_logradouro,
          numero: row.endereco.nr_logradouro,
          cep: row.endereco.cep,
          bairro: row.endereco.nm_bairro,
          cidadeId: row.endereco.cidade?.cod_cid ?? null,
          cidade: row.endereco.cidade?.descricao ?? null,
          uf: row.endereco.cidade?.estado?.sigla ?? null,
        }
      : null,
  };
}

export function mapResumo(row: any) {
  return {
    id: row.cd_usu_cadsus,
    nome: row.nm_usuario,
    cpf: row.cpf,
    dataNascimento: row.dt_nascimento,
  };
}

export function mapVacinaResumo(row: any) {
  return {
    idAplicacao: row.cd_vac_aplicacao,
    dataAplicacao: row.dt_aplicacao,
    nomeVacina: row.tipo_vacina?.ds_vacina ?? row.ds_vacina,
    dose: doseLabel(row.cd_doses),
    estrategia: row.calendario?.ds_calendario ?? null,
    status: statusLabel(row.status),
  };
}

export function mapVacinaDetalhe(row: any) {
  return {
    idAplicacao: row.cd_vac_aplicacao,
    nrAtendimento: row.nr_atendimento,
    doseCodigo: row.cd_doses,
    dose: doseLabel(row.cd_doses),
    estrategia: row.calendario?.ds_calendario ?? null,
    nomeVacina: row.tipo_vacina?.ds_vacina ?? row.ds_vacina,
    descricaoVacina: row.ds_vacina,
    lote: row.lote,
    validadeLote: row.dt_validade,
    fabricanteNome: row.fabricante?.ds_fabricante ?? null,
    fabricanteCnpj: row.fabricante?.cnpj ?? null,
    dataAplicacao: row.dt_aplicacao,
    localAtendimento: row.local_atendimento,
    turno: row.turno,
    grupoAtendimento: row.grupo_atendimento,
    gestante: row.gestante,
    puerpera: row.puerpera,
    historico: row.historico,
    foraEsquema: row.fora_esquema,
    viajante: row.viajante,
    novoFrasco: row.novo_frasco,
    viaAdministracao: row.via_administracao,
    localAplicacao: row.local_aplicacao,
    observacao: row.observacao,
    status: statusLabel(row.status),
    profissionalNome: row.profissional?.nome ?? null,
    profissionalConselho: row.profissional?.conselho ?? null,
    profissionalRegistro: row.profissional?.registro ?? null,
    profissionalCns: row.profissional?.cns ?? null,
    unidadeNome: row.unidade?.nome ?? null,
    unidadeCnes: row.unidade?.cnes ?? null,
    rndsSituacao: row.rnds_situacao,
    rndsUuid: row.rnds_uuid,
  };
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export function jsonError(message: string, status: number, path: string) {
  return new Response(
    JSON.stringify({ message, timestamp: new Date().toISOString(), path }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

export function jsonOk(data: unknown) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
