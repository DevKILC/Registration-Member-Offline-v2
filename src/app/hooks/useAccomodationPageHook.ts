
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { akomodasiSchema } from "@/app/_backend/_utils/validationZod";
import { validateFormDataAkomodasi } from "@/app/_backend/_utils/validationAlert";
import { useFormDataStore } from "@/app/hooks/useFormDataStore";

export const useAccomodationPageHook = () => {
  const router = useRouter();
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // State untuk menyimpan data form
  const { formData } = useFormDataStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = akomodasiSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }

    const { isValid, missingFields } = validateFormDataAkomodasi(formData);

    if (isValid) {
      router.push("/pages/konfirmasi")
    } else {  
      const missingLabels = missingFields.map((item) => item.label);
          toast.error(
            "Mohon lengkapi data berikut: " + missingLabels.join(", ")
          );
    }
  };

  return {
    errors,
    handleSubmit,
    router
  };
}