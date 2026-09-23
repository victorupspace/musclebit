/** Durações e escalas de animação. Componentes com Reanimated só usam estes valores. */
export const motion = {
  duration: {
    fast: 150,
    base: 250,
    slow: 350,
  },
  /** Coreografia do badge de sucesso: atrasos entre as etapas e duração do traço do check. */
  celebrate: {
    stagger: 120,
    draw: 450,
    ripple: 700,
  },
  /** Escala final do conteúdo da splash ao sair (leve "respiro" enquanto desaparece). */
  splashExitScale: 1.06,
} as const;
