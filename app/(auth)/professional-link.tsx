import { useRouter } from 'expo-router';

import { ProfessionalLinkScreen } from '@/features/onboarding';

export default function ProfessionalLinkRoute() {
  const router = useRouter();
  return (
    <ProfessionalLinkScreen
      onBack={() => router.back()}
      onContinue={() => router.push('/(auth)/student-signup/step-1')}
    />
  );
}
