import { create } from 'zustand';

import type { StudentProfile } from '../schemas/studentProfile';

type SignupState = {
  /** Etapa 1 do aluno, preenchida ao tocar em "Continuar". */
  studentProfile: StudentProfile | null;
  /** URI local da foto escolhida (ainda sem upload). */
  photoUri: string | null;
  setStudentProfile: (profile: StudentProfile) => void;
  setPhotoUri: (uri: string | null) => void;
  reset: () => void;
};

const initialState = { studentProfile: null, photoUri: null };

/** Dados do cadastro em andamento, compartilhados entre as etapas. Em memória. */
export const useSignupStore = create<SignupState>((set) => ({
  ...initialState,
  setStudentProfile: (studentProfile) => set({ studentProfile }),
  setPhotoUri: (photoUri) => set({ photoUri }),
  reset: () => set(initialState),
}));
