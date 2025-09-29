import branchService from "@/app/services/branchService";
import { toast } from "react-toastify";
import { useBranchDataStore } from "./useBranchDataStore";
import { useQueryParamsDataStore } from './useQueryParamsDataStore';

export const useBranchBranch = () => {
  const { queryParams } = useQueryParamsDataStore();
  const { setBranch } = useBranchDataStore();
  const getBranchData = async (province: string) => {
    const filter = {
      branch: queryParams?.br_code || "",
      province: province || queryParams?.pr_code || ""
    };
    await branchService
      .getBranches(filter)
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