
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { Branch } from "@/app/_backend/_utils/Interfaces"

interface BranchState {
  branchData: { label:string, value: string }[];
  setBranch: (data: Branch[]) => void;
}

export const useBranchDataStore = create<BranchState>()(
  persist(
    (set) => ({
      branchData: [],
      setBranch: (data: Branch[]) => set({
        branchData: data.map((item) => ({
          label: item.name,
          value: item.code
        }))
      }),
    }),
    {
      name: "branch-data-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)