import { create } from "zustand";
import { Periode } from "@/app/_backend/_utils/Interfaces";
import { persist, createJSONStorage } from "zustand/middleware";
import { changeMonth } from "../_backend/_helper/changeMonth";

interface PeriodeState {
  periodeData: { label: string; value: string }[];
  setPeriode: (data: Periode[]) => void;
}

export const usePeriodeDataStore = create<PeriodeState>()(
  persist(
    (set) => ({
      periodeData: [],
      setPeriode: (data: Periode[]) =>
        set({
          periodeData: data.map((item) => ({
            label: 'Periode ' + ' '+ item.date + ' ' + changeMonth(item.month.toString()) + ' ' + item.year,
            value: item.id.toString(),
          })),
        }),
    }),
    {
      name: "periode-data-storage", // name of the key in localStorage
      storage: createJSONStorage(() => localStorage), // using localStorage
    }
  )
);