import { z as validarTipos } from "zod";

export const PacienteResumoSchema = validarTipos.object({
  id: validarTipos.number(),
  nome: validarTipos.string(),
  cpf: validarTipos.string().nullable(),
  dataNascimento: validarTipos.string().nullable(),
});

export type PacienteResumoResponse = validarTipos.infer<typeof PacienteResumoSchema>;

import type { PacienteResponse } from "./CarregarPacienteResponse";

export type BuscarPacienteResponse =
  | { tipo: "paciente"; paciente: PacienteResponse }
  | { tipo: "lista"; pacientes: PacienteResumoResponse[] };
