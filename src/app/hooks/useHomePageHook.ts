import React, { useState, useCallback, useEffect } from 'react';
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

export const useHomePageHooks = () => {
  const router = useRouter();
  const { getProvinces } = useProvincesData();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const { formData, setPersonalDataIsValid, updateField } = useFormDataStore();
  useEffect(() => {

    if (eventParamsData) {
      const clidData = {
        id: eventParamsData.ttclid || eventParamsData.fbc || null,
        source: eventParamsData.source || null,
      };
      
      // Only update if we have valid data
      if (clidData.id || clidData.source) {
        console.log("Saving clid to formData:", clidData);
        updateField("clid", clidData as any);
      }
    }
  }, [eventParamsData, updateField]);

  // Safe sessionStorage wrapper
  const saveToSessionStorage = (key: string, data: any) => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (error) {
        console.error('Failed to save to sessionStorage:', error);
        return false;
      }
    }
    return false;
  };

  // Handle submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) {
      console.log('Already submitting, ignoring duplicate submission');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Step 1: Validate with Zod
      const result = dataDiriSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: { [key: string]: string } = {};
        result.error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
        toast.error("Mohon perbaiki kesalahan pada form");
        return;
      }
      
      setErrors({});

      // Step 2: Validate required fields
      const { isValid, missingFields } = validateFormData(formData);
      if (!isValid) {
        setPersonalDataIsValid(false);
        const missingLabels = missingFields.map((item) => item.label);
        toast.error("Mohon lengkapi data berikut: " + missingLabels.join(", "));
        return;
      }

      // Step 3: Validate phone number
      if (!formData.nomor) {
        toast.error("Nomor telepon diperlukan");
        return;
      }

      setPersonalDataIsValid(true);

      // Step 4: Fetch CLID data with timeout
      console.log('Fetching CLID data for phone:', formData.nomor);
      
      try {
        const clidPromise = getClidData(String(formData.nomor));
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('CLID fetch timeout')), 10000)
        );
        
        await Promise.race([clidPromise, timeoutPromise]);
        console.log('CLID data fetched successfully');
      } catch (clidError) {
        console.error('CLID fetch error:', clidError);
        // Don't block user flow if CLID fails
        toast.warning("Beberapa data tidak dapat disimpan, tetapi Anda dapat melanjutkan");
      }

      // Step 5: Save to sessionStorage
      const saved = saveToSessionStorage("formData", formData);
      if (!saved) {
        console.warn('Failed to save to sessionStorage, but continuing');
      }

      // Step 6: Navigate to next page
      router.push("/pages/program");
      
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      // Always reset submission state
      setIsSubmitting(false);
    }
  };

  const educationChangeHandler = useCallback((educationCode: string) => {
    updateField("kesibukan", educationCode);

    // Reset all data stores
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

    // Fetch new provinces data
    getProvinces(educationCode);
  }, [
    updateField,
    setBranch,
    setPeriode,
    setCourseCategory,
    setCourse,
    setGrade,
    setPickupData,
    setLocationData,
    setPassengerData,
    setSelectedCourse,
    setSelectedPickup,
    setSelectedLocation,
    setSelectedPassenger,
    setSelectedGrade,
    resetProvince,
    resetBranch,
    resetPeriode,
    resetCategoryCourse,
    resetSelectedCourse,
    resetSelectedDuration,
    resetSelectedGrade,
    resetLokasiPenjemputan,
    resetKendaraanPenjemputan,
    resetPenumpangPenjemputan,
    resetPembayaranPenjemputan,
    resetPembayaranPaket,
    resetTotalPrice,
    resetJamPertemuan,
    getProvinces,
  ]);

  return {
    errors,
    handleSubmit,
    educationChangeHandler,
    isSubmitting,
  };
};