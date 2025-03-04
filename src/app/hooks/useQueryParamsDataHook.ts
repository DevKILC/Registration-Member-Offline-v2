import { useQueryParamsDataStore } from "@/app/hooks/useQueryParamsDataStore";

export const useQueryParamsDataHook = () => {

  const { updateField } = useQueryParamsDataStore();

  const saveQueryParams = () => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const urlParams = new URLSearchParams(document.location.search);

      if (urlParams.has("br_code")) {
        updateField("br_code", urlParams.get("br_code") as string);
      }
      if (urlParams.has("course")) {
        updateField("course", urlParams.get("course") as string);
      }
      if (urlParams.has("cs_id")) {
        updateField("cs_id", urlParams.get("cs_id") as string);
      }
    }
  };

  return {
    saveQueryParams,
  };

};