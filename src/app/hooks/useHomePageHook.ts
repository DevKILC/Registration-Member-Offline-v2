import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { validateFormData } from "@/app/_backend/_utils/validationAlert";
import { dataDiriSchema } from "@/app/_backend/_utils/validationZod";
import { toast } from "react-toastify";
import { useFormDataStore } from "@/app/hooks/useFormDataStore";
// import { useBranchBranch } from "@/app/hooks/useBranchDataHook";
import { useProvincesData } from './useProvincesDataHook';
import { useResetFormHook } from './useResetFormHook';

// Import semua store hooks yang diperlukan
import { useCourseDataStore } from "@/app/hooks/useCourseDataStore";
import { useGradeDataStore } from "@/app/hooks/useGradeDataStore";
import { usePeriodeDataStore } from "@/app/hooks/usePeriodeDataStore";
import { useCourseCategoryDataStore } from "@/app/hooks/useCourseCategoryDataStore";
import { useAccomodationDataStore } from "@/app/hooks/useAccomodationDataStore";
import { useBranchDataStore } from "./useBranchDataStore";
import { useTiktokTracking } from './useTiktokPixelEvent';
import { useMetaTracking } from './useMetaPixelEvent';
import { clidService } from '../services/leadGetClidService';
import { useEventParamsData } from './useEventParamsDataHook';
export const useEffectHomePageHooks = () => {

  const router = useRouter();
  // const { getBranchData } = useBranchBranch();
  const { getProvinces } = useProvincesData();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { sendEvent: sendEventMetaPixel } = useMetaTracking();
  const { sendEvent: sendEventTiktokPixel } = useTiktokTracking();
  const eventParams = useEventParamsData();

  const {
    resetProvince,
    resetCategoryCourse,
    resetSelectedCourse,
    resetSelectedDuration,
    resetSelectedGrade,
    resetTotalPrice,
    resetPeriode,
    resetLokasiPenjemputan,
    resetKendaraanPenjemputan,
    resetPenumpangPenjemputan,
    resetPembayaranPenjemputan,
    resetPembayaranPaket,
    resetJamPertemuan,
    resetBranch,
  } = useResetFormHook();

  // Import store setters yang diperlukan seperti di useProgramPagehooks
  const { setSelectedCourse, setCourse } = useCourseDataStore();
  const { setSelectedGrade, setGrade } = useGradeDataStore();
  const { setPeriode } = usePeriodeDataStore();
  const { setCourseCategory } = useCourseCategoryDataStore();
  const {
    setPickupData,
    setLocationData,
    setPassengerData,
    setSelectedPickup,
    setSelectedLocation,
    setSelectedPassenger
  } = useAccomodationDataStore();
  const { setBranch } = useBranchDataStore();


  // State untuk menyimpan data form
  // const [formData, setFormData] = useState(defaultFormData);
  const { formData, setPersonalDataIsValid, updateField } = useFormDataStore();
 

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
      setPersonalDataIsValid(true);
      router.push("/pages/program")
    } else {
      setPersonalDataIsValid(false);
      const missingLabels = missingFields.map((item) => item.label);
      toast.error(
        "Mohon lengkapi data berikut: " + missingLabels.join(", ")
      );
    }
  };

  const testSendCustomPixelEvent = async () => {
    // Test send custom event to Meta Pixel
    try {
       await sendEventTiktokPixel(
          'TestCustomEvent1',
          {
            ttp: eventParams?.ttp,
            ttclid: eventParams?.ttclid,
            ip: null,
            user_agent: null,
          }
        );
    } catch (error) {
      console.error("Error sending TikTok Pixel event:", error);
    }
  };

  const sendEventMetaPixelOrTiktokPixel = async () => {
    

    // jika ttclid kirim ke tiktok jika fbc kirim ke meta
    if (eventParams?.ttclid || eventParams?.utm_content === 'TTADS') {

      try {
        // Kirim event ke TikTok Pixel
        await sendEventTiktokPixel(
          'CustomPageView',
          {
            ttp: eventParams?.ttp,
            ttclid: eventParams?.ttclid,
            ip: null,
            user_agent: null,
          }
        );
      } catch (error) {
        console.error("Error sending TikTok Pixel event:", error);
      }
    } else if (eventParams?.fbc || eventParams?.utm_source === 'FB') {
      // Kirim event ke Meta Pixel
      try {
        await sendEventMetaPixel(
          'CustomPageView',
          {
            fbp: eventParams?.fbp,
            fbc: eventParams?.fbc,
            client_ip_address: null,
            client_user_agent: null,
          }
        );
      }
      catch (error) {
        console.error("Error sending Meta Pixel event:", error);
      }
    }
  };

  const getClidData = async (phone_number: string) => {
    // jika fbc atau ttclid tidak ada get dari lead service
    if (!eventParams?.fbc || !eventParams?.ttclid) {
      console.log('Clid not detected. Fetching clid data for phone number:', phone_number);
      const result = await clidService.getClid({ phone_number });

     //jika response result contain fb maka simpan di _fbc cookie jika ttclid simpan di _ttclid cookie
      if (result) {
        if (result.source === 'FB') {
          document.cookie = `_fbc=${result.id}; path=/; max-age=${60 * 60 * 24 * 90}`; // 90 days
          console.log('FBC Cookie set:', result.id);
        }
        if (result.source === 'TTADS') {
          document.cookie = `_ttclid=${result.id}; path=/; max-age=${60 * 60 * 24 * 90}`; // 90 days
          console.log('TTCLID Cookie set:', result.id);
        }
      }
    }
  }

  const educationChangeHandler = (educationCode: string) => {
    updateField("kesibukan", educationCode);

    // Reset semua data store seperti di useProgramPagehooks
    setBranch([]);
    setPeriode([]);
    setCourseCategory([]);
    setCourse([]);
    setGrade([]);
    setPickupData([]);
    setLocationData([]);
    setPassengerData([]);
    setSelectedCourse(null);
    setSelectedPickup(null);
    setSelectedLocation(null);
    setSelectedPassenger(null);
    setSelectedGrade(null);

    // Reset form fields
    resetProvince();
    resetBranch();
    resetPeriode();
    resetCategoryCourse();
    resetSelectedCourse();
    resetSelectedDuration();
    resetSelectedGrade();
    resetLokasiPenjemputan();
    resetKendaraanPenjemputan();
    resetPenumpangPenjemputan();
    resetPembayaranPenjemputan();
    resetPembayaranPaket();
    resetTotalPrice();
    resetJamPertemuan();

    getProvinces(educationCode);
  };

  return {
    errors,
    handleSubmit,
    educationChangeHandler,
    sendEventMetaPixelOrTiktokPixel,
    getClidData,
    testSendCustomPixelEvent,
  };

};