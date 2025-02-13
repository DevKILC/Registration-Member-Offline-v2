import { Grade, GradeSelect } from "../_backend/_utils/Interfaces";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GradeState {
  gradeData: GradeSelect[];
  selectedGrade: Grade | null;
  setGrade: (data: Grade[]) => void;
  setSelectedGrade: (data: Grade | null) => void;
}

export const useGradeDataStore = create<GradeState>()(
  persist(
    (set) => ({
      gradeData: [],
      selectedGrade: null,
      setGrade: (data: Grade[]) =>
        set({
          gradeData: Object.values(data).map((item) => ({
            label: item.name,
            value: item.id.toString(),
            grade: item,
          })),
        }),
      setSelectedGrade: (data: Grade| null) =>
        set({
          selectedGrade: data,
        }),
    }),
    {
      name: "grade-data-storage", // name of the key in localStorage
      storage: createJSONStorage(() => localStorage), // using localStorage
    }
  )
);