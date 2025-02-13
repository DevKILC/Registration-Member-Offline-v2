import api from "../config/api";
import { toast } from "react-toastify";
import { PeriodeQuery } from "../_backend/_utils/Interfaces";

export const periodeService = {
  async getPeriode(data: PeriodeQuery) {
    toast.loading("Loading...");
    try {
      const response = await api.get("/periode", { params: data });
      toast.dismiss();
      return response.data;
    } catch (error) {
      toast.dismiss();
      toast.error("Error getting periode");
      console.error("Error getting periode:", error);
      return null;
    }
  },
};

export default periodeService;
