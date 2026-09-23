import { useRouter } from 'expo-router';

import { TrainingModeScreen } from '@/features/onboarding';

export default function TrainingModeRoute() {
  const router = useRouter();
  return (
    <TrainingModeScreen
      onBack={() => router.back()}
      onContinue={(trainingMode) => {
        if (trainingMode === 'com_profissional') router.push('/(auth)/professional-link');
        else router.push('/(auth)/student-signup/step-1');
      }}
    />
  );
}
