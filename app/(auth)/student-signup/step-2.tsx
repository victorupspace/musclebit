import { useRouter } from 'expo-router';

import { StudentPasswordScreen } from '@/features/auth';

export default function StudentSignupStep2Route() {
  const router = useRouter();
  // A criação da conta (perfil da store + senha) entra com o Supabase; por ora só avança.
  // `replace` impede voltar ao formulário de senha.
  return (
    <StudentPasswordScreen
      onBack={() => router.back()}
      onContinue={() => router.replace('/(auth)/account-created')}
    />
  );
}
