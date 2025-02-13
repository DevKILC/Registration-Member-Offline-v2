import api from "../config/api";
import { PickupQuery, PassengerQuery } from "../_backend/_utils/Interfaces";
import { toast } from "react-toastify";

export const accomodationService = {
  async getPickup(filter: PickupQuery) {
    toast.loading("Loading...");
    try {
      const response = await api.get("/pickup", { params: filter });
      toast.dismiss();
      return response.data;
    } catch (error) {
      toast.dismiss();
      console.error("Error getting pickup:", error);
      return null;
    }
  },

  async getPickupLocation() {
    toast.loading("Loading...");
    try {
      const response = await api.get("/pickup/location");
      toast.dismiss();
      return response.data;
    } catch (error) {
      toast.dismiss();
      console.error("Error getting pickup location:", error);
      return null;
    }
  },

  async getPassenger(filter: PassengerQuery) {
    toast.loading("Loading...");
    try {
      const response = await api.get("/pickup/pasengger", { params: filter });
      toast.dismiss();
      return response.data;
    } catch (error) {
      toast.dismiss();
      console.log("Error getting passenger data:", error);
      return null;
    }
  },
};

export default accomodationService;
