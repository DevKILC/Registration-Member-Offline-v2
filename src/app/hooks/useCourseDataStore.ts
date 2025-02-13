import { Course, CourseSelect } from '@/app/_backend/_utils/Interfaces';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CourseState {
  courseData: CourseSelect[];
  selectedCourse: Course | null;
  setCourse: (data: Course[]) => void;
  setSelectedCourse: (data: Course) => void;
}

export const useCourseDataStore = create<CourseState>()(
  persist(
    (set) => ({
      courseData: [],
      selectedCourse: null,
      courseInformation: [],
      setCourse: (data: Course[]) =>
        set({
          courseData: Object.values(data).map((item) => ({
            label: item.duration_name,
            value: item.course_id.toString(),
            course: item,
          })),
        }),
      setSelectedCourse: (data: Course) =>
        set({
          selectedCourse: data,
        }),
    }),
    {
      name: "course-data-storage", // name of the key in localStorage
      storage: createJSONStorage(() => localStorage), // using localStorage
    }
  )
);