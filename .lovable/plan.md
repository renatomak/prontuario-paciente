## Refatoração Hexagonal Feature-Based

Vou reorganizar o código atual (que já segue parcialmente Hexagonal com `adapters/`, `application/`, `ports/`, `domain/`) para a estrutura **feature-based** descrita, espelhando convenções Java do backend.

### 1. Nova árvore de diretórios

```text
src/
├── features/
│   ├── paciente/
│   │   ├── domain/
│   │   │   ├── PacienteRepository.ts          (porta / interface)
│   │   │   └── schemas.ts                     (Zod: PacienteSchema, EnderecoSchema)
│   │   ├── api/
│   │   │   ├── PacientePersistenceAdapter.ts  (axios / Java API)
│   │   │   └── PacienteMapper.ts              (DTO → Domain)
│   │   ├── hooks/
│   │   │   ├── useBuscarPaciente.ts
│   │   │   └── useCarregarPaciente.ts
│   │   ├── components/
│   │   │   ├── PacienteDados.tsx
│   │   │   ├── PacienteHeaderCard.tsx
│   │   │   └── PacientesPickerDialog.tsx
│   │   └── types/
│   │       ├── BuscarPacienteRequest.ts
│   │       ├── BuscarPacienteResponse.ts
│   │       └── PacienteProjection.ts
│   │
│   ├── vacina/
│   │   ├── domain/ (VacinaRepository.ts, schemas.ts)
│   │   ├── api/    (VacinaPersistenceAdapter.ts, VacinaMapper.ts)
│   │   ├── hooks/  (useListarVacinas, useObterVacinaDetalhe)
│   │   ├── components/ (VacinasTable.tsx, VacinaDetalheSheet.tsx)
│   │   └── types/  (ListarVacinasResponse, VacinaDetalheResponse)
│   │
│   ├── prontuario/
│   │   ├── domain/ (ProntuarioRepository.ts, schemas.ts)
│   │   ├── api/    (ProntuarioPersistenceAdapter.ts, ProntuarioMapper.ts)
│   │   ├── hooks/  (useObterProntuario)
│   │   ├── components/ (ProntuarioAtendimentos.tsx)
│   │   └── types/  (ObterProntuarioResponse)
│   │
│   └── raas/
│       ├── domain/ (RaasRepository.ts, schemas.ts)
│       ├── api/    (RaasPersistenceAdapter.ts, RaasMapper.ts)
│       ├── hooks/  (useListarArquivosRaas, useDownloadArquivosRaas)
│       ├── components/ (RaasArquivos.tsx, RaasFiltros.tsx, RaasTabela.tsx, RaasPaginacao.tsx)
│       └── types/  (ListarArquivosRaasRequest, ListarArquivosRaasResponse, ArquivoRaasProjection)
│
├── shared/
│   ├── http/HttpClient.ts            (axios base — movido de shared/http.ts)
│   ├── env.ts
│   └── ui/                           (shadcn permanece em components/ui)
│
├── pages/Index.tsx                   (apenas composição)
└── test/
    ├── features/
    │   ├── paciente/
    │   │   ├── BuscarPaciente.test.ts          (unitário do hook + mapper)
    │   │   └── PacientePersistenceAdapter.spec.ts (integração axios mock)
    │   ├── vacina/...
    │   ├── prontuario/...
    │   └── raas/
    │       └── ListarArquivosRaas.test.ts
    └── shared/HttpClient.test.ts
```

### 2. Princípios aplicados

- **Inversão de dependência**: hooks dependem da interface `XRepository` (domain). Em produção injetamos `XPersistenceAdapter`; em teste, um mock/builder.
- **Mapper isola DTO ↔ Domain** (ex.: `data_geracao` → `dataGeracao`).
- **Zod** valida tudo que entra da infraestrutura dentro do mapper.
- **Tipos com sufixos Java**: `Request`, `Response`, `Projection`.
- **Adapters com sufixo `PersistenceAdapter`** (axios/Java API). Caminho aberto para futuro `FileSystemAdapter` (Electron) sem tocar UI.
- **Hooks** = casos de uso (`useListarArquivosRaas`, `useDownloadArquivosRaas`...), com TanStack Query.
- **Testes em português**: `deveRetornarArquivosQuandoFiltroValido`, `deveLancarErroQuandoCpfInvalido`, com Builders (`PacienteBuilder`, `ArquivoRaasBuilder`).

### 3. Escopo da execução

Como a refatoração é ampla, proponho fazer em **4 PRs lógicas, uma por feature**, nesta ordem (cada uma compila e roda isolada):

1. **`shared/`** — mover `http.ts` → `shared/http/HttpClient.ts`, criar `Container` simples para injeção dos adapters.
2. **`features/raas/`** — feature mais nova e isolada, serve de referência viva do padrão. Inclui `ListarArquivosRaasRequest/Response`, `ArquivoRaasProjection`, mapper com Zod, `RaasPersistenceAdapter`, hooks `useListarArquivosRaas` (+ `useDownloadArquivosRaas` stub), quebra do `RaasArquivos.tsx` em `RaasFiltros`/`RaasTabela`/`RaasPaginacao`, e teste `ListarArquivosRaas.test.ts` com `ArquivoRaasBuilder` + adapter mockado.
3. **`features/paciente/` + `features/vacina/`** — migrar dos atuais `application/`, `adapters/java-api/`, `ports/`, `domain/models/` e `ui/hooks/` para a nova estrutura. Adicionar Zod nos mappers. Renomear hooks para casos de uso (`useBuscarPaciente`, `useCarregarPaciente`, `useListarVacinas`, `useObterVacinaDetalhe`).
4. **`features/prontuario/`** — mover `ProntuarioAtendimentos.tsx`, `lib/prontuarioApi.ts`, `JavaApiProntuarioAdapter.ts`. Criar `ProntuarioPersistenceAdapter` + Zod schema baseado em `prontuarioResponse.json`.

Em cada passo: atualizo `Index.tsx` para apontar para os novos caminhos e removo o arquivo antigo. `src/lib/CartaoVacinaPrint.ts` e `src/lib/ProntuarioPrint.ts` viram `features/<dominio>/print/` (geração de PDF é detalhe de UI/infra do domínio).

### 4. Detalhes técnicos relevantes

- **Container/DI** simples em `src/shared/container.ts` exportando instâncias singleton dos adapters; hooks importam do container, testes substituem via parâmetro opcional `repository?: XRepository`.
- **Vitest config** já existente continua funcionando — apenas adiciono pasta `src/test/features/...`.
- **Zod**: já está nas deps? Se não, adiciono `zod`.
- **Sem mudança de comportamento de UI** — apenas arquitetura. Endpoints, telas e fluxos seguem idênticos.

### 5. Pergunta antes de começar

Como são ~25 arquivos novos + remoções, confirme:

- **(a) Faço tudo de uma vez** (4 features na sequência, mensagem única, vai demorar)?
- **(b) Faço só o passo 1+2 (shared + raas)** como referência, e seguimos com paciente/vacina/prontuario nas próximas mensagens?

Recomendo **(b)** — entrega o padrão funcionando + testado rapidamente e você valida antes de propagar.
