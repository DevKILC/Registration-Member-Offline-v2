import { courseCategoryService } from '../services/courseCategoryService'
import { CourseCategoryQuery } from '../_backend/_utils/Interfaces'
import { useFormDataStore } from './useFormDataStore'
import { useCourseCategoryDataStore } from './useCourseCategoryDataStore'
import { useCourseDataStore } from "./useCourseDataStore";
import { useAccomodationDataHook } from "./useAccomodationDataHook";

export const useCourseCategoryDataHook = () => {

  const { formData } = useFormDataStore()
  const { setCourseCategory } = useCourseCategoryDataStore()
  const { setCourse } = useCourseDataStore();
  const { getPickupLocation } = useAccomodationDataHook();

  const getCourseCategories = async (periodeId: string) => {
    
    const filter: CourseCategoryQuery = {
      branch_code: formData.cabang,
      education_code: formData.kesibukan,
      periode_id: periodeId,
      gender: formData.gender,
    };

    if (formData.cabang === "PARE") {
      getPickupLocation();
    }

    await courseCategoryService.getCourseCategories(filter)
    .then((response) => {
      setCourseCategory(response.data)
      setCourse(response.data);
    })
    .catch((error) => {
      console.error("Error getting course data:", error)
    })
  }

  return {
    getCourseCategories
  };
}