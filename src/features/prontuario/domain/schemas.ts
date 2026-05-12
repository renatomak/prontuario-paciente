import { z } from "zod";

const EnderecoApiSchema = z.object({
  keyword: z.string().nullable().optional(),
  tipo_logradouro: z.string().nullable().optional(),
  logradouro: z.string().nullable().optional(),
  complemento: z.string().nullable().optional(),
  numero: z.string().nullable().optional(),
  cep: z.string().nullable().optional(),
  bairro: z.string().nullable().optional(),
  cidade_id: z.number().nullable().optional(),
  cidade: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
});

const PacienteApiSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cpf: z.string().nullable().optional(),
  sexo: z.string().nullable().optional(),
  nome_mae: z.string().nullable().optional(),
  nome_pai: z.string().nullable().optional(),
  data_nascimento: z.string().nullable().optional(),
  telefone: z.string().nullable().optional(),
  endereco: EnderecoApiSchema.nullable().optional(),
  cd_usu_cadsus: z.union([z.number(), z.string()]).nullable().optional(),
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
  data_chegada: z.string().nullable().optional(),
  numero_atendimento: z.string().nullable().optional(),
  tipo_atendimento: z.string().nullable().optional(),
  classificacao_risco: z.string().nullable().optional(),
  possui_aih: z.boolean().optional(),
  aih_detalhes: z
    .object({
      data_cadastro: z.string().nullable().optional(),
      principais_sinais: z.string().nullable().optional(),
      condicoes_internacao: z.string().nullable().optional(),
      principais_resultados: z.string().nullable().optional(),
      diagnostico_inicial: z.string().nullable().optional(),
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
      tipo_conselho: z.string().nullable().optional(),
      registro: z.string().nullable().optional(),
      cbo: z.string().nullable().optional(),
      cbo_descricao: z.string().nullable().optional(),
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
