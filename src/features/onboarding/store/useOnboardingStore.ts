import { create } from 'zustand';

import type { ProfessionalLink, ProfessionalRole, ProfileType, TrainingMode } from '../types';

type OnboardingState = {
  profileType: ProfileType | null;
  trainingMode: TrainingMode | null;
  professionalLink: ProfessionalLink | null;
  professionalRole: ProfessionalRole | null;
  setProfileType: (profileType: ProfileType) => void;
  setTrainingMode: (trainingMode: TrainingMode) => void;
  setProfessionalLink: (professionalLink: ProfessionalLink) => void;
  setProfessionalRole: (professionalRole: ProfessionalRole) => void;
  reset: () => void;
};

const initialState = {
  profileType: null,
  trainingMode: null,
  professionalLink: null,
  professionalRole: null,
};

/** Estado do fluxo de entrada (em memória; some ao fechar o app, o que é o desejado). */
export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,
  // Trocar de perfil invalida tudo o que foi escolhido nas etapas seguintes.
  setProfileType: (profileType) => set({ ...initialState, profileType }),
  // Treinar sozinho descarta o vínculo com profissional informado antes.
  setTrainingMode: (trainingMode) =>
    set((state) => ({
      trainingMode,
      professionalLink: trainingMode === 'com_profissional' ? state.professionalLink : null,
    })),
  setProfessionalLink: (professionalLink) => set({ professionalLink }),
  setProfessionalRole: (professionalRole) => set({ professionalRole }),
  reset: () => set(initialState),
}));
