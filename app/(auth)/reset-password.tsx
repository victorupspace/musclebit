import { useRouter } from 'expo-router';

import { ResetPasswordScreen } from '@/features/auth';

export default function ResetPasswordRoute() {
  const router = useRouter();
  // A troca real entra com o Supabase; por ora só avança. `replace` impede voltar ao formulário.
  return (
    <ResetPasswordScreen
      onBack={() => router.back()}
      onReset={() => router.replace('/(auth)/reset-success')}
    />
  );
}
