import { useCourseDataStore } from "./useCourseDataStore";
import { useFormDataStore } from "./useFormDataStore";
import { courseService } from "@/app/services/courseService";
import { CourseQuery } from "@/app/_backend/_utils/Interfaces";

export const useCourseDataHook = () => {

  const { formData } = useFormDataStore();
  const { setCourse } = useCourseDataStore();

  const getCourseData = async (categoryId: string) => {

    const filter: CourseQuery = {
      periode_id: formData.periode,
      branch_code: formData.cabang,
      education_code: formData.kesibukan,
      gender: formData.gender,
      category_id: categoryId,
    };

    await courseService.getCourses(filter)
    .then((response) => {
      setCourse(response.data);
    })
    .catch((error) => {
      console.error("Error getting course data:", error);
    });
  }

  return {
    getCourseData,
  };
}