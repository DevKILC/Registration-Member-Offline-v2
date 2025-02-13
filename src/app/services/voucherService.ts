import api from "../config/api";
import { VoucherQuery } from "../_backend/_utils/Interfaces";
import { toast } from "react-toastify";

export const voucherService = {

  async getVoucher(filter: VoucherQuery) {
    toast.loading("Loading...");
    try {
      const response = await api.get("/voucher", {
        params: {
          voucher_code: filter.voucher_code,
          course_id: filter.course_id,
        },
      });
      toast.dismiss();
      return response.data;
    } catch (error) {
      toast.dismiss();
      throw error;
    }
  },
}