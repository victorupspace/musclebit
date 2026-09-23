/** Perfil escolhido na entrada. Define o fluxo de cadastro e a home. */
export type ProfileType = 'aluno' | 'profissional';

/** Como o aluno vai treinar: acompanhado por um profissional ou por conta própria. */
export type TrainingMode = 'com_profissional' | 'sozinho';

/** Atuação do profissional. Define as ferramentas do backoffice. */
export type ProfessionalRole = 'nutricionista' | 'personal' | 'personal_nutricionista';

/** Vínculo do aluno com o profissional que já o acompanha. */
export type ProfessionalLink =
  /** O profissional já usa o MuscleBit: a ID dele liga as contas. */
  | { onApp: true; professionalId: string }
  /** O profissional ainda não usa o app. */
  | { onApp: false };
