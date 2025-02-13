import api from "../config/api";
import { toast } from "react-toastify";
import { GradeQuery } from "../_backend/_utils/Interfaces";

export const gradeService = {
  async getGrades(filter: GradeQuery) {
    toast.loading("Loading...");
    try {
      const response = await api.get("/grade", { params: filter });
      toast.dismiss();
      return response.data;
    } catch (error) {
      toast.dismiss();
      toast.error("Error getting grade data");
      console.error("Error getting grade data:", error);
      return null;
    }
  },
};