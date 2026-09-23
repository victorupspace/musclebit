import { useRouter } from 'expo-router';

import { ForgotPasswordScreen } from '@/features/auth';

export default function ForgotPasswordRoute() {
  const router = useRouter();
  // O envio real do código entra com o Supabase; por ora só avança para a verificação.
  return (
    <ForgotPasswordScreen
      onBack={() => router.back()}
      onSendCode={(identifier) =>
        router.push({ pathname: '/(auth)/verify-code', params: { identifier } })
      }
    />
  );
}
