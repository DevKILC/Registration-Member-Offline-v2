import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CourseCategory, CourseCategoryStore } from '../_backend/_utils/Interfaces'

interface CourseCategoryState {
  courseCategoryData: CourseCategoryStore[];
  setCourseCategory: (data: CourseCategory[]) => void;
}

export const useCourseCategoryDataStore = create<CourseCategoryState>()(
  persist(
    (set) => ({
      courseCategoryData: [],
      setCourseCategory: (data: CourseCategory[]) =>
        set({
          courseCategoryData: Object.values(data).map((item) => ({
            label: item.name,
            value: item.id.toString(),
            course_id: item.course_id.toString(),
          })),
        }),
    }),
    {
      name: "course-category-data-storage", // name of the key in localStorage
      storage: createJSONStorage(() => localStorage), // using localStorage
    }
  )
);