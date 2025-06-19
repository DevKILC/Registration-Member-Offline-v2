import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { akomodasiSchema } from "@/app/_backend/_utils/validationZod";
import { validateFormDataAkomodasi } from "@/app/_backend/_utils/validationAlert";
import { useFormDataStore } from "@/app/hooks/useFormDataStore";

export const useAccomodationPageHook = () => {
  const router = useRouter();
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { formData, updateField } = useFormDataStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  
    if (formData.lokasijemput === "no_pickup") {
      updateField("kendaraan", "");
      updateField("penumpang", "");
      updateField("pembayaranPenjemputan", 0);
      
    
      const coursePrice = formData.pembayaranCourse;
      const gradePrice = formData.pembayaranGrade;
      const adminFee = process.env.NEXT_PUBLIC_ADMIN_FEE || 0;
      const total = Number(coursePrice) + Number(gradePrice) + Number(adminFee);
      updateField("pembayaran", total);
      

      router.push("/pages/konfirmasi");
      return;
    }

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