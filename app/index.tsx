import { Redirect } from 'expo-router';

import { useSession } from '@/lib/supabase';
import { Screen, Text } from '@/shared/components/ui';
import { APP_NAME } from '@/shared/constants/app';

export default function HomeRoute() {
  const { session } = useSession();

  // A splash só sai depois da sessão inicial resolver, então este redirect nunca pisca.
  if (session === null) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // Placeholder do app autenticado. Vira o grupo (app) quando a primeira feature logada existir.
  return (
    <Screen>
      <Text variant="display">{APP_NAME.toUpperCase()}</Text>
      <Text variant="caption" color="textMuted">
        Tela inicial. Substitua pela primeira feature.
      </Text>
    </Screen>
  );
}
