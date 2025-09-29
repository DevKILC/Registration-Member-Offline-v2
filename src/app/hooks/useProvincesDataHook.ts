import ProvinceService from "@/app/services/provinceService";
import { toast } from "react-toastify";
import { useProvincesDataStore } from "./useProvincesDataStore";

export const useProvincesData = () => {
  const { setProvinces } = useProvincesDataStore();
  const getProvinces = async (educationCode: string) => {
    const filter = {
      education: educationCode,
    };
    await ProvinceService
      .getProvinces(filter)
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => {
        console.error("Error getting branches:", error);
        toast.error("Error getting branches");
      });
  };

  return {
    getProvinces
  };
}