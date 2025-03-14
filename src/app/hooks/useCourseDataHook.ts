import { useCourseDataStore } from "./useCourseDataStore";
import { courseService } from "@/app/services/courseService";
import { CourseQuery } from "@/app/_backend/_utils/Interfaces";
import { useQueryParamsDataStore } from "./useQueryParamsDataStore";
import { useFormDataStore } from "./useFormDataStore";

export const useCourseDataHook = () => {
  const { formData } = useFormDataStore();
  const { setCourse } = useCourseDataStore();
  const { queryParams } = useQueryParamsDataStore();

  const getCourseData = async (courseId: string, categoryId: string) => {
    const filter: CourseQuery = {
      courseId: queryParams?.course || courseId,
      education: formData.kesibukan,
      categoryId: categoryId,
    };

    const response = await courseService
      .getCourses(filter)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.error("Error getting course data:", error);
      });
    return response;
  };

  return {
    getCourseData,
  };
}