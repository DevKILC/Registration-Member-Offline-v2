import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MeetHour, MeetHourStore } from "../_backend/_utils/Interfaces";

interface MeetHourState {
  meetHourData: MeetHourStore[];
}

interface MeetHourActions {
  setMeetHour: (data: MeetHour[]) => void;
}

export const useMeetHourDataStore = create<MeetHourState & MeetHourActions>()(
  persist(
    (set) => ({
      meetHourData: [],
      setMeetHour: (data: MeetHour[]) =>
        set({
          meetHourData: Object.values(data).map((item) => ({
            label: item.hour,
            value: item.id.toString(),
            meetHour: item,
          })),
        }),
    }),
    {
      name: "meet-hour-data-storage", // name of the key in localStorage
      storage: createJSONStorage(() => localStorage), // using localStorage
    }
  )
);