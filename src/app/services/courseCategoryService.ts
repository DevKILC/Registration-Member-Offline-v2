import { toast } from "react-toastify";
import api from "../config/api";
import { CourseCategoryQuery } from "../_backend/_utils/Interfaces";

export const courseCategoryService = {
  async getCourseCategories(filter: CourseCategoryQuery) {
    toast.loading("Loading...");
    try {
      const response = await api.get("/course/course-category", { params: filter });
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