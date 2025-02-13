import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Pickup, PickupLocation, Passenger } from "@/app/_backend/_utils/Interfaces";

interface AccomodationDataState {
  pickupData: { label: string; value: string; pickup: Pickup }[];
  selectedPickup: Pickup | null;
  setPickupData: (data: Pickup[]) => void;
  setSelectedPickup: (data: Pickup | null) => void;
  locationData: { label: string; value: string; pickupLocation: PickupLocation }[];
  selectedLocation: PickupLocation | null;
  setLocationData: (data: PickupLocation[]) => void;
  setSelectedLocation: (data: PickupLocation | null) => void;
  passengerData: { label: string; value: string; passenger: Passenger }[];
  selectedPassenger: Passenger | null;
  setPassengerData: (data: Passenger[]) => void;
  setSelectedPassenger: (data: Passenger) => void;
}

export const useAccomodationDataStore = create<AccomodationDataState>()(
  persist(
    (set) => ({
      pickupData: [],
      selectedPickup: null,
      setPickupData: (data: Pickup[]) =>
        set({
          pickupData: data.map((item) => ({
            label: item.pickup_name,
            value: item.pickup_code,
            pickup: item,
          })),
        }),
      setSelectedPickup: (data: Pickup | null) => set({ selectedPickup: data }),
      locationData: [],
      selectedLocation: null,
      setLocationData: (data: PickupLocation[]) =>
        set({
          locationData: data.map((item) => ({
            label: item.location_name,
            value: item.location_code,
            pickupLocation: item,
          })),
        }),
      setSelectedLocation: (data: PickupLocation | null) => set({ selectedLocation: data }),
      passengerData: [],
      selectedPassenger: null,
      setPassengerData: (data: Passenger[]) =>
        set({
          passengerData: data.map((item) => ({
            label: item.passenger,
            value: item.price,
            passenger: item,
          })),
        }),
      setSelectedPassenger: (data: Passenger) => set({ selectedPassenger: data }),
    }),
    {
      name: "accomodation-data-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);