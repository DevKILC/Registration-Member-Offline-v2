import { EducationQuery } from "../_backend/_utils/Interfaces";
import api from "../config/api";
import { toast } from "react-toastify";

export const educationService = {
  async getEducations(filter: EducationQuery) {
    toast.loading("Loading...");
    try {
      const response = await api.get("/education", { params: filter });
      toast.dismiss();
      return response.data;
    } catch (error) {
      toast.dismiss();
      toast.error("Error getting educations");
      console.error("Error getting educations:", error);
      return null;
    }
  },
};

export default educationService;
