
# Patient Passport

Sistema de Vacinação - Consulta de Pacientes

## Arquitetura

O frontend segue Clean Code e Arquitetura Hexagonal (Ports & Adapters), desacoplado do backend Java.

**Principais camadas:**

- `src/domain/` — Modelos de domínio e regras puras
- `src/application/` — Use-cases (casos de uso/orquestração)
- `src/ports/` — Contratos (interfaces) para adapters
- `src/adapters/java-api/` — Implementações HTTP para API Java
- `src/shared/` — HTTP client, validação de env, utilidades
- `src/ui/` — Componentes, páginas, hooks de UI

**Legado:**
- Código Supabase e Node/Express foi movido para `legacy/`.

## Pré-requisitos

## Pré-requisitos

- Node.js (v18 ou superior recomendado)
- npm (v9 ou superior)

## Instalação

1. Clone o repositório:
	```sh
	git clone <url-do-repositorio>
	cd patient-passport
	```

2. Instale as dependências:
	```sh
	npm install
	```


3. Configure as variáveis de ambiente:
	 - Copie o arquivo `.env.example` ou crie `.env` com:
		 - `VITE_API_URL` (obrigatório, ex: http://localhost:8083)

> **Atenção:** Não é mais necessário configurar variáveis do Supabase.

## Rodando o Projeto

### Ambiente de Desenvolvimento

```sh
npm run dev
```
Acesse: http://localhost:8080 (ou http://localhost:8081 se a porta 8080 estiver ocupada)

### Build para Produção

```sh
npm run build
```

### Testes

```sh
npm run test
```


## Estrutura do Projeto

- `src/domain/models/` — Modelos de domínio (Paciente, Vacina, etc)
- `src/domain/utils/` — Funções utilitárias puras
- `src/application/` — Use-cases (ex: searchPaciente, listVacinasPaciente)
- `src/ports/` — Contratos (PacientePort, VacinaPort)
- `src/adapters/java-api/` — Adapters HTTP para API Java
- `src/shared/` — httpClient, ApiError, validação de env
- `src/ui/hooks/` — Hooks React Query (usePaciente, useVacinas...)
- `src/pages/` — Páginas (ex: Index.tsx)
- `legacy/` — Código legado (Supabase, Node)


## Testes

Testes unitários com [Vitest](https://vitest.dev/):

```sh
npx vitest run
```

## Dados de Teste

Para garantir que dois cidadãos de teste estejam disponíveis para o front-end, execute:

```sh
node insert_pacientes.js
```

Isso irá inserir/atualizar os pacientes de exemplo e suas vacinas no banco Supabase.

## Observações

- O projeto utiliza Vite, React, TailwindCSS, Supabase e outras bibliotecas modernas.
- Para customizar o favicon, substitua o arquivo em `public/favicon.ico`.
- As funções serverless do Supabase estão em `supabase/functions/`.

---
Em caso de dúvidas, consulte o código ou abra uma issue.
