import { z } from "zod";

export const EnderecoSchema = z.object({
  keyword: z.string().nullable(),
  tipoLogradouro: z.string().nullable(),
  logradouro: z.string().nullable(),
  complemento: z.string().nullable(),
  numero: z.string().nullable(),
  cep: z.string().nullable(),
  bairro: z.string().nullable(),
  cidadeId: z.number().nullable(),
  cidade: z.string().nullable(),
  uf: z.string().nullable(),
});

export const PacienteSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cpf: z.string().nullable(),
  sexo: z.string().nullable(),
  nomeMae: z.string().nullable(),
  nomePai: z.string().nullable(),
  dataNascimento: z.string().nullable(),
  telefone: z.string().nullable(),
  idade: z.string(),
  endereco: EnderecoSchema.nullable(),
  cdUsuCadsus: z.union([z.number(), z.string()]).nullable().optional(),
  cartaoSus: z.string().nullable().optional(),
  nomeSocial: z.string().nullable().optional(),
  paisNascimento: z.string().nullable().optional(),
  ufNascimento: z.string().nullable().optional(),
  municipioNascimento: z.string().nullable().optional(),
  raca: z.string().nullable().optional(),
  etnia: z.string().nullable().optional(),
  telefoneContato: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  paisEndereco: z.string().nullable().optional(),
});

export const PacienteResumoSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cpf: z.string().nullable(),
  dataNascimento: z.string().nullable(),
});

export type Endereco = z.infer<typeof EnderecoSchema>;
export type Paciente = z.infer<typeof PacienteSchema>;
export type PacienteResumo = z.infer<typeof PacienteResumoSchema>;
