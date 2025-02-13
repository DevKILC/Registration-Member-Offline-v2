
import { create } from "zustand";
import { Education } from "@/app/_backend/_utils/Interfaces";
import { persist, createJSONStorage } from "zustand/middleware";

interface EducationState {
  educationData: { label: string; value: string }[];
  setEducation: (data: Education[]) => void;
}

export const useEducationDataStore = create<EducationState>()(
  persist(
    (set) => ({
      educationData: [],
      setEducation: (data: Education[]) =>
        set({
          educationData: data.map((item) => ({
            label: item.jenjang,
            value: item.code,
          })),
      }),
    }),
    {
      name: "education-data-storage", // name of the key in localStorage
      storage: createJSONStorage(() => localStorage), // using localStorage
    }
  )
);