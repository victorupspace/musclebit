# MuscleBit

App React Native (Expo SDK 57) com Expo Router, TypeScript strict, design system próprio, Zustand,
TanStack Query e Supabase.

## Rodando

```bash
npm install
npx expo start
```

Abra no Expo Go (iOS/Android) ou pressione `i` / `a` para simulador/emulador. O app roda sem
`.env.local`: o Supabase fica desativado até as credenciais existirem.

### Simulador iOS

```bash
npm run ios:sim
```

Abre o simulador com o Expo Go do SDK 57 (baixado pelo CLI, sem depender da App Store). O script
faz duas coisas que o `expo start` sozinho não faz nesta máquina:

- `--go`: com o `expo-dev-client` instalado, o CLI exige um development build e recusa o Expo Go.
- `DEVELOPER_DIR=...`: o sistema aponta para as Command Line Tools, não para o Xcode. Para corrigir
  de vez e voltar a usar só `npx expo start` + `i`:

  ```bash
  sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
  ```

Scripts:

| Script                 | O que faz                                          |
| ---------------------- | -------------------------------------------------- |
| `npm run typecheck`    | `tsc --noEmit`                                     |
| `npm run lint`         | ESLint (config do Expo + Prettier + regras do app) |
| `npm run lint:fix`     | ESLint com correção automática                     |
| `npm run format`       | Prettier em todo o projeto                         |
| `npm run format:check` | Prettier só verificando                            |
| `npm run check`        | typecheck + lint + format:check                    |

## Stack

| Camada             | Escolha                                                    |
| ------------------ | ---------------------------------------------------------- |
| Framework          | Expo SDK 57 + React Native 0.86                            |
| Linguagem          | TypeScript 6 em modo `strict`                              |
| Navegação          | Expo Router (rotas por arquivo, typed routes)              |
| Estilo             | `StyleSheet` + tokens em `src/theme` (sem lib de UI)       |
| Estado de cliente  | Zustand                                                    |
| Estado de servidor | TanStack Query                                             |
| Formulários        | react-hook-form + zod (instalados, ainda sem configuração) |
| Backend            | Supabase                                                   |
| Animação           | react-native-reanimated 4                                  |

## Estrutura

```
app/                      # SÓ rotas. Cada arquivo importa uma tela de src/features e nada mais.
├── _layout.tsx           # providers globais (tema, query, sessão) + gate da splash
├── index.tsx             # tela inicial (placeholder)
└── +not-found.tsx

src/
├── features/             # uma pasta por feature (ver src/features/README.md)
│   ├── auth/             # boas-vindas, login e cadastro do aluno
│   └── onboarding/       # perfil, modo de treino, vínculo com profissional, atuação
├── shared/
│   ├── components/ui/    # Text, Button, IconButton, OptionCard, TextField, PasswordField, OtpInput, Select, StepProgress, BottomSheet, Divider, AnimatedCheckBadge, Screen, Icon, Radio, RadioOption (cresce só quando 2+ features precisarem)
│   ├── components/       # RootStack e outros componentes de infraestrutura
│   ├── hooks/ utils/ types/ constants/
├── theme/                # tokens: colors, spacing, typography, radius, sizes, motion
│   ├── ThemeProvider.tsx # resolve claro/escuro e pinta a janela nativa (expo-system-ui)
│   ├── useTheme.ts       # único jeito de ler tokens em componentes
│   └── useThemeFonts.ts  # carrega as fontes (condição da splash)
├── splash/               # splash em JS, hook de readiness, gate
├── lib/
│   ├── supabase/         # client, tipos do banco, erros, SessionProvider
│   ├── query/            # queryClient e query key factories
│   └── storage/          # wrapper tipado do AsyncStorage
└── config/env.ts         # leitura e validação (zod) das env vars

assets/                   # ícones e imagem da splash (ver "Assets" abaixo)
app.config.ts             # config do Expo; lê cores e medidas de src/theme
eas.json                  # perfis development, preview, production
```

## Fluxo de entrada (sem sessão)

Rotas em `app/(auth)/`, na ordem em que aparecem:

```
welcome ─┬─ "Começar agora" → profile-type
         │      ├─ Sou Aluno → training-mode
         │      │      ├─ Tenho um profissional → professional-link → student-signup/step-1
         │      │      └─ Faço tudo sozinho ───────────────────────→ student-signup/step-1
         │      │                                  step-1 → step-2 → account-created
         │      └─ Sou Profissional → professional-role (próxima etapa ainda não existe)
         └─ "Já tenho uma conta" → login → forgot-password → verify-code → reset-password → reset-success
```

