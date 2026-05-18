import { z as validarTipos } from "zod";

const EnderecoApiSchema = validarTipos.object({
  keyword: validarTipos.string().nullable().optional(),
  tipoLogradouro: validarTipos.string().nullable().optional(),
  logradouro: validarTipos.string().nullable().optional(),
  complemento: validarTipos.string().nullable().optional(),
  numero: validarTipos.string().nullable().optional(),
  cep: validarTipos.string().nullable().optional(),
  bairro: validarTipos.string().nullable().optional(),
  cidadeId: validarTipos.number().nullable().optional(),
  cidade: validarTipos.string().nullable().optional(),
  uf: validarTipos.string().nullable().optional(),
});

const PacienteApiSchema = validarTipos.object({
  id: validarTipos.number(),
  nome: validarTipos.string(),
  cpf: validarTipos.string().nullable().optional(),
  sexo: validarTipos.string().nullable().optional(),
  nomeMae: validarTipos.string().nullable().optional(),
  nomePai: validarTipos.string().nullable().optional(),
  dataNascimento: validarTipos.string().nullable().optional(),
  telefone: validarTipos.string().nullable().optional(),
  endereco: EnderecoApiSchema.nullable().optional(),
  cdUsuCadsus: validarTipos.union([validarTipos.number(), validarTipos.string()]).nullable().optional(),
});

const RegistroSchema = validarTipos.object({
  data: validarTipos.string().nullable().optional(),
  tipo: validarTipos.string().nullable().optional(),
  conteudo: validarTipos.object({
    avaliacao: validarTipos.string().nullable().optional(),
    evolucao: validarTipos.string().nullable().optional(),
    exame: validarTipos.string().nullable().optional(),
  }),
});

const AtendimentoSchema = validarTipos.object({
  dataChegada: validarTipos.string().nullable().optional(),
  numeroAtendimento: validarTipos.string().nullable().optional(),
  tipoAtendimento: validarTipos.string().nullable().optional(),
  classificacaoRisco: validarTipos.string().nullable().optional(),
  possuiAih: validarTipos.boolean().optional(),
  aihDetalhes: validarTipos
    .object({
      dataCadastro: validarTipos.string().nullable().optional(),
      principaisSinais: validarTipos.string().nullable().optional(),
      condicoesInternacao: validarTipos.string().nullable().optional(),
      principaisResultados: validarTipos.string().nullable().optional(),
      diagnosticoInicial: validarTipos.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  unidade: validarTipos
    .object({ nome: validarTipos.string().nullable().optional(), telefone: validarTipos.string().nullable().optional() })
    .nullable()
    .optional(),
  profissional: validarTipos
    .object({
      nome: validarTipos.string().nullable().optional(),
      tipoConselho: validarTipos.string().nullable().optional(),
      registro: validarTipos.string().nullable().optional(),
      cbo: validarTipos.string().nullable().optional(),
      cboDescricao: validarTipos.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  registros: validarTipos.array(RegistroSchema).default([]),
});

export const ProntuarioResponseSchema = validarTipos.object({
  paciente: PacienteApiSchema,
  atendimentos: validarTipos.array(AtendimentoSchema).default([]),
});

export type ProntuarioResponse = validarTipos.infer<typeof ProntuarioResponseSchema>;
export type ProntuarioEndereco = validarTipos.infer<typeof EnderecoApiSchema>;
export type ProntuarioPaciente = validarTipos.infer<typeof PacienteApiSchema>;
export type ProntuarioRegistroConteudo = validarTipos.infer<typeof RegistroSchema>["conteudo"];
export type ProntuarioRegistro = validarTipos.infer<typeof RegistroSchema>;
export type ProntuarioAihDetalhes = NonNullable<validarTipos.infer<typeof AtendimentoSchema>["aihDetalhes"]>;
export type ProntuarioUnidade = NonNullable<validarTipos.infer<typeof AtendimentoSchema>["unidade"]>;
export type ProntuarioProfissional = NonNullable<validarTipos.infer<typeof AtendimentoSchema>["profissional"]>;
export type ProntuarioAtendimento = validarTipos.infer<typeof AtendimentoSchema>;
