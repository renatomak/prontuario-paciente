import { z as validarTipos } from "zod";

export const EnderecoSchema = validarTipos.object({
  keyword: validarTipos.string().nullable(),
  tipoLogradouro: validarTipos.string().nullable(),
  logradouro: validarTipos.string().nullable(),
  complemento: validarTipos.string().nullable(),
  numero: validarTipos.string().nullable(),
  cep: validarTipos.string().nullable(),
  bairro: validarTipos.string().nullable(),
  cidadeId: validarTipos.number().nullable(),
  cidade: validarTipos.string().nullable(),
  uf: validarTipos.string().nullable(),
});

export const PacienteSchema = validarTipos.object({
  id: validarTipos.number(),
  nome: validarTipos.string(),
  cpf: validarTipos.string().nullable(),
  sexo: validarTipos.string().nullable(),
  nomeMae: validarTipos.string().nullable(),
  nomePai: validarTipos.string().nullable(),
  dataNascimento: validarTipos.string().nullable(),
  telefone: validarTipos.string().nullable(),
  idade: validarTipos.string(),
  endereco: EnderecoSchema.nullable(),
  cdUsuCadsus: validarTipos.union([validarTipos.number(), validarTipos.string()]).nullable().optional(),
  cartaoSus: validarTipos.string().nullable().optional(),
  nomeSocial: validarTipos.string().nullable().optional(),
  paisNascimento: validarTipos.string().nullable().optional(),
  ufNascimento: validarTipos.string().nullable().optional(),
  municipioNascimento: validarTipos.string().nullable().optional(),
  raca: validarTipos.string().nullable().optional(),
  etnia: validarTipos.string().nullable().optional(),
  telefoneContato: validarTipos.string().nullable().optional(),
  email: validarTipos.string().nullable().optional(),
  paisEndereco: validarTipos.string().nullable().optional(),
});

export type EnderecoResponse = validarTipos.infer<typeof EnderecoSchema>;
export type PacienteResponse = validarTipos.infer<typeof PacienteSchema>;
