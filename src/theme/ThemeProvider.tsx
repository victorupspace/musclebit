import * as SystemUI from 'expo-system-ui';
import { createContext, type PropsWithChildren, useEffect, useMemo } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { type ColorScheme, colorsByScheme, type ThemeColors } from './colors';
import { motion } from './motion';
import { radius } from './radius';
import { sizes } from './sizes';
import { spacing } from './spacing';
import { typography } from './typography';

export type Theme = {
  scheme: ColorScheme;
  isDark: boolean;
  /**
   * `false` enquanto o sistema ainda não informou o esquema de cores. Condição de readiness da
   * splash: evita o primeiro render no tema errado.
   */
  isResolved: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  typography: typeof typography;
  radius: typeof radius;
  sizes: typeof sizes;
  motion: typeof motion;
};

export const ThemeContext = createContext<Theme | null>(null);

type ThemeProviderProps = PropsWithChildren<{
  /**
   * Força um esquema, ignorando o sistema. Deixe `undefined` para seguir o aparelho.
   * Quando existir preferência do usuário persistida, ela entra por aqui.
   */
  scheme?: ColorScheme;
}>;

export function ThemeProvider({ children, scheme: forcedScheme }: ThemeProviderProps) {
  // Pode devolver 'light' | 'dark' | 'unspecified' | null. Só 'dark' vira tema escuro;
  // 'unspecified' conta como resolvido (claro) para a splash não esperar por algo que não vem.
  const systemScheme = useColorScheme();
  const scheme: ColorScheme = forcedScheme ?? (systemScheme === 'dark' ? 'dark' : 'light');
  const isResolved = forcedScheme !== undefined || systemScheme != null;

  const value = useMemo<Theme>(
    () => ({
      scheme,
      isDark: scheme === 'dark',
      isResolved,
      colors: colorsByScheme[scheme],
      spacing,
      typography,
      radius,
      sizes,
      motion,
    }),
    [scheme, isResolved],
  );

  // Pinta a janela nativa com a cor de fundo do tema. Sem isso, transições de rota e o
  // redimensionamento do teclado deixam vazar o branco padrão da view raiz.
  useEffect(() => {
    if (Platform.OS === 'web') return;
    void SystemUI.setBackgroundColorAsync(value.colors.background);
  }, [value.colors.background]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
