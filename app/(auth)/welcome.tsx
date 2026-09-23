import { useRouter } from 'expo-router';

import { WelcomeScreen } from '@/features/auth';

export default function WelcomeRoute() {
  const router = useRouter();
  // Ligar `onSocialLogin` quando a autenticação com Google e Apple entrar.
  return (
    <WelcomeScreen
      onStart={() => router.push('/(auth)/profile-type')}
      onLogin={() => router.push('/(auth)/login')}
    />
  );
}
