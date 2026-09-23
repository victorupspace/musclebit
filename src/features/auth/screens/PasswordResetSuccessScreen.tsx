import { SuccessLayout } from '../components/SuccessLayout';

export type PasswordResetSuccessScreenProps = {
  onGoToLogin?: () => void;
};

/** Fim da recuperação de senha. */
export function PasswordResetSuccessScreen({ onGoToLogin }: PasswordResetSuccessScreenProps) {
  return (
    <SuccessLayout
      badge="Tudo pronto"
      title="Senha redefinida!"
      subtitle="Agora é só entrar com sua nova senha e continuar sua sequência."
      ctaLabel="Ir para o login"
      onCta={onGoToLogin}
    />
  );
}
