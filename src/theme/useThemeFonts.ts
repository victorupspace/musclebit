import { useFonts } from 'expo-font';

import { fontAssets } from './typography';

/**
 * Carrega as fontes do design system. Retorna `[carregadas, erro]`.
 * É uma das condições de readiness da splash: o app só aparece com as fontes prontas
 * (ou com o erro registrado, para não travar a splash caso o carregamento falhe).
 */
export function useThemeFonts(): [boolean, Error | null] {
  const [loaded, error] = useFonts(fontAssets);
  return [loaded, error];
}
