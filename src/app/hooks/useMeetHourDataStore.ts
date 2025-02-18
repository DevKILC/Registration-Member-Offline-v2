import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MeetHour, MeetHourStore } from "../_backend/_utils/Interfaces";

interface MeetHourState {
  meetHourData: MeetHourStore[];
  setMeetHour: (data: MeetHour[]) => void;
}

export const useMeetHourDataStore = create<MeetHourState>()(
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