import { useQueryParamsDataStore } from "@/app/hooks/useQueryParamsDataStore";
import { useSearchParams } from "next/navigation";

export const useQueryParamsDataHook = () => {

  const { updateField } = useQueryParamsDataStore();
  const searchParams = useSearchParams();

  const saveQueryParams = () => {
    if (searchParams.has("br_code")) {
      updateField("br_code", searchParams.get("br_code") as string);
    }
    if (searchParams.has("course")) {
      updateField("course", searchParams.get("course") as string);
    }
    if (searchParams.has("cs_id")) {
      updateField("cs_id", searchParams.get("cs_id") as string);
    }
  };

  return {
    saveQueryParams,
  };

};