As escolhas do onboarding ficam em `useOnboardingStore` (perfil, modo de treino, vínculo com o
profissional, atuação); os dados de cadastro em `useSignupStore`. Ambos em memória.

Alias: `@/*` aponta para `src/*` (só no `tsconfig.json`; o Metro lê de lá, sem plugin de Babel).

## Tema

Tokens em `src/theme`. Regra: **nenhuma cor, fonte, tamanho ou espaçamento fora de `src/theme`**.

- **Cores**: paleta bruta (`palette`) extraída da arte da splash e tokens semânticos
  (`colors.background`, `colors.primary`, ...) resolvidos por `useTheme()` para claro/escuro.
- **Tipografia**: Archivo é a fonte oficial de todo o projeto (pesos 400 a 800), com variantes
  explícitas em `typography.ts`. O peso está no nome da família, não em `fontWeight`. O wordmark
  "MUSCLEBIT" não é texto: é a arte em pixel (`assets/wordmark-*.png`).
- **Espaçamento**: escala de 4pt, `spacing[n]` = n × 4.
- **Raio**: cantos quase retos (`radius.sm`/`md`/`lg`) em superfícies, coerente com o pixel art.
  CTAs usam `radius.xl` (18px), conforme a spec de design.
- **Tema claro/escuro**: segue o sistema. Para forçar, passe `scheme` ao `ThemeProvider`.

Componentes base em `src/shared/components/ui` com variantes tipadas por union type:

```tsx
<Text variant="heading" color="textMuted" />
<Button label="Salvar" variant="primary" size="lg" loading />
<Screen background="surface" padded={false} />
```

## Ícones

Todos os ícones vêm do **Material Symbols Rounded**, via o componente `Icon`:

```tsx
<Icon name="fitness_center" size="md" color="primary" />
```

A fonte em `assets/fonts/MaterialSymbolsRounded.ttf` é um subconjunto (poucos KB) gerado a partir
da fonte variável oficial, instanciada em peso 400, sem preenchimento. Para adicionar um ícone:

1. Procure o nome em https://fonts.google.com/icons.
2. Inclua o nome em `assets/fonts/material-symbols.json`.
3. Rode `python3 scripts/generate-icon-font.py` (requer `pip3 install fonttools`).

O script regenera a fonte e o mapa tipado `codepoints.ts`; nomes fora da lista falham no typecheck.

## Splash

Duas camadas para não haver flash branco entre a splash nativa e o primeiro render:

1. **Nativa**: plugin `expo-splash-screen` em `app.config.ts`. Cor e largura da imagem vêm de
   `src/theme` (`SPLASH_BACKGROUND_COLOR`, `sizes.splashLogoWidth`).
2. **JS** (`src/splash/SplashScreen.tsx`): replica a nativa por cima do app. A nativa é escondida
   quando a imagem da camada JS termina de carregar; a JS faz fade + scale com Reanimated e
   respeita "reduzir movimento" (sem animação).

`useSplash()` centraliza as condições de readiness. Hoje: fontes, tema resolvido e sessão inicial.
Para adicionar uma condição, inclua um item em `conditions` no `SplashGate`:

```ts
{ key: 'remote-config', ready: configLoaded, error: configError }
```

Constantes em `src/splash/constants.ts`: tempo mínimo (`SPLASH_MIN_DURATION_MS`, 2800ms) e timeout
de escape (`SPLASH_ESCAPE_TIMEOUT_MS`, 8s). Estourado o timeout, a splash sai mesmo assim e o hook
expõe `timedOut` e `pendingKeys`. Uma condição com `error` não bloqueia.

Atenção: no Expo Go e em dev builds a splash nativa não reproduz exatamente o release. Valide
em build de preview.

## Assets

Placeholders sólidos gerados nas dimensões corretas. Troque pela arte real mantendo nome e tamanho:

