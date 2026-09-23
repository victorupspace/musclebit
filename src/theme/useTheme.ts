import { useContext } from 'react';

import { type Theme, ThemeContext } from './ThemeProvider';

/** Acesso aos tokens do tema resolvidos para o esquema atual. Exige `ThemeProvider` acima. */
export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (theme === null) {
    throw new Error('useTheme() precisa ser usado dentro de <ThemeProvider>.');
  }
  return theme;
}
