/**
 * Escala de espaçamento em 4pt. A chave é o multiplicador de 4: `spacing[4]` = 16.
 * Use para padding, margin e gap. Nunca escreva pixels soltos em componentes.
 */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export type SpacingKey = keyof typeof spacing;
