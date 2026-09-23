import {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
  Archivo_800ExtraBold,
} from '@expo-google-fonts/archivo';
import type { TextStyle } from 'react-native';

// Subconjunto do Material Symbols Rounded gerado por scripts/generate-icon-font.py.
const materialSymbolsRounded = require('../../assets/fonts/MaterialSymbolsRounded.ttf');

/**
 * Archivo é a fonte oficial do projeto: todo texto do app usa uma destas faces.
 * O wordmark "MUSCLEBIT" não é texto, é a arte em pixel (assets/wordmark-*.png).
 *
 * O peso está embutido no nome da família (uma face por peso). Por isso os estilos abaixo NÃO
 * definem `fontWeight`: no Android, combinar `fontWeight` com uma face customizada faz o sistema
 * sintetizar o negrito ou cair na fonte padrão.
 */
export const fontFamily = {
  regular: 'Archivo_400Regular',
  medium: 'Archivo_500Medium',
  semiBold: 'Archivo_600SemiBold',
  bold: 'Archivo_700Bold',
  extraBold: 'Archivo_800ExtraBold',
  /** Fonte de ícones (Material Symbols Rounded). Só o componente `Icon` usa. */
  icons: 'MaterialSymbolsRounded',
} as const;

/** Mapa nome → asset, consumido por `useThemeFonts`. As chaves batem com `fontFamily`. */
export const fontAssets = {
  [fontFamily.regular]: Archivo_400Regular,
  [fontFamily.medium]: Archivo_500Medium,
  [fontFamily.semiBold]: Archivo_600SemiBold,
  [fontFamily.bold]: Archivo_700Bold,
  [fontFamily.extraBold]: Archivo_800ExtraBold,
  [fontFamily.icons]: materialSymbolsRounded,
} as const;

/**
 * Escala tipográfica. Cada variante define peso (pela família), tamanho e altura de linha.
 *
 * | variante   | tamanho/linha | peso | uso                                   |
 * |------------|---------------|------|---------------------------------------|
 * | display    | 28/40         | 800  | títulos-herói                         |
 * | title      | 24/32         | 700  | título de tela                        |
 * | heading    | 18/24         | 600  | seções, títulos de card               |
 * | body       | 16/24         | 400  | texto corrido                         |
 * | bodyStrong | 16/24         | 600  | ênfase no corpo                       |
 * | label      | 14/20         | 500  | rótulos, botões `md`                  |
 * | button     | 14/20         | 700  | CTAs (spec de design)                 |
 * | fieldLabel | 13/16         | 600  | rótulo de campo, caixa alta, tracking |
 * | input      | 17/24         | 400  | texto digitado e placeholder          |
 * | link       | 16/24         | 600  | ação em texto, sublinhada             |
 * | fieldLabel | 13/16         | 600  | rótulo de campo, caixa alta, tracking |
 * | input      | 17/24         | 400  | texto digitado e placeholder          |
 * | link       | 16/24         | 600  | ação em texto, sublinhada             |
 * | caption    | 12/16         | 400  | legendas                              |
 * | overline   | 12/16         | 500  | caixa alta, tracking 1.5 (taglines)   |
 * | numeral    | 28/32         | 600  | pesos, reps, cronômetro (tabular)     |
 */
export const typography = {
  display: { fontFamily: fontFamily.extraBold, fontSize: 28, lineHeight: 40 },
  title: { fontFamily: fontFamily.bold, fontSize: 24, lineHeight: 32 },
  heading: { fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 24 },
  bodyStrong: { fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20, letterSpacing: 0.2 },
  button: { fontFamily: fontFamily.bold, fontSize: 14, lineHeight: 20 },
  fieldLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  input: { fontFamily: fontFamily.regular, fontSize: 17, lineHeight: 24 },
  link: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 24,
    textDecorationLine: 'underline',
  },
  caption: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  overline: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  numeral: {
    fontFamily: fontFamily.semiBold,
    fontSize: 28,
    lineHeight: 32,
    fontVariant: ['tabular-nums'],
  },
  /** Base do componente `Icon`; tamanho vem de `sizes.icon`. Não use em texto. */
  icon: { fontFamily: fontFamily.icons, fontSize: 24, lineHeight: 24 },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
