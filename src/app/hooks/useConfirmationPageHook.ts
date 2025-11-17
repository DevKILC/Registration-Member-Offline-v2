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
import { useQueryParamsDataStore } from "@/app/hooks/useQueryParamsDataStore";
import { useCourseDataStore } from "./useCourseDataStore";
import { useMetaTracking } from "./useMetaPixelEvent";
import useTiktokTracking from "./useTiktokPixelEvent";
import { useEventParamsData } from "./useEventParamsDataHook";


export const useConfirmationPageHooks = () => {

  const { formData, resetForm, setTos, updateField, setModalTosIsOpen, setPersonalDataIsValid, setCourseDataIsValid, setEventParams } = useFormDataStore();
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
  const adminFee = process.env.NEXT_PUBLIC_ADMIN_FEE || 0;
  const { selectedCourse } = useCourseDataStore();
  const { sendEvent: sendEventMetaPixel } = useMetaTracking();
  const { sendEvent: sendEventTiktokPixel } = useTiktokTracking();
  const { eventParamsData: eventParams } = useEventParamsData();
  // Track initiate checkout event when konfirmasi page loads
  const initiateCheckoutEvent = () => {
    if (eventParams?.utm_source === 'FB') {
      try {
        sendEventMetaPixel(
          'InitiateCheckout',
          {
            value: Number(formData.pembayaran),
            currency: 'IDR',
            content_type: 'product',
            content_ids: [eventParams?.utm_content || 'Unknown'],
            content_name: selectedCourse?.name || 'Unknown',
            content_category: 'payment_info',
          }
        );
      } catch (err) {
        console.error("Error sending Meta Pixel event:", err);
      }
    } else if (eventParams?.utm_source === 'TTADS') {
      sendEventTiktokPixel(
        'InitiateCheckout',
        {
          value: Number(formData.pembayaran),
          currency: 'IDR',
          content_type: 'product',
          content_id: eventParams?.utm_content || 'Unknown',
          content_name: selectedCourse?.name || 'Unknown',
          content_category: 'payment_info',
          quantity: 1,
        }
      );
    }

  };

    useEffect(() => {
    if (eventParams) {
      setEventParams(eventParams);
      initiateCheckoutEvent();
    }
  }, [eventParams, setEventParams]);

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

    const { isValid, missingFields } = validateFormDataKonfirmasi(formData);

    // Combine form data with query params
    const combainedData = {
      ...formData,
      ...Object.fromEntries(
        Object.entries(queryParams || {}).map(([key, value]) => [key, value ?? ''])
      ),
    }
    if (isValid) {

      if (eventParams?.utm_source === 'FB') {
        try {
          await sendEventMetaPixel(
            'AddPaymentInfo',
            {
              value: Number(formData.pembayaran),
              currency: 'IDR',
              content_type: 'product',
              content_ids: [eventParams?.utm_content || 'Unknown'],
              content_name: selectedCourse?.name || 'Unknown',
              content_category: 'payment_info',
            }
          );
        } catch (err) {
          console.error("Error sending Meta Pixel event:", err);
        }
      } else if (eventParams?.utm_source === 'TTADS') {
        sendEventTiktokPixel(
          'AddPaymentInfo',
          {
            value: Number(formData.pembayaran),
            currency: 'IDR',
            content_type: 'product',
            content_id: eventParams?.utm_content || 'Unknown',
            content_name: selectedCourse?.name || 'Unknown',
            content_category: 'payment_info',
            quantity: 1,
          }
        );
      }

      return;

      await registrationService
        .register(combainedData)
        .then((res) => {
          toast.dismiss();

          // Track payment info events

          setIsSubmitting(false);
          if (res.status !== 500) {
            setRegistrationResult(res.data.result);
            resetForm();
            setPersonalDataIsValid(false);
            setCourseDataIsValid(false);
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

  const capitalizeFirstLetter = (val: | string | number | undefined) => {
    if (val === null || val === undefined) return val; // Return the value as is if it's null or undefined
    const result = String(val).charAt(0).toUpperCase() + String(val).slice(1);

    return result;
  }

  const handleTosConfirmation = () => {
    if (formData.tos) {
      setTos(true);
    } {
      setTos(false);
      setModalTosIsOpen(true);
      toast.warning("Mohon membaca dan menyetujui syarat dan ketentuan terlebih dahulu");
    }
  }

  const calculateVoucher = (discount: number) => {
    const totalPembayaran = Number(formData.pembayaranCourse) - Number(discount) + Number(formData.pembayaranGrade) + Number(formData.pembayaranPenjemputan) + Number(adminFee);
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
          if (res.data.percent === 0) {
            calculateVoucher(res.data.nominal);
            updateField("diskonPersen", res.data.percent);
            toast.success("Kamu berhasil mendapatkan diskon sebesar " + changeTotalPaymentToIndonesianCurrency(res.data.nominal));
          }
          if (res.data.nominal === 0) {
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
    initiateCheckoutEvent,
  };
};