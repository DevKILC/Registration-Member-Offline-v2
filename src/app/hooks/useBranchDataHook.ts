import branchService from "@/app/services/branchService";
import { toast } from "react-toastify";
import { useBranchDataStore } from "./useBranchDataStore";

export const useBranchBranch = () => {
  const { setBranch } = useBranchDataStore();
  const getBranchData = async (educationCode: string) => {
    const education = { education: educationCode };
    await branchService
      .getBranches(education)
      .then((response) => {
        setBranch(response.data);
      })
      .catch((error) => {
        console.error("Error getting branches:", error);
        toast.error("Error getting branches");
      });
  };

  return {
    getBranchData
  };
}