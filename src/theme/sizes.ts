/**
 * Dimensões fixas que não são espaçamento: alturas de controle, ícones, bordas e a logo da splash.
 *
 * Este arquivo não pode importar nada do React Native: `splashLogoWidth` é lido pelo
 * `app.config.ts` (Node) para que a splash nativa e a splash em JS tenham a mesma medida.
 */
export const sizes = {
  controlHeight: {
    /** Botões de ícone (voltar, fechar). */
    sm: 40,
    md: 44,
    lg: 56,
  },
  icon: {
    sm: 16,
    md: 24,
    lg: 32,
  },
  avatar: {
    md: 56,
    lg: 80,
  },
  /** Ilustrações circulares de estado (sucesso, vazio). */
  badge: {
    lg: 128,
  },
  /** Altura das barras de progresso de etapas. */
  progressBar: 4,
  borderWidth: {
    hairline: 1,
    thick: 2,
  },
  /**
   * Largura da logo na splash (nativa e JS). Altura é derivada pela proporção da imagem.
   * 163pt = 1,6 × 102px (arte original em assets/musclebit.png), 20% menor que o 2x inteiro.
   * Para pixel perfeito em telas 2x, use 153 (1,5x) ou 204 (2x).
   */
  splashLogoWidth: 163,
  /**
   * Largura do halter (assets/dumbbell.png, 96px) em telas de marca, como a de boas-vindas.
   * 144pt = 1,5 × 96px: fator 3x inteiro em telas 2x.
   */
  heroLogoWidth: 144,
} as const;
