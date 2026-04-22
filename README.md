# Patient Passport

Sistema de Vacinação - Consulta de Pacientes

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
	- Copie o arquivo `.env` de exemplo (ou use o já existente) e ajuste as variáveis conforme necessário:
	  - `VITE_SUPABASE_URL` (URL do projeto Supabase)
	  - `VITE_SUPABASE_PUBLISHABLE_KEY` (chave pública do Supabase)
	  - `VITE_SUPABASE_PROJECT_ID` (opcional, apenas para referência)

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

- `src/` - Código-fonte principal (componentes, páginas, integrações)
- `public/` - Arquivos públicos (favicon, etc)
- `supabase/` - Funções e migrações do Supabase
- `insert_pacientes.js` - Script para popular pacientes de teste

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
