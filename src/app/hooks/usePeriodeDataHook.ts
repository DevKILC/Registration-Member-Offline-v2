import periodeService from "../services/periodeService"
import { toast } from "react-toastify";
import { usePeriodeDataStore } from "./usePeriodeDataStore";
import { useFormDataStore } from "./useFormDataStore";
import { useQueryParamsDataStore } from "./useQueryParamsDataStore";

export const usePeriodeDataHook = () => {

  const { setPeriode } = usePeriodeDataStore();
  const { formData } = useFormDataStore();
  const { queryParams } = useQueryParamsDataStore();

  const getPeriodeData = async (branch: string) => {
    const data = { branch: branch, education: formData.kesibukan, course: queryParams?.course || null };
    const response = periodeService
      .getPeriode(data)
      .then((response) => {
        setPeriode(response.data);
      })
      .catch((error) => {
        console.error("Error getting periodes:", error);
        toast.error("Error getting periodes");
      });
    return response;
  }

  return {
    getPeriodeData
  }
}