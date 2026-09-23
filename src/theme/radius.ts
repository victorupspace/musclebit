/**
 * Raios de borda, da spec de design: `sm` chips e badges, `md` caixas de ícone, `lg` blocos
 * internos, `xl` (18) cards e CTAs. `full` é para pílulas e avatares.
 */
export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 18,
  full: 999,
} as const;

export type RadiusKey = keyof typeof radius;
