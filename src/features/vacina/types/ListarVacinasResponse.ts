import { z as validarTipos } from "zod";

export const VacinaResumoSchema = validarTipos.object({
  idAplicacao: validarTipos.number(),
  dataAplicacao: validarTipos.string(),
  nomeVacina: validarTipos.string(),
  dose: validarTipos.string(),
  estrategia: validarTipos.string().nullable(),
  status: validarTipos.string(),
  laboratorio: validarTipos.string().nullable().optional(),
  estabelecimento: validarTipos.string().nullable().optional(),
  profissional: validarTipos.string().nullable().optional(),
  lote: validarTipos.string().nullable().optional(),
});

export type VacinaResumoResponse = validarTipos.infer<typeof VacinaResumoSchema>;
