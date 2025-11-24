import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { validateFormData } from "@/app/_backend/_utils/validationAlert";
import { dataDiriSchema } from "@/app/_backend/_utils/validationZod";
import { toast } from "react-toastify";
import { useFormDataStore } from "@/app/hooks/useFormDataStore";
import { useProvincesData } from './useProvincesDataHook';
import { useResetFormHook } from './useResetFormHook';
import { useCourseDataStore } from "@/app/hooks/useCourseDataStore";
import { useGradeDataStore } from "@/app/hooks/useGradeDataStore";
import { usePeriodeDataStore } from "@/app/hooks/usePeriodeDataStore";
import { useCourseCategoryDataStore } from "@/app/hooks/useCourseCategoryDataStore";
import { useAccomodationDataStore } from "@/app/hooks/useAccomodationDataStore";
import { useBranchDataStore } from "./useBranchDataStore";
import { useEventParamsData } from './useEventParamsDataHook';

export const useEffectHomePageHooks = () => {
  const router = useRouter();
  const { getProvinces } = useProvincesData();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Tambahkan loading state
  const { getClidData, eventParamsData } = useEventParamsData();
  
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

  const { formData, setPersonalDataIsValid, updateField, setEventParams } = useFormDataStore();

  const params = {
    id : eventParamsData?.ttclid || eventParamsData?.fbc || "",
    source : eventParamsData?.source || "",
  }
  const handleSaveEventParams = () => {
    setEventParams(params);
  }

  // Handle submit form - FIXED VERSION
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Validasi form
      const result = dataDiriSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: { [key: string]: string } = {};
        result.error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      } else {
        setErrors({});
      }

      // Validasi data form
      const { isValid, missingFields } = validateFormData(formData);

      if (!isValid) {
        setPersonalDataIsValid(false);
        const missingLabels = missingFields.map((item) => item.label);
        toast.error("Mohon lengkapi data berikut: " + missingLabels.join(", "));
        setIsSubmitting(false);
        return;
      }

      setPersonalDataIsValid(true);

      // PENTING: Await getClidData sebelum redirect
      console.log('Fetching CLID data for phone:', formData.nomor);
      await getClidData(String(formData.nomor));
      console.log('CLID data fetched successfully');

      // Simpan data di sessionStorage setelah CLID berhasil
      sessionStorage.setItem("formData", JSON.stringify(formData));

      // Tambahkan sedikit delay untuk memastikan cookie tersimpan
      await new Promise(resolve => setTimeout(resolve, 300));

      // Redirect ke halaman program
      router.push("/pages/program");
      
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  const educationChangeHandler = (educationCode: string) => {
    updateField("kesibukan", educationCode);

    // Reset semua data store
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
    handleSaveEventParams,
    isSubmitting, // Return loading state untuk disable button
  };
};