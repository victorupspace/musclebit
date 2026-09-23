import { useRouter } from 'expo-router';

import { ProfessionalRoleScreen } from '@/features/onboarding';

export default function ProfessionalRoleRoute() {
  const router = useRouter();
  // Ligar `onContinue` à próxima etapa do cadastro profissional quando ela existir.
  return <ProfessionalRoleScreen onBack={() => router.back()} />;
}
