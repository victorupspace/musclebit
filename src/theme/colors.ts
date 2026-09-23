/**
 * Paleta bruta do MuscleBit, extraída da arte da splash (halter em pixel art sobre navy).
 *
 * Este arquivo não pode importar nada do React Native: ele também é lido pelo `app.config.ts`
 * (Node) para configurar a splash nativa e o ícone adaptativo.
 *
 * Nunca use `palette` direto em componentes. Use `useTheme().colors`, que expõe os tokens
 * semânticos abaixo já resolvidos para o tema claro ou escuro.
 */
export const palette = {
  /** Fundo da splash e do tema escuro. */
  navy: {
    900: '#03102F',
    800: '#051A4C',
    700: '#01215C',
    600: '#0D2C78',
    500: '#153A93',
    400: '#2A4FAE',
  },
  /** Contorno do pixel art. Texto forte no claro, superfície mais funda no escuro. */
  ink: {
    900: '#0B0E24',
    800: '#12163A',
    700: '#1D2250',
    600: '#2A3066',
  },
  /** Off-white quente. Fundo do claro, texto no escuro. */
  chalk: {
    100: '#FDFCF8',
    200: '#F3F0E8',
    300: '#E7E2D6',
    400: '#D3CCBB',
  },
  /** Sombra das placas do halter. Texto secundário, bordas, desabilitado. */
  lilac: {
    200: '#DCDDF2',
    300: '#B8BAE4',
    400: '#9496CC',
    500: '#7275AE',
    600: '#575A8E',
  },
  /** Barra do halter. Ação primária, progresso, destaque. */
  ember: {
    300: '#FFC45C',
    400: '#F5A11F',
    500: '#D98708',
    600: '#A86805',
  },
  /** O "BIT" do wordmark. Acento de marca, erro, destrutivo. */
  coral: {
    300: '#F98684',
    400: '#F0504E',
    500: '#CF3A38',
    600: '#A62B2A',
  },
  /** Cinzas neutros para texto secundário no tema claro, como nas telas de design. */
  slate: {
    400: '#8E8E8E',
    500: '#6E6E6E',
    600: '#585858',
  },
  /** Verde-limão de celebração: só em momentos de conquista sobre navy (sucesso, recorde). */
  lime: {
    300: '#EAF98C',
    400: '#DDF56A',
    500: '#C6E24A',
  },
  /** Verde dessaturado para sucesso. Único hue fora da arte, escolhido para fugir do neon. */
  moss: {
    300: '#7CC7A0',
    400: '#3E9B6A',
    500: '#2F7D54',
    600: '#245F41',
  },
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorScheme = 'light' | 'dark';

/** Tokens semânticos. Componentes só conhecem estes nomes, nunca a paleta. */
export type ThemeColors = {
  /** Fundo da tela. */
  background: string;
  /** Cards e blocos sobre o fundo. */
  surface: string;
  /** Camada acima de `surface` (sheets, popovers). */
  surfaceElevated: string;
  border: string;
  borderStrong: string;
  text: string;
  /** Texto secundário: descrições, legendas. */
  textMuted: string;
  /** Texto terciário: overlines, placeholders, metadados. */
  textSubtle: string;
  /** Texto sobre fundos invertidos (ex.: botão primário no claro, toast). */
  textInverse: string;
  /**
   * Ação primária: botão de alto contraste com a marca (navy no claro, chalk no escuro).
   * Ember fica para progresso e destaques, não para botões.
   */
  primary: string;
  onPrimary: string;
  /** Texto secundário sobre `primary` (descrições em cards selecionados). */
  onPrimaryMuted: string;
  /** Véu claro sobre `primary` (caixas de ícone em cards selecionados). */
  onPrimarySubtle: string;
  /** Véu translúcido da cor primária: hover e pressionado de botões sem preenchimento. */
  primarySubtle: string;
  /** Ação secundária: preenchimento suave, sem borda. */
  secondary: string;
  onSecondary: string;
  /** `secondary` em hover/pressionado. */
  secondaryPressed: string;
  /** Acento de marca (o "BIT"). */
  accent: string;
  onAccent: string;
  success: string;
  /** Destaque de celebração sobre `brand`/`primary` (badge de sucesso). Igual nos dois temas. */
  celebrate: string;
  onCelebrate: string;
  warning: string;
  danger: string;
  /** Neutro de contraste máximo (preto no claro, branco no escuro). Botão da Apple, por exemplo. */
  contrast: string;
  onContrast: string;
  /** Fundo da marca: splash e momentos de identidade. Igual nos dois temas. */
  brand: string;
  brandText: string;
  /** Véu sobre conteúdo (modais). */
  overlay: string;
  /** Anel de foco para navegação por teclado/leitor. */
  focus: string;
};

/**
 * Cor de fundo da splash nativa e da splash em JS. Constante separada porque é lida pelo
 * `app.config.ts` fora do runtime do React.
 */
export const SPLASH_BACKGROUND_COLOR = palette.navy[700];

export const lightColors: ThemeColors = {
  background: palette.chalk[100],
  surface: palette.white,
  surfaceElevated: palette.white,
  border: palette.chalk[300],
  borderStrong: palette.chalk[400],
  text: palette.ink[800],
  textMuted: palette.slate[600],
  textSubtle: palette.slate[400],
  textInverse: palette.chalk[100],
  primary: palette.navy[700],
  onPrimary: palette.chalk[100],
  onPrimaryMuted: palette.lilac[300],
  onPrimarySubtle: 'rgba(253, 252, 248, 0.1)',
  primarySubtle: 'rgba(1, 33, 92, 0.08)',
  secondary: palette.chalk[200],
  onSecondary: palette.ink[800],
  secondaryPressed: palette.chalk[300],
  accent: palette.coral[400],
  onAccent: palette.white,
  success: palette.moss[400],
  celebrate: palette.lime[400],
  onCelebrate: palette.navy[700],
  warning: palette.ember[500],
  danger: palette.coral[500],
  contrast: palette.black,
  onContrast: palette.white,
  brand: SPLASH_BACKGROUND_COLOR,
  brandText: palette.chalk[100],
  overlay: 'rgba(11, 14, 36, 0.55)',
  focus: palette.ember[500],
};

export const darkColors: ThemeColors = {
  background: palette.navy[700],
  surface: palette.navy[600],
  surfaceElevated: palette.navy[500],
  border: palette.navy[500],
  borderStrong: palette.lilac[500],
  text: palette.chalk[200],
  textMuted: palette.lilac[300],
  textSubtle: palette.lilac[500],
  textInverse: palette.ink[900],
  primary: palette.chalk[200],
  onPrimary: palette.navy[900],
  onPrimaryMuted: palette.ink[600],
  onPrimarySubtle: 'rgba(1, 33, 92, 0.1)',
  primarySubtle: 'rgba(243, 240, 232, 0.1)',
  secondary: palette.navy[500],
  onSecondary: palette.chalk[200],
  secondaryPressed: palette.navy[400],
  accent: palette.coral[400],
  onAccent: palette.white,
  success: palette.moss[300],
  celebrate: palette.lime[400],
  onCelebrate: palette.navy[700],
  warning: palette.ember[300],
  danger: palette.coral[300],
  contrast: palette.white,
  onContrast: palette.black,
  brand: SPLASH_BACKGROUND_COLOR,
  brandText: palette.chalk[100],
  overlay: 'rgba(3, 16, 47, 0.7)',
  focus: palette.ember[300],
};

export const colorsByScheme: Record<ColorScheme, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};
