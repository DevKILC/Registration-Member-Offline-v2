import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { programSchema } from "@/app/_backend/_utils/validationZod";
import { useRouter } from "next/navigation";
import { useFormDataStore } from "@/app/hooks/useFormDataStore";
import { useCourseDataStore } from "@/app/hooks/useCourseDataStore";
import { Course, Grade, CourseCategoryStore, CourseSelect, GradeSelect, MeetHour } from "@/app/_backend/_utils/Interfaces";
import { useGradeDataStore } from "@/app/hooks/useGradeDataStore";
import { useResetFormHook } from "@/app/hooks/useResetFormHook";
import { usePeriodeDataHook } from "@/app/hooks/usePeriodeDataHook";
import { useGradeDataHook } from "@/app/hooks/useGradeDataHook";
import { useCourseCategoryDataHook } from "@/app/hooks/useCourseCategoryDataHook";
import { useCourseDataHook } from "@/app/hooks/useCourseDataHook";
import { usePeriodeDataStore } from "@/app/hooks/usePeriodeDataStore";
import { useCourseCategoryDataStore } from "@/app/hooks/useCourseCategoryDataStore";
import { useAccomodationDataStore } from "@/app/hooks/useAccomodationDataStore";
import { useMeetHourDataHook } from "@/app/hooks/useMeetHourDataHook";
import { useAccomodationDataHook } from "@/app/hooks/useAccomodationDataHook";
import { useBranchBranch } from "./useBranchDataHook";
import { useBranchDataStore } from "./useBranchDataStore";

export const useProgramPagehooks = () => {
  const router = useRouter();
  const { formData, handleOptionTabClick, setCourseDataIsValid } = useFormDataStore();
  const { selectedCourse, setSelectedCourse, setCourse } = useCourseDataStore();
  const { getPickupLocation } = useAccomodationDataHook();
  const { updateField } = useFormDataStore();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const {
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
  const { setPickupData, setLocationData, setPassengerData, setSelectedPickup, setSelectedLocation, setSelectedPassenger } = useAccomodationDataStore();
  const { getPeriodeData } = usePeriodeDataHook();
  const { getGradeData } = useGradeDataHook();
  const { getCourseCategories } = useCourseCategoryDataHook();
  const { getCourseData } = useCourseDataHook();
  const { setSelectedGrade, selectedGrade, setGrade, gradeData } = useGradeDataStore();
  const { setPeriode } = usePeriodeDataStore();
  const { setCourseCategory } = useCourseCategoryDataStore();
  const { getMeetHourData } = useMeetHourDataHook();
  const { getBranchData} = useBranchBranch();
  const { setBranch } = useBranchDataStore ();

  // Biaya admin
  const adminFee = process.env.NEXT_PUBLIC_ADMIN_FEE || 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = programSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setCourseDataIsValid(false);
    } else {
      setErrors({});
      setCourseDataIsValid(true);
      // Cek cabang untuk navigasi
      if (formData.cabang === "PARE") {
        getPickupLocation();
        router.push("/pages/akomodasi");
      } else {
        router.push("/pages/konfirmasi");
      }
    }
  };

  const calculateTotalPaymentCourse = (selectedCourse: Course) => {
    updateField("pembayaranCourse", selectedCourse.price);
    if (formData.paket === selectedCourse.course_id.toString()) return;
    const gradePrice = selectedGrade?.price || 0;
    updateField("pembayaran", selectedCourse.price + gradePrice + Number(adminFee));
  };


  const calculateTotalPaymentGrade = (data: Grade) => {
    if (formData.grade === data.id.toString()) return;
    const coursePrice = selectedCourse?.price || 0;
    updateField("pembayaran", coursePrice + data.price + Number(adminFee));
  };

  const handleProvinceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateField("provinsi", e.target.value);
      resetBranch();
      setBranch([]);
      resetPeriode();
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
      getBranchData(e.target.value);
    },
    [getBranchData]
  );

  const handleBranchChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateField("cabang", e.target.value);

      resetPeriode();
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
      getPeriodeData(e.target.value);
    },
    [getPeriodeData]
  );

  const handlePeriodeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateField("periode", e.target.value);
      resetCategoryCourse();
      resetSelectedCourse();
      resetSelectedDuration();
      resetSelectedGrade();
      resetSelectedDuration();
      resetJamPertemuan();
      setSelectedCourse(null);
      resetPembayaranPaket();
      setCourse([]);
      setGrade([]);
      resetTotalPrice();
      getCourseCategories(e.target.value);
    },
    [getCourseData]
  );

  const handleCourseChange = useCallback(
    async (item: CourseCategoryStore) => {
      resetSelectedCourse();
      resetSelectedDuration();
      resetSelectedGrade();
      resetJamPertemuan();
      setGrade([]);
      resetTotalPrice();
      resetJamPertemuan();
      resetPembayaranPaket();
      setSelectedGrade(null);
      updateField("kategoriPaket", item.value);
      getCourseData(item.course_id, item.value);
    },
    [getPeriodeData]
  );

  const handleDurationCourse = useCallback(
    async (item: CourseSelect) => {
      setGrade([]);
      setSelectedGrade(null);
      resetTotalPrice();
      resetPembayaranPaket();
      updateField("pembayaranGrade", "");
      updateField("duration", item.value);
      updateField("paket", item.value);
      updateField("grade", "");

      setSelectedCourse(item.course);

      calculateTotalPaymentCourse(item.course);

      // Ambil data grade berdasarkan course
      await getGradeData({
        branch_code: formData.cabang,
        periode_id: formData.periode,
        course_id: item.course.course_id,
      });

      if (item.course.is_additional_meet_hour === 1) {
        updateField("is_additional_meet_hour", 1);
        const filter = {
          course_id: item.course.course_id,
          status: 1,
        };
        getMeetHourData(filter);
      }
    },
    [formData.cabang, formData.periode, getGradeData, getMeetHourData]
  );

  const handleGradeChange = useCallback(
    (item: GradeSelect) => {
      handleOptionTabClick(item.value);
      calculateTotalPaymentGrade(item.grade);
      updateField("pembayaranGrade", item.grade.price);
      updateField("grade", item.grade.id.toString());
      if (selectedCourse) {
        calculateTotalPaymentCourse(selectedCourse);
      }
      setSelectedGrade(item.grade);
      if (item.grade.price === 0) {
        updateField("isGrade", 0);
      } else {
        updateField("isGrade", 1);
      }
    },
    [[handleOptionTabClick, calculateTotalPaymentGrade, updateField, setSelectedGrade]]
  );

  useEffect(() => {
    if (gradeData && gradeData.length > 0 && selectedGrade === null) {
      const firstGrade = gradeData[0];

      const defaultGradeSelect = {
        value: firstGrade.value,
        label: firstGrade.label,
        grade: firstGrade.grade,
      };

      handleGradeChange(defaultGradeSelect);
    }
  }, [gradeData, selectedGrade, handleGradeChange]);

  const handleMeethourChange = useCallback(
    (data: MeetHour) => {
      updateField("meet_hour", data.id.toString());
    },
    [getPeriodeData]
  );

  return {
    handleSubmit,
    formData,
    calculateTotalPaymentCourse,
    calculateTotalPaymentGrade,
    handleProvinceChange,
    handleBranchChange,
    handlePeriodeChange,
    handleCourseChange,
    handleDurationCourse,
    handleGradeChange,
    handleMeethourChange,

    errors,
  };
};
