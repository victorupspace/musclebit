import { Stack } from 'expo-router';

/** Grupo de rotas públicas (sem sessão). */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
