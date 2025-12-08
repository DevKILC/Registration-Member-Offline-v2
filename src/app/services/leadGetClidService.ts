import { ClidQuery } from "../_backend/_utils/Interfaces";
import { toast } from "react-toastify";
import axios from "axios";

export const clidService = {
  async getClid(data: ClidQuery) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LEAD_SERVICE_URL}retrieve-lead/clid?whatsapp=${data.phone_number}`
      );
      
      toast.dismiss();
      return response.data;
      
    } catch (error) {
      console.error("Error getting clid:", error);
      return null;
    }
  }
};

export default clidService;