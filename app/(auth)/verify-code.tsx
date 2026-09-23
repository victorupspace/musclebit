import { useLocalSearchParams, useRouter } from 'expo-router';

import { VerifyCodeScreen } from '@/features/auth';
import { maskEmail } from '@/shared/utils/format';

export default function VerifyCodeRoute() {
  const router = useRouter();
  const { identifier = '' } = useLocalSearchParams<{ identifier?: string }>();
  // Com uma ID (@usuario) o e-mail só é conhecido pelo backend; até lá, mostra a ID.
  const destination =
    identifier.includes('@') && !identifier.startsWith('@') ? maskEmail(identifier) : identifier;

  // A validação real do código entra com o Supabase; por ora só avança para a nova senha.
  return (
    <VerifyCodeScreen
      destination={destination}
      onBack={() => router.back()}
      onVerify={() => router.push('/(auth)/reset-password')}
    />
  );
}
