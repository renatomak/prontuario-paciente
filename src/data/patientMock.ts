export interface MockEndereco {
  rua: string;
  cidade: string;
  quadra?: string;
  lote?: string;
}

export interface MockPaciente {
  id: string;
  nome: string;
  nomeSocial?: string | null;
  sexo: string;
  mae: string;
  dataNascimento: string;
  idade: string;
  cpf: string;
  cns: string;
  endereco: MockEndereco;
  telefone: string;
  celular: string;
}

export interface MockAtendimento {
  unidade: string;
  telefone?: string;
  chegada: string;
  profissional?: string;
  tipoRegistro?: string;
  classificacaoRisco?: string;
  conteudo?: string;
}

export interface MockDocumento {
  titulo: string;
  orgao: string;
  sistema: string;
  unidadeEmissora: string;
  prefeitura: string;
  emitidoPor: string;
  dataEmissao: string;
  sistema_versao: string;
  totalPaginas: number;
  enderecoUnidade: string;
  cidadeUnidade: string;
  telefoneUnidade: string;
}

export interface MockProntuario {
  documento: MockDocumento;
  paciente: MockPaciente;
  atendimentos: MockAtendimento[];
}

export const patientMockData: MockProntuario = {
  documento: {
    titulo: "PRONTUÁRIO DE ATENDIMENTOS",
    orgao: "Secretaria Municipal de Saúde de Goiânia - GO",
    sistema: "SUS - SISTEMA ÚNICO DE SAÚDE",
    unidadeEmissora: "UPA - VILA NOVA",
    prefeitura: "Prefeitura Municipal de Goiânia - GO",
    emitidoPor: "MARIA EDUARDA HUMMEL OLIVEIRA",
    dataEmissao: "18/08/2025 15:50 BRT",
    sistema_versao: "CELK Saúde v3.1.293.3 - CELK SISTEMAS LTDA",
    totalPaginas: 7,
    enderecoUnidade: "Industrial - Setor Leste Vila Nova - CEP 74635-040",
    cidadeUnidade: "GOIANIA - GO",
    telefoneUnidade: "(62) 3524-1824",
  },
  paciente: {
    id: "9282479",
    nome: "THALLYA VALENTINA GOMES RAMOS",
    nomeSocial: null,
    sexo: "FEMININO",
    mae: "NAYANNE GOMES SODRE RAMOS",
    dataNascimento: "30/06/2024",
    idade: "1 Ano e 1 Mês",
    cpf: "121.694.411-31",
    cns: "709.2012.7977.9639",
    endereco: {
      rua: "RUA RB 51 A, SN, Residencial Recanto do Bosque",
      cidade: "GOIANIA - GO",
      quadra: "51",
      lote: "72",
    },
    telefone: "(62) 99870-2201",
    celular: "(62) 99870-2201",
  },
  atendimentos: [
    {
      unidade: "UPA MARIA PIRES PERILLO - UPA NOROESTE",
      telefone: "(62) 3524-3461",
      chegada: "20/04/2025 07:12:54",
      profissional: "LUIS FELIPE PIRES FONTANA - CRM: 28160 CBO: (225124) MEDICO PEDIATRA",
      tipoRegistro: "Evolução",
      classificacaoRisco: "Pouco Urgente",
      conteudo:
        "RX - DISTENÇÃO ABDOMINAL EM PONTOS ESPECÍFICOS FLORA BACTERIANA AUMENTADA. Paciente apresenta quadro de desconforto abdominal há 2 dias, com episódios de vômito. Mãe refere febre baixa intermitente. Ao exame: abdome distendido, peristalse aumentada. Conduta: hidratação venosa, sintomáticos e observação por 6 horas.",
    },
    {
      unidade: "USF ALTO DO VALE",
      telefone: "(62) 3524-9000",
      chegada: "10/03/2025 14:22:10",
      profissional: "ENFERMEIRA DA ESTRATEGIA DE SAUDE DA FAMILIA",
      tipoRegistro: "Evolução",
      classificacaoRisco: "Não Urgente",
      conteudo:
        "Consulta de puericultura. Paciente em bom estado geral, ativa e reativa. Peso e estatura adequados para idade. Vacinação em dia. Orientações nutricionais à mãe. Retorno agendado em 30 dias.",
    },
    {
      unidade: "USF ALTO DO VALE",
      telefone: "(62) 3524-9000",
      chegada: "05/02/2025 09:15:00",
      profissional: "ENFERMEIRA DA ESTRATEGIA DE SAUDE DA FAMILIA",
      tipoRegistro: "Evolução",
      classificacaoRisco: "Não Urgente",
      conteudo: "Coleta teste do pezinho. Procedimento realizado sem intercorrências.",
    },
  ],
};
