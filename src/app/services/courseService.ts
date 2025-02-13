import api from "../config/api";
import { toast } from "react-toastify";
import { CourseQuery } from "../_backend/_utils/Interfaces";

export const courseService = {
  async getCourses(filter: CourseQuery) {
    toast.loading("Loading...");
    try {
      const response = await api.get("/course/v2", { params: filter });
      toast.dismiss();
      return response.data;
    } catch (error) {
      toast.dismiss();
      toast.error("Error getting course data");
      console.error("Error getting course data:", error);
      return null;
    }
  },
};