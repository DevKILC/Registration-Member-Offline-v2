import { EducationQuery } from '../_backend/_utils/Interfaces';
import { educationService } from '../services/educationService';
import { useEducationDataStore } from './useEducationDataStore';
import { useQueryParamsDataStore } from './useQueryParamsDataStore';

export const useEducationDataHook = () => {
  const { setEducation } = useEducationDataStore();
  const { queryParams } = useQueryParamsDataStore();
  
  const getEducations = async () => {
    const filter: EducationQuery = {
      course: queryParams?.course || null,
    };
    await educationService
      .getEducations(filter)
      .then((response) => {
        if (response) {
          setEducation(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return {
    getEducations
  };
}