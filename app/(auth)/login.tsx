import { useRouter } from 'expo-router';

import { LoginScreen } from '@/features/auth';

export default function LoginRoute() {
  const router = useRouter();
  // Ligar `onLogin` e `onSocialLogin` quando o Supabase entrar.
  return (
    <LoginScreen
      onSignup={() => router.push('/(auth)/profile-type')}
      onForgotPassword={() => router.push('/(auth)/forgot-password')}
    />
  );
}
