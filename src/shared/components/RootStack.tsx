import { Stack } from 'expo-router';

import { useTheme } from '@/theme';

/** Stack raiz com fundo do tema, para não vazar branco durante transições de rota. */
export function RootStack() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
    />
  );
}
