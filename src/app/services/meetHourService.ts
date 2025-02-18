import api from "../config/api";
import { toast } from "react-toastify";
import { MeetHourQuery } from "../_backend/_utils/Interfaces";

export const meetHourService = {
  async getGrades(filter: MeetHourQuery) {
    toast.loading("Loading...");
    try {
      const response = await api.get("/meet-hours", { params: filter });
      toast.dismiss();
      return response.data;
    } catch (error) {
      toast.dismiss();
      toast.error("Error getting meet hour data");
      console.error("Error getting meet hour data:", error);
      return null;
    }
  },
};
