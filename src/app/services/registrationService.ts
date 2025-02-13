import api from "../config/api";
import { useForm, Feedback } from "@/app/_backend/_utils/Interfaces";
import { toast } from "react-toastify";

export const registrationService = {
  async register(data: useForm) {
    toast.loading("Loading...");
    const response = await api.post("/registration/process/v2", data);
    return response;
  },

  async feedback(data: Feedback){
    toast.loading("Loading...");
    try {
      const response = await api.post("/registration/feedback", data);
      toast.dismiss();
      return response.data;
    } catch (error) {
      toast.dismiss();
      toast.error("Terjadi kesalahan di server, silahkan coba lagi");
      console.error("Error feedback:", error);
      return null;
    }
  }
};

export default registrationService;