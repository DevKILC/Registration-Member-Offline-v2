import { RegistarationResult } from '../_backend/_utils/Interfaces';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface RegistrationResultState {
  registrationResult: RegistarationResult | null;
}

interface RegistrationResultActions {
  setRegistrationResult: (registrationResult: RegistarationResult) => void;
}

export const useRegistrationResultDataStore = create<RegistrationResultState & RegistrationResultActions>()(
  persist(
    (set) => ({
      registrationResult: null,
      setRegistrationResult: (data: RegistarationResult) => set({ registrationResult: data }),
    }),
    {
      name: "registration-result-data-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);