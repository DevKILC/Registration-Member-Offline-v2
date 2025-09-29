import { useQueryParamsDataStore } from "@/app/hooks/useQueryParamsDataStore";

export const useQueryParamsDataHook = () => {

  const { updateField } = useQueryParamsDataStore();

  const saveQueryParams = () => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const urlParams = new URLSearchParams(document.location.search);

      if(urlParams.has("pr_code")){
        updateField("pr_code", urlParams.get("pr_code") as string);
      }
      if (urlParams.has("br_code")) {
        updateField("br_code", urlParams.get("br_code") as string);
      }
      if (urlParams.has("course")) {
        updateField("course", urlParams.get("course") as string);
      }
      if (urlParams.has("cs_id")) {
        updateField("cs_id", urlParams.get("cs_id") as string);
      }
      if (urlParams.has("utm_source")) {
        updateField("utm_source", urlParams.get("utm_source") as string);
      }
      if (urlParams.has("utm_medium")) {
        updateField("utm_medium", urlParams.get("utm_medium") as string);
      }
      if (urlParams.has("utm_campaign")) {
        updateField("utm_campaign", urlParams.get("utm_campaign") as string);
      }
      if (urlParams.has("utm_content")) {
        updateField("utm_content", urlParams.get("utm_content") as string);
      }
      if (urlParams.has("utm_term")) {
        updateField("utm_term", urlParams.get("utm_term") as string);
      }
      if (urlParams.has("aff")) {
        updateField("aff", urlParams.get("aff") as string);
      }
      if (urlParams.has("fbc")) {
        updateField("fbc", urlParams.get("fbc") as string);
      }
    }
  };

  return {
    saveQueryParams,
  };

};