| Arquivo                              | Tamanho   | Uso                                                                                                                                            |
| ------------------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets/icon.png`                    | 1024×1024 | Ícone do app (iOS e fallback). Sem transparência, sem cantos                                                                                   |
| `assets/musclebit.png`               | 102×96    | Arte original da logo (pixel art). Fonte do `splash-icon.png`                                                                                  |
| `assets/dumbbell.png`                | 1152×888  | Só o halter, gerado pelo mesmo script. Usado onde o wordmark é texto (tela de boas-vindas)                                                     |
| `assets/splash-icon.png`             | 1224×1152 | Logo da splash, gerada por `scripts/generate-brand-assets.py` (upscale 12x nearest-neighbor). Exibida com 163pt de largura em ambas as camadas |
| `assets/android-icon-foreground.png` | 1024×1024 | Camada frontal do ícone adaptativo. Conteúdo dentro dos 66% centrais                                                                           |
| `assets/android-icon-background.png` | 1024×1024 | Camada de fundo do ícone adaptativo (navy sólido)                                                                                              |
| `assets/android-icon-monochrome.png` | 1024×1024 | Ícone temático do Android 13+: silhueta branca, fundo transparente                                                                             |
| `assets/favicon.png`                 | 48×48     | Favicon do web                                                                                                                                 |

Para trocar a logo da splash: substitua `assets/musclebit.png` (fundo transparente) e rode
`python3 scripts/generate-brand-assets.py` (requer Pillow). O upscale nearest-neighbor mantém o pixel
art nítido; se a nova arte não for pixel art, salve direto em `splash-icon.png` com 1024px ou mais.
Depois de trocar, a splash nativa só reflete a mudança em um build novo.

## Supabase

Fundação pronta em `src/lib/supabase`. Sem credenciais, `supabase` é `null` e o `SessionProvider`
resolve com `session = null` e `configurado = false`.

1. Copie `.env.example` para `.env.local` e preencha `EXPO_PUBLIC_SUPABASE_URL` e
   `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Reinicie o `expo start` (env vars são inlined no bundle).
2. Gere os tipos do banco:

   ```bash
   npx supabase gen types typescript --project-id <ID> --schema public > src/lib/supabase/database.types.ts
   ```

3. Fora de `src/lib/supabase`, importe **sempre** de `@/lib/supabase` (`supabase`, `useSession`,
   `toAppError`, tipos). O ESLint bloqueia `@supabase/supabase-js` em qualquer outro lugar.

Decisões registradas no código: sessão no AsyncStorage (SecureStore tem limite de 2 KB no Android),
`autoRefreshToken` ligado só com o app em primeiro plano (listener de `AppState`),
`detectSessionInUrl: false`.

### Adicionando os grupos `(auth)` e `(app)`

Quando a autenticação entrar:

```
app/
├── _layout.tsx        # continua como está
├── (auth)/
│   ├── _layout.tsx    # <Stack /> das telas públicas
│   ├── login.tsx
│   └── cadastro.tsx
└── (app)/
    ├── _layout.tsx    # redireciona para /(auth)/login se !session
    └── index.tsx
```

No `(app)/_layout.tsx`, leia `useSession()` e use `<Redirect href="/(auth)/login" />` quando não
houver sessão. Como a splash só sai após a sessão inicial resolver, o redirect nunca pisca. O
`app/index.tsx` atual vira `<Redirect />` para o grupo certo.

## TanStack Query

`src/lib/query/queryClient.ts` define `staleTime` (1 min) e `gcTime` (5 min), com refetch ao voltar
para primeiro plano via `AppState`. `keys.ts` traz a factory de query keys com um bloco `example`
para copiar. Persistência offline: ponto de extensão comentado no `queryClient.ts`.

## Builds (EAS)

`eas.json` tem os perfis `development` (dev client, distribuição interna), `preview` (APK interno)
e `production` (auto-incremento de versão). A versão do Node é fixada porque o `app.config.ts`
importa arquivos `.ts` do tema usando o type stripping nativo do Node.

Identificadores nativos em `app.config.ts`: `com.musclebit.app` (iOS e Android). Troque antes do
primeiro build, se quiser outro.

### Development build (substitui o Expo Go)

O Expo Go da loja só abre o SDK que a Apple/Google já aprovaram. O development build é o seu
próprio "Expo Go", com o `expo-dev-client`, e não depende disso. Faça uma vez; refaça só quando
adicionar dependência nativa nova.

```bash
# 1. Login e vínculo do projeto com sua conta Expo (gera extra.eas.projectId no app.config.ts)
npx eas-cli login
npx eas-cli init

# 2. Build na nuvem
npx eas-cli build --profile development --platform android   # APK, instala direto
npx eas-cli build --profile development --platform ios       # exige Apple Developer Program

# 3. Instalar no celular: ao terminar, o terminal mostra um link e um QR code.
#    Android: abra o link no celular e instale o APK.
#    iOS: registre o aparelho antes do build com `npx eas-cli device:create`
#         (abre um link no iPhone que instala o perfil), depois instale pelo link.

# 4. Rodar
npx expo start
#    Abra o app "MuscleBit (dev)" no celular e leia o QR code, ou escolha o servidor na lista.
```

Depois disso, `npx expo start` sempre abre no development build. Só é preciso um build novo ao
instalar uma biblioteca com código nativo ou mudar o `app.config.ts` (ícone, splash, plugins).
