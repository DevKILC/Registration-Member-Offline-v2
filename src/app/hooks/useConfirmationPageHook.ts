import { useEffect, useState, useCallback, useRef } from "react";
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
import { useQueryParamsDataStore } from "@/app/hooks/useQueryParamsDataStore";
import { useCourseDataStore } from "./useCourseDataStore";
import { useMetaTracking } from "./useMetaPixelEvent";
import useTiktokTracking from "./useTiktokPixelEvent";
import { useEventParamsData } from "./useEventParamsDataHook";

export const useConfirmationPageHooks = () => {
  const { formData, resetForm, setTos, updateField, setModalTosIsOpen, setPersonalDataIsValid, setCourseDataIsValid } = useFormDataStore();
  const { setRegistrationResult } = useRegistrationResultDataStore();
  const { queryParams } = useQueryParamsDataStore();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [akomodasi, setAkomodasi] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voucher, setVoucher] = useState("");
  const [debouncedValue] = useDebounce(voucher, 200);
  
  // Track if InitiateCheckout has been sent
  const initiateCheckoutSentRef = useRef(false);
  
  const adminFee = process.env.NEXT_PUBLIC_ADMIN_FEE || 0;
  
  const { selectedCourse } = useCourseDataStore();
  const { sendEvent: sendEventMetaPixel } = useMetaTracking();
  const { sendEvent: sendEventTiktokPixel } = useTiktokTracking();
  const { eventParamsData: eventParams } = useEventParamsData();

  // Send InitiateCheckout ONLY when TOS is checked
  const sendInitiateCheckout = useCallback(() => {
    // Jangan kirim jika sudah pernah dikirim
    if (initiateCheckoutSentRef.current || !eventParams) return;

    const eventData = {
      value: Number(formData.pembayaran),
      currency: 'IDR',
      content_type: 'product',
      content_name: selectedCourse?.name || 'Unknown',
      content_category: 'payment_info',
    };

    try {
      if (eventParams.utm_source === 'FB') {
        sendEventMetaPixel('InitiateCheckout', {
          ...eventData,
          content_ids: [eventParams.utm_content || 'Unknown'],
        });
        initiateCheckoutSentRef.current = true;
        console.log('✅ InitiateCheckout sent to Meta Pixel');
      } else if (eventParams.utm_source === 'TTADS') {
        sendEventTiktokPixel('InitiateCheckout', {
          ...eventData,
          content_id: eventParams.utm_content || 'Unknown',
          quantity: 1,
        });
        initiateCheckoutSentRef.current = true;
        console.log('✅ InitiateCheckout sent to TikTok Pixel');
      }
    } catch (err) {
      console.error("Error sending InitiateCheckout event:", err);
    }
  }, [eventParams, formData.pembayaran, selectedCourse, sendEventMetaPixel, sendEventTiktokPixel]);

  // Track payment info (saat submit)
  const trackPaymentInfo = async () => {
    if (!eventParams) return;

    const eventData = {
      value: Number(formData.pembayaran),
      currency: 'IDR',
      content_type: 'product',
      content_name: selectedCourse?.name || 'Unknown',
      content_category: 'payment_info',
    };

    try {
      if (eventParams.utm_source === 'FB') {
        await sendEventMetaPixel('AddPaymentInfo', {
          ...eventData,
          content_ids: [eventParams.utm_content || 'Unknown'],
        });
        console.log('✅ AddPaymentInfo sent to Meta Pixel');
      } else if (eventParams.utm_source === 'TTADS') {
        await sendEventTiktokPixel('AddPaymentInfo', {
          ...eventData,
          content_id: eventParams.utm_content || 'Unknown',
          quantity: 1,
        });
        console.log('✅ AddPaymentInfo sent to TikTok Pixel');
      }
    } catch (err) {
      console.error("Error sending payment info event:", err);
    }
  };

  // Handle submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = konfirmasiSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: { [key: string]: string } = {};
        result.error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }
      
      setErrors({});

      const { isValid, missingFields } = validateFormDataKonfirmasi(formData);
      
      if (!isValid) {
        const missingLabels = missingFields.map((item) => item.label);
        toast.error("Mohon lengkapi data berikut: " + missingLabels.join(", "));
        setIsSubmitting(false);
        return;
      }

      const combainedData = {
        ...formData,
        ...Object.fromEntries(
          Object.entries(queryParams || {}).map(([key, value]) => [key, value ?? ''])
        ),
      };

      const res = await registrationService.register(combainedData);
      
      toast.dismiss();

      if (res.status === 500) {
        throw new Error("Server error");
      }

      // Kirim AddPaymentInfo sebelum redirect
      await trackPaymentInfo();

      setRegistrationResult(res.data.result);
      resetForm();
      setPersonalDataIsValid(false);
      setCourseDataIsValid(false);
      router.push("/pages/thankyou");

    } catch (err) {
      toast.dismiss();
      console.error("Error registering:", err);
      toast.error("Terjadi kesalahan di server, silahkan coba lagi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const capitalizeFirstLetter = (val: string | number | undefined) => {
    if (val === null || val === undefined) return val;
    const result = String(val).charAt(0).toUpperCase() + String(val).slice(1);
    return result;
  };

  // FIXED: Kirim InitiateCheckout HANYA saat checkbox di-centang
  const handleTosConfirmation = () => {
    if (!formData.tos) {
      // User baru centang checkbox
      setTos(true);
      // Kirim InitiateCheckout HANYA SEKALI
      sendInitiateCheckout();
    } else {
      // User un-centang checkbox
      setTos(false);
      setModalTosIsOpen(true);
      toast.warning("Mohon membaca dan menyetujui syarat dan ketentuan terlebih dahulu");
    }
  };

  const calculateVoucher = useCallback((discount: number) => {
    const totalPembayaran = 
      Number(formData.pembayaranCourse) - 
      Number(discount) + 
      Number(formData.pembayaranGrade) + 
      Number(formData.pembayaranPenjemputan) + 
      Number(adminFee);
    
    updateField("diskonNominal", discount);
    updateField("pembayaran", totalPembayaran);
  }, [formData.pembayaranCourse, formData.pembayaranGrade, formData.pembayaranPenjemputan, adminFee, updateField]);

  const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateField("diskon", value);
    setVoucher(value);
  };

  const checkVoucher = useCallback(async (code: string) => {
    toast.loading("Memeriksa kode voucher...");
    
    const filter = {
      voucher_code: code,
      course_id: Number(formData.paket),
    };

    try {
      const res = await voucherService.getVoucher(filter);
      toast.dismiss();

      if (res.data === null) {
        toast.error("Kode voucher tidak valid");
        calculateVoucher(0);
        return;
      }

      if (res.data.percent === 0) {
        calculateVoucher(res.data.nominal);
        updateField("diskonPersen", res.data.percent);
        toast.success(
          "Kamu berhasil mendapatkan diskon sebesar " + 
          changeTotalPaymentToIndonesianCurrency(res.data.nominal)
        );
      } else if (res.data.nominal === 0) {
        const discount = (formData.pembayaranCourse * res.data.percent) / 100;
        calculateVoucher(discount);
        updateField("diskonPersen", res.data.percent);
        toast.success(
          "Kamu berhasil mendapatkan diskon sebesar " + 
          changeTotalPaymentToIndonesianCurrency(discount)
        );
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Kode voucher tidak valid");
      calculateVoucher(0);
      console.error("Voucher check error:", err);
    }
  }, [formData.paket, formData.pembayaranCourse, calculateVoucher, updateField]);

  useEffect(() => {
    if (debouncedValue !== "") {
      checkVoucher(debouncedValue);
    }
  }, [debouncedValue, checkVoucher]);

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
};