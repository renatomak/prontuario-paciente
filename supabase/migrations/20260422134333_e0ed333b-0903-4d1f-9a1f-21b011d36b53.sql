-- Lookup tables
CREATE TABLE public.estado (
  cod_est SERIAL PRIMARY KEY,
  sigla TEXT NOT NULL,
  nome TEXT NOT NULL
);

CREATE TABLE public.cidade (
  cod_cid SERIAL PRIMARY KEY,
  cod_est INT NOT NULL REFERENCES public.estado(cod_est),
  descricao TEXT NOT NULL
);

CREATE TABLE public.tipo_logradouro_cadsus (
  cd_tipo_logradouro SERIAL PRIMARY KEY,
  ds_tipo_logradouro TEXT NOT NULL
);

CREATE TABLE public.endereco_usuario_cadsus (
  cd_endereco SERIAL PRIMARY KEY,
  keyword TEXT,
  cd_tipo_logradouro INT REFERENCES public.tipo_logradouro_cadsus(cd_tipo_logradouro),
  nm_logradouro TEXT,
  nm_comp_logradouro TEXT,
  nr_logradouro TEXT,
  cep TEXT,
  nm_bairro TEXT,
  cod_cid INT REFERENCES public.cidade(cod_cid)
);

CREATE TABLE public.usuario_cadsus (
  cd_usu_cadsus SERIAL PRIMARY KEY,
  nm_usuario TEXT NOT NULL,
  cpf TEXT,
  sg_sexo TEXT,
  nm_mae TEXT,
  nm_pai TEXT,
  dt_nascimento DATE,
  nr_telefone TEXT,
  cd_endereco INT REFERENCES public.endereco_usuario_cadsus(cd_endereco)
);

CREATE INDEX idx_usuario_cpf ON public.usuario_cadsus(cpf);
CREATE INDEX idx_usuario_nome ON public.usuario_cadsus(nm_usuario);

CREATE TABLE public.tipo_vacina (
  cd_tipo_vacina SERIAL PRIMARY KEY,
  ds_vacina TEXT NOT NULL
);

CREATE TABLE public.calendario (
  cd_calendario SERIAL PRIMARY KEY,
  ds_calendario TEXT NOT NULL
);

CREATE TABLE public.fabricante (
  cd_fabricante SERIAL PRIMARY KEY,
  ds_fabricante TEXT NOT NULL,
  cnpj TEXT
);

CREATE TABLE public.profissional (
  cd_profissional SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  conselho TEXT,
  registro TEXT,
  cns TEXT
);

CREATE TABLE public.unidade (
  cd_unidade SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cnes TEXT
);

CREATE TABLE public.vac_aplicacao (
  cd_vac_aplicacao SERIAL PRIMARY KEY,
  cd_usu_cadsus INT NOT NULL REFERENCES public.usuario_cadsus(cd_usu_cadsus) ON DELETE CASCADE,
  cd_tipo_vacina INT REFERENCES public.tipo_vacina(cd_tipo_vacina),
  cd_calendario INT REFERENCES public.calendario(cd_calendario),
  cd_fabricante INT REFERENCES public.fabricante(cd_fabricante),
  cd_profissional INT REFERENCES public.profissional(cd_profissional),
  cd_unidade INT REFERENCES public.unidade(cd_unidade),
  ds_vacina TEXT,
  cd_doses INT,
  lote TEXT,
  dt_validade DATE,
  dt_aplicacao DATE NOT NULL,
  nr_atendimento TEXT,
  local_atendimento TEXT,
  turno TEXT,
  grupo_atendimento TEXT,
  gestante BOOLEAN DEFAULT false,
  puerpera BOOLEAN DEFAULT false,
  historico BOOLEAN DEFAULT false,
  fora_esquema BOOLEAN DEFAULT false,
  viajante BOOLEAN DEFAULT false,
  novo_frasco BOOLEAN DEFAULT false,
  via_administracao TEXT,
  local_aplicacao TEXT,
  observacao TEXT,
  status INT DEFAULT 1,
  rnds_situacao TEXT,
  rnds_uuid TEXT
);

CREATE INDEX idx_vac_paciente ON public.vac_aplicacao(cd_usu_cadsus);
CREATE INDEX idx_vac_data ON public.vac_aplicacao(dt_aplicacao);

-- Enable RLS, public read-only (dados de demonstração não-sensíveis)
ALTER TABLE public.estado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipo_logradouro_cadsus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.endereco_usuario_cadsus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario_cadsus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipo_vacina ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabricante ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profissional ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vac_aplicacao ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['estado','cidade','tipo_logradouro_cadsus','endereco_usuario_cadsus','usuario_cadsus','tipo_vacina','calendario','fabricante','profissional','unidade','vac_aplicacao'])
  LOOP
    EXECUTE format('CREATE POLICY "Public read %I" ON public.%I FOR SELECT USING (true);', t, t);
  END LOOP;
END $$;