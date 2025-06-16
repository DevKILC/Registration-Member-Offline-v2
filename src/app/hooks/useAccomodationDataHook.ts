import { accomodationService } from "../services/accomodationService"
import { useAccomodationDataStore } from "./useAccomodationDataStore"
import { useResetFormHook } from "@/app/hooks/useResetFormHook";

export const useAccomodationDataHook = () => {

  const { resetAccomodationPrice } = useResetFormHook()

  const { 
    setPickupData, 
    setLocationData, 
    setPassengerData, 
    selectedLocation,
    setSelectedPickup,
    setSelectedPassenger
  } = useAccomodationDataStore();

  const reset = () => {
    resetAccomodationPrice()
    setPickupData([]);
    setSelectedPickup(null);
    setPassengerData([]);
    setSelectedPassenger(null);
  };

  const getPickupData = async (locationCode: string) => {
    // If location is "no_pickup", reset and return early
    if (locationCode === "no_pickup") {
      reset();
      return;
    }

    const filter = { location_code: locationCode };
    const response = accomodationService
      .getPickup(filter)
      .then((response) => {
        setPickupData(response.data);
      })
      .catch((error) => {
        console.error("Error getting pickup:", error);
        return null;
      });
    return response;
  }

  const getPickupLocation = async () => {
    const response = accomodationService.getPickupLocation()
    .then((response) => {
      setLocationData(response.data);
    })
    .catch((error) => {
      console.error("Error getting pickup location:", error);
      return null;
    });
    return response;
  }

  const getPassengerData = async (pickup: string) => {
    const filter = { pickup: pickup, location: selectedLocation?.location_code || null };
    const response = accomodationService
      .getPassenger(filter)
      .then((response) => {
        setPassengerData(response.data);
      })
      .catch((error) => {
        console.log("Error getting passenger data", error);
        return null;
      });
    return response;
  };

  return {
    getPickupData,
    getPickupLocation,
    getPassengerData,
    reset,
  };
}