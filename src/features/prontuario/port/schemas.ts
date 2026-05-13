import { z } from "zod";

const EnderecoApiSchema = z.object({
  keyword: z.string().nullable().optional(),
  tipoLogradouro: z.string().nullable().optional(),
  logradouro: z.string().nullable().optional(),
  complemento: z.string().nullable().optional(),
  numero: z.string().nullable().optional(),
  cep: z.string().nullable().optional(),
  bairro: z.string().nullable().optional(),
  cidadeId: z.number().nullable().optional(),
  cidade: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
});

const PacienteApiSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cpf: z.string().nullable().optional(),
  sexo: z.string().nullable().optional(),
  nomeMae: z.string().nullable().optional(),
  nomePai: z.string().nullable().optional(),
  dataNascimento: z.string().nullable().optional(),
  telefone: z.string().nullable().optional(),
  endereco: EnderecoApiSchema.nullable().optional(),
  cdUsuCadsus: z.union([z.number(), z.string()]).nullable().optional(),
});

const RegistroSchema = z.object({
  data: z.string().nullable().optional(),
  tipo: z.string().nullable().optional(),
  conteudo: z.object({
    avaliacao: z.string().nullable().optional(),
    evolucao: z.string().nullable().optional(),
    exame: z.string().nullable().optional(),
  }),
});

const AtendimentoSchema = z.object({
  dataChegada: z.string().nullable().optional(),
  numeroAtendimento: z.string().nullable().optional(),
  tipoAtendimento: z.string().nullable().optional(),
  classificacaoRisco: z.string().nullable().optional(),
  possuiAih: z.boolean().optional(),
  aihDetalhes: z
    .object({
      dataCadastro: z.string().nullable().optional(),
      principaisSinais: z.string().nullable().optional(),
      condicoesInternacao: z.string().nullable().optional(),
      principaisResultados: z.string().nullable().optional(),
      diagnosticoInicial: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  unidade: z
    .object({ nome: z.string().nullable().optional(), telefone: z.string().nullable().optional() })
    .nullable()
    .optional(),
  profissional: z
    .object({
      nome: z.string().nullable().optional(),
      tipoConselho: z.string().nullable().optional(),
      registro: z.string().nullable().optional(),
      cbo: z.string().nullable().optional(),
      cboDescricao: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  registros: z.array(RegistroSchema).default([]),
});

export const ProntuarioResponseSchema = z.object({
  paciente: PacienteApiSchema,
  atendimentos: z.array(AtendimentoSchema).default([]),
});

export type ProntuarioResponse = z.infer<typeof ProntuarioResponseSchema>;
export type ProntuarioEndereco = z.infer<typeof EnderecoApiSchema>;
export type ProntuarioPaciente = z.infer<typeof PacienteApiSchema>;
export type ProntuarioRegistroConteudo = z.infer<typeof RegistroSchema>["conteudo"];
export type ProntuarioRegistro = z.infer<typeof RegistroSchema>;
export type ProntuarioAihDetalhes = NonNullable<z.infer<typeof AtendimentoSchema>["aihDetalhes"]>;
export type ProntuarioUnidade = NonNullable<z.infer<typeof AtendimentoSchema>["unidade"]>;
export type ProntuarioProfissional = NonNullable<z.infer<typeof AtendimentoSchema>["profissional"]>;
export type ProntuarioAtendimento = z.infer<typeof AtendimentoSchema>;
