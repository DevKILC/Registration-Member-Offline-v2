import React,{ useState } from 'react';
import { useRouter } from "next/navigation";
import { validateFormData } from "@/app/_backend/_utils/validationAlert";
import { dataDiriSchema } from "@/app/_backend/_utils/validationZod";
import { toast } from "react-toastify";
import { useFormDataStore } from "@/app/hooks/useFormDataStore";

export const useEffectHomePageHooks = () => {

  const router = useRouter();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // State untuk menyimpan data form
  // const [formData, setFormData] = useState(defaultFormData);
  const { formData } = useFormDataStore();


  // Handle submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = dataDiriSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }

    // Simpan data di sessionStorage
    sessionStorage.setItem("formData", JSON.stringify(formData));

    // Redirect ke halaman program
    const { isValid, missingFields } = validateFormData(formData);

    if (isValid) {
      router.push("/pages/program")
    } else {
      const missingLabels = missingFields.map((item) => item.label);
      toast.error(
        "Mohon lengkapi data berikut: " + missingLabels.join(", ")
      );
    }
  };

  return {
    errors,
    handleSubmit
  };

}