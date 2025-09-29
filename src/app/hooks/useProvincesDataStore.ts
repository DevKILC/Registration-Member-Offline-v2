
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { Province } from "@/app/_backend/_utils/Interfaces"

interface ProvinceState {
  provinceData: { label:string, value: string }[];
}

interface ProvinceActions {
  setProvinces: (data: Province[]) => void;
}

export const useProvincesDataStore = create<ProvinceState & ProvinceActions>()(
  persist(
    (set) => ({
      provinceData: [],
      setProvinces: (data: Province[]) =>
        set({
          provinceData: data.map((item) => ({
            label: item.name,
            value: item.code,
          })),
        }),
    }),
    {
      name: "province-data-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);