# Features

Cada feature do MuscleBit é uma pasta aqui dentro, autocontida. A pasta `app/` guarda **apenas rotas**:
cada arquivo de rota importa uma tela de `src/features/<feature>/screens` e não carrega lógica de
negócio, chamada de API nem estilo complexo.

## Estrutura padrão

```
src/features/<feature>/
├── components/   # componentes visuais exclusivos da feature (usam src/shared/components/ui)
├── hooks/        # hooks da feature: composição de queries, mutations e store
├── screens/      # telas completas, importadas pelas rotas em app/
├── services/     # chamadas ao Supabase (único lugar que fala com "@/lib/supabase")
├── schemas/      # schemas zod (validação de formulários e de payloads)
├── store/        # stores Zustand da feature (estado de cliente)
├── types/        # tipos TypeScript da feature
└── index.ts      # API pública da feature: só exporte o que outras features podem usar
```

Crie apenas as subpastas que a feature realmente usa.

## Regras

- **Estado de servidor** (dados do Supabase) vive no TanStack Query. As query keys da feature
  seguem o padrão de factory em `src/lib/query/keys.ts`.
- **Estado de cliente** (UI, filtros, rascunhos) vive em Zustand, dentro de `store/`.
- **Estilo**: só via `useTheme()`. Nenhuma cor, fonte, tamanho ou espaçamento hardcoded.
- **Supabase**: `services/` importa o client de `"@/lib/supabase"`. O ESLint bloqueia
  `@supabase/supabase-js` fora de `src/lib/supabase`.
- **Entre features**: uma feature só importa de outra pelo `index.ts` dela.
- **Compartilhado**: o que for usado por duas ou mais features sobe para `src/shared/`.

## Exemplo de rota

```tsx
// app/exemplo.tsx
import { ExemploScreen } from '@/features/exemplo/screens/ExemploScreen';

export default ExemploScreen;
```
