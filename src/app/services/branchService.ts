import api from "../config/api"
import { BranchQuery } from "../_backend/_utils/Interfaces";
import { toast } from "react-toastify";

export const branchService = {
  async getBranches(data: BranchQuery) {
    toast.loading('Loading...');
    try {
      const response = await api.get("/branch", { params: data });
      toast.dismiss();
      return response.data;
    } catch (error) {
      toast.dismiss();
      toast.error("Error getting branches");
      console.error("Error getting branches:", error);
      return null;
    }
  }
};

export default branchService;