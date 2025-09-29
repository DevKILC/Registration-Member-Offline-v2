import api from "../config/api"
import { ProvinceQuery } from "../_backend/_utils/Interfaces";
import { toast } from "react-toastify";

export const provinceService = {
  async getProvinces(data: ProvinceQuery) {
    toast.loading('Loading...');
    try {
      const response = await api.get("/province", { params: data });
      toast.dismiss();
      return response.data;
    } catch (error) {
      toast.dismiss();
      toast.error("Error getting provinces");
      console.error("Error getting provinces:", error);
      return null;
    }
  }
};

export default provinceService;