import { ClidQuery } from "../_backend/_utils/Interfaces";
import { toast } from "react-toastify";
import axios from "axios";

export const clidService = {
  async getClid(data: ClidQuery) {
    toast.loading('Loading...');
    try {
      const response = await axios.get(`https://lead-service.kampunginggrislc.com/api/retrieve-lead/clid?whatsapp=${data.phone_number}`);
      toast.dismiss();
      return response.data.clid;
    } catch (error) {
      toast.dismiss();
      toast.error("Error getting clid");
      console.error("Error getting clid:", error);
      return null;
    }
  }
};

export default clidService;