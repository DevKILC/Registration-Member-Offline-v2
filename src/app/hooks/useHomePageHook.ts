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

export const useEffectHomePageHooks = () => {

  const router = useRouter();
  // const { getBranchData } = useBranchBranch();
  const { getProvinces } = useProvincesData();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
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
  };

};