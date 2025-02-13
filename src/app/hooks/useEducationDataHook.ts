import { educationService } from '../services/educationService';
import { useEducationDataStore } from './useEducationDataStore';

export const useEducationDataHook = () => {
  const { setEducation } = useEducationDataStore();
  const getEducations = async () => {
    await educationService.getEducations()
      .then((response) => {
      if (response) {
        setEducation(response.data);
      }
      }).catch((error) => {
        console.log(error)
      })
  };

  return {
    getEducations
  };
}