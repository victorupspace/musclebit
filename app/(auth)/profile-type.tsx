import { useRouter } from 'expo-router';

import { ProfileTypeScreen } from '@/features/onboarding';

export default function ProfileTypeRoute() {
  const router = useRouter();
  return (
    <ProfileTypeScreen
      onBack={() => router.back()}
      onContinue={(profileType) => {
        if (profileType === 'profissional') router.push('/(auth)/professional-role');
        else router.push('/(auth)/training-mode');
      }}
    />
  );
}
