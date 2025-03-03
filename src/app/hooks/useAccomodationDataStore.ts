import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Pickup, PickupLocation, Passenger } from "@/app/_backend/_utils/Interfaces";

interface pickupState {
  pickupData: { label: string; value: string; pickup: Pickup }[];
  selectedPickup: Pickup | null;
}

interface locationState {
  locationData: { label: string; value: string; pickupLocation: PickupLocation }[];
  selectedLocation: PickupLocation | null;
}

interface passengerState {
  passengerData: { label: string; value: string; passenger: Passenger }[];
  selectedPassenger: Passenger | null;
}

type AccomodationState = pickupState & locationState & passengerState;


interface AccomodationActions {
  setPickupData: (data: Pickup[]) => void;
  setSelectedPickup: (data: Pickup | null) => void;
  setLocationData: (data: PickupLocation[]) => void;
  setSelectedLocation: (data: PickupLocation | null) => void;
  setPassengerData: (data: Passenger[]) => void;
  setSelectedPassenger: (data: Passenger | null) => void;
}

const createSelectOptions = (label: string, value: string, dataLabel: string, data: any) => {
  return data.map((item: any) => ({
    label: item[label],
    value: item[value],
    [dataLabel]: item,
  }));
}

export const useAccomodationDataStore = create<AccomodationState & AccomodationActions>()(
  persist(
    (set) => ({
      pickupData: [],
      selectedPickup: null,
      setPickupData: (data: Pickup[]) =>
        set({
          pickupData: createSelectOptions("pickup_name", "pickup_code", "pickup", data),
        }),
      setSelectedPickup: (data: Pickup | null) => set({ selectedPickup: data }),
      locationData: [],
      selectedLocation: null,
      setLocationData: (data: PickupLocation[]) =>
        set({
          locationData: createSelectOptions("location_name", "location_code", "pickupLocation", data),
        }),
      setSelectedLocation: (data: PickupLocation | null) => set({ selectedLocation: data }),
      passengerData: [],
      selectedPassenger: null,
      setPassengerData: (data: Passenger[]) =>
        set({
          passengerData: createSelectOptions("passenger", "price", "passenger", data),
        }),
      setSelectedPassenger: (data: Passenger | null) => set({ selectedPassenger: data }),
    }),
    {
      name: "accomodation-data-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);