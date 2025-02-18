import { MeetHourQuery } from "../_backend/_utils/Interfaces"
import { useMeetHourDataStore } from "../hooks/useMeetHourDataStore";
import { meetHourService } from "@/app/services/meetHourService"

export const useMeetHourDataHook = () => {
  const { setMeetHour } = useMeetHourDataStore();

  const getMeetHourData = async (filter: MeetHourQuery) => {
    await meetHourService
      .getGrades(filter)
      .then((response) => {
        setMeetHour(response);
      })
      .catch((error) => {
        console.error("Error getting grade data:", error);
      });
  };

  return {
    getMeetHourData,
  };
};