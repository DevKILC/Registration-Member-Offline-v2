import { courseCategoryService } from '../services/courseCategoryService'
import { CourseCategoryQuery } from '../_backend/_utils/Interfaces'
import { useFormDataStore } from './useFormDataStore'
import { useCourseCategoryDataStore } from './useCourseCategoryDataStore'
import { useAccomodationDataHook } from "./useAccomodationDataHook";
import { useQueryParamsDataStore } from './useQueryParamsDataStore'

export const useCourseCategoryDataHook = () => {

  const { formData } = useFormDataStore()
  const { setCourseCategory } = useCourseCategoryDataStore()
  const { getPickupLocation } = useAccomodationDataHook();
  const { queryParams } = useQueryParamsDataStore();

  const getCourseCategories = async (periodeId: string) => {
    
    const filter: CourseCategoryQuery = {
      branch_code: formData.cabang,
      education_code: formData.kesibukan,
      periode_id: periodeId,
      gender: formData.gender,
      course: queryParams?.course || null,
    };

    if (formData.cabang === "PARE") {
      getPickupLocation();
    }

    const response = courseCategoryService.getCourseCategories(filter)
    .then((response) => {
      setCourseCategory(response.data)
    })
    .catch((error) => {
      console.error("Error getting course data:", error)
    })
    return response;
  }

  return {
    getCourseCategories
  };
}