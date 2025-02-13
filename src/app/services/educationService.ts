import api from "../config/api";
import { toast } from "react-toastify";

export const educationService = {
  async getEducations() {
    toast.loading("Loading...");
    try {
      const response = await api.get("/education");
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
