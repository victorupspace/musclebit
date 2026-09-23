import { Link, Stack } from 'expo-router';

import { Screen, Text } from '@/shared/components/ui';

export default function NotFoundRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Não encontrado' }} />
      <Screen>
        <Text variant="title">Esta tela não existe.</Text>
        <Link href="/">
          <Text color="primary">Voltar ao início</Text>
        </Link>
      </Screen>
    </>
  );
}
