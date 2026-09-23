import { useRouter } from 'expo-router';

import { StudentProfileScreen } from '@/features/auth';

export default function StudentSignupStep1Route() {
  const router = useRouter();
  return (
    <StudentProfileScreen
      onBack={() => router.back()}
      onContinue={() => router.push('/(auth)/student-signup/step-2')}
    />
  );
}
