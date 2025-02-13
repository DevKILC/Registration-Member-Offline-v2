import periodeService from "../services/periodeService"
import { toast } from "react-toastify";
import { usePeriodeDataStore } from "./usePeriodeDataStore";
import { useFormDataStore } from "./useFormDataStore";

export const usePeriodeDataHook = () => {

  const { setPeriode } = usePeriodeDataStore();
  const { formData } = useFormDataStore();

  const getPeriodeData = async (branch: string) => {
    const data = { education: formData.kesibukan, branch: branch };
    await periodeService
      .getPeriode(data)
      .then((response) => {
        setPeriode(response.data);
      })
      .catch((error) => {
        console.error("Error getting periodes:", error);
        toast.error("Error getting periodes");
      });
  }

  return {
    getPeriodeData
  }
}