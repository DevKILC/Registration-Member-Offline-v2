import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { konfirmasiSchema } from "@/app/_backend/_utils/validationZod";
import { validateFormDataKonfirmasi } from "@/app/_backend/_utils/validationAlert";
import { toast } from "react-toastify";
import { useFormDataStore } from "@/app/hooks/useFormDataStore";
import { voucherService } from "@/app/services/voucherService";
import { changeTotalPaymentToIndonesianCurrency } from "@/app/_backend/_helper/changeTotalPaymentToIndonesianCurrency";
import { registrationService } from "@/app/services/registrationService";
import { useDebounce } from "use-debounce";
import { useRegistrationResultDataStore } from "./useRegistrationResultDataStore";

export const useConfirmationPageHooks = () => {

  const { formData, setTos, updateField } = useFormDataStore();
  const { setRegistrationResult } = useRegistrationResultDataStore();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [akomodasi, setAkomodasi] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voucher, setVoucher] = useState("");
  const [debouncedValue] = useDebounce(voucher, 1000);

  // Handle submit form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = konfirmasiSchema.safeParse(formData);
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

    // Redirect ke halaman thankyou
    const { isValid, missingFields } = validateFormDataKonfirmasi(formData);

    if (isValid) {
      await registrationService
        .register(formData)
        .then((res) => {
          toast.dismiss();
          setIsSubmitting(false);
          if (res.status !== 500){
            setRegistrationResult(res.data.result);
            router.push("/pages/thankyou");
          };
        })
        .catch((err) => {
          toast.dismiss();
          console.error("Error registering:", err);
          toast.error("Terjadi kesalahan di server, silahkan coba lagi");
          setIsSubmitting(false);
        });
    } else {
      const missingLabels = missingFields.map((item) => item.label);
      setIsSubmitting(false);
      toast.error(
        "Mohon lengkapi data berikut: " + missingLabels.join(", ")
      );
    }
  };
  
  const capitalizeFirstLetter = (val: | string | number | undefined)=> {
    if (val === null || val === undefined) return val; // Return the value as is if it's null or undefined
    const result = String(val).charAt(0).toUpperCase() + String(val).slice(1);
    
    return result;
  }

  const handleTosConfirmation = () => {
    if (formData.tos) {
      setTos(true);
    }{
      setTos(false);
      toast.error("Mohon membaca dan menyetujui syarat dan ketentuan terlebih dahulu");
    }
  }

  const calculateVoucher = (discount: number) => {
    const totalPembayaran = (formData.pembayaranCourse - discount) + formData.pembayaranGrade + formData.pembayaranPenjemputan + formData.biayaAdmin;
    updateField("diskonNominal", discount);
    updateField("pembayaran", totalPembayaran);
  }

  const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateField("diskon", value);
    setVoucher(value);
  }

  useEffect(() => {
    if (debouncedValue !== "") {
      checkVoucher(debouncedValue);
    }
  }, [debouncedValue]);

  const checkVoucher = async (code: string) => {
    toast.loading("Memeriksa kode voucher...");
    if (formData.diskon === null)return;
    const filter = {
      voucher_code: code,
      course_id: Number(formData.paket),
    };
    await voucherService.getVoucher(filter)
    .then((res) => {
      toast.dismiss();
      if (res.data === null) {
        toast.error("Kode voucher tidak valid");
        calculateVoucher(0);
      } else {
        if(res.data.percent === 0){
          calculateVoucher(res.data.nominal);
          updateField("diskonPersen", res.data.percent);
          toast.success("Kamu berhasil mendapatkan diskon sebesar " + changeTotalPaymentToIndonesianCurrency(res.data.nominal));
        }
        if(res.data.nominal === 0){
          const discount = (formData.pembayaranCourse * res.data.percent) / 100;
          calculateVoucher(discount);
          toast.success("Kamu berhasil mendapatkan diskon sebesar " + changeTotalPaymentToIndonesianCurrency(discount));
        }
      }
    })
    .catch(() => {
      // toast.error("Kode voucher tidak valid");
    });

  }

  return {
    formData,
    accepted,
    setAccepted,
    akomodasi,
    setAkomodasi,
    errors,
    setErrors,
    isOpen,
    setIsOpen,
    isModalOpen,
    setIsModalOpen,
    router,
    handleSubmit,
    capitalizeFirstLetter,
    handleTosConfirmation,
    checkVoucher,
    calculateVoucher,
    handleVoucherChange,
    isSubmitting,
  };
}