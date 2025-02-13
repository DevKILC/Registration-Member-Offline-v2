import { registrationService } from '../services/registrationService';
import { useRegistrationResultDataStore } from './useRegistrationResultDataStore';
import { useFormDataStore } from './useFormDataStore';

export const useFeedbackDataHook = () => {

  const { registrationResult } = useRegistrationResultDataStore();
  const { formData, setIsPopupOpen } = useFormDataStore();

  const handleSubmitFeedback = async () => {
    const data = {
      id_member: Number(registrationResult?.id),
      rating: formData.rating,
      feedback: formData.feedback,
    };
    await registrationService.feedback(data)
    .then((res) => {
      if (res === null) return;
      setIsPopupOpen(false);
    })
    .catch(() => {
      setIsPopupOpen(true);
    });
  }

  return {
    handleSubmitFeedback,
  }
}