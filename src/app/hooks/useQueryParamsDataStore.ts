import { QueryParams } from "../_backend/_utils/Interfaces";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialQueryParams: QueryParams = {
  br_code: null,
  course: null,
  cs_id: null,
}

interface QueryParamsDataState {
  queryParams: QueryParams | null;
}

interface QueryParamsDataActions {
  updateField: (field: string | number, value: string | number) => void;
} 

export const useQueryParamsDataStore = create<QueryParamsDataState & QueryParamsDataActions>()(
  persist(
    (set) => ({
      queryParams: initialQueryParams,
      updateField: (field: string | number, value: string | number) => set((state) => ({ queryParams: { ...state.queryParams, [field]: value } as QueryParams })),
    }),
    {
      name: "query-params-data-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

