import { useRouter } from 'expo-router';

import { PasswordResetSuccessScreen } from '@/features/auth';

export default function ResetSuccessRoute() {
  const router = useRouter();
  // Volta ao login desempilhando o fluxo de recuperação inteiro.
  return <PasswordResetSuccessScreen onGoToLogin={() => router.dismissTo('/(auth)/login')} />;
}
