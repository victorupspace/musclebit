import { SuccessLayout } from '../components/SuccessLayout';

export type AccountCreatedScreenProps = {
  /** "Começar": entra no app já autenticado. */
  onContinue?: () => void;
};

/** Fim do cadastro, igual para aluno e profissional. */
export function AccountCreatedScreen({ onContinue }: AccountCreatedScreenProps) {
  return (
    <SuccessLayout
      badge="Conta criada"
      title="Bem-vindo ao MuscleBit!"
      subtitle="Sua conta foi criada com sucesso. Agora é só entrar e começar."
      ctaLabel="Começar"
      onCta={onContinue}
    />
  );
}
