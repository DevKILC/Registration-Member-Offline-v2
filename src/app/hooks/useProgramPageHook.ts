import React, { useCallback, useState } from "react"
import { programSchema } from "@/app/_backend/_utils/validationZod";
import { useRouter } from "next/navigation";
import { useFormDataStore } from "@/app/hooks/useFormDataStore";
import { useCourseDataStore } from "@/app/hooks/useCourseDataStore";
import { Course, Grade, CourseCategoryStore, CourseSelect, GradeSelect } from "@/app/_backend/_utils/Interfaces";
import { useGradeDataStore } from "@/app/hooks/useGradeDataStore";
import { useResetFormHook } from "@/app/hooks/useResetFormHook";
import { usePeriodeDataHook } from "@/app/hooks/usePeriodeDataHook";
import { useGradeDataHook } from "@/app/hooks/useGradeDataHook";
import { useCourseCategoryDataHook } from "@/app/hooks/useCourseCategoryDataHook";
import { useCourseDataHook } from "@/app/hooks/useCourseDataHook";

export const useProgramPagehooks = () => {
  const router = useRouter();
  const { formData, handleOptionTabClick } = useFormDataStore();
  const { selectedCourse, setSelectedCourse } = useCourseDataStore();
  const { updateField } = useFormDataStore();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { 
    resetCategoryCourse, 
    resetSelectedCourse, 
    resetSelectedDuration, 
    resetSelectedGrade,
    resetTotalPrice
  } = useResetFormHook();
  const { getPeriodeData } = usePeriodeDataHook();
  const { getGradeData } = useGradeDataHook();
  const { getCourseCategories } = useCourseCategoryDataHook();
  const { getCourseData } = useCourseDataHook();
  const { setSelectedGrade, selectedGrade } = useGradeDataStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const result = programSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      // Cek cabang untuk navigasi
      if (formData.cabang === "PARE") {
        router.push("/pages/akomodasi");
      } else {
        router.push("/pages/konfirmasi");
      }
    }
  }

  const calculateTotalPaymentCourse = (selectedCourse: Course) => {
    updateField("pembayaranCourse", selectedCourse.price);
    if (formData.paket === selectedCourse.course_id.toString()) return;
    const gradePrice = selectedGrade?.price || 0;
    updateField("pembayaran", selectedCourse.price + gradePrice);
  };

  const calculateTotalPaymentGrade = (data: Grade) => {
    if (formData.grade === data.id.toString()) return;
    const coursePrice = selectedCourse?.price || 0;
    updateField("pembayaran", coursePrice + data.price);
  };

  const handleBranchChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateField("cabang", e.target.value);
      getPeriodeData(e.target.value);
      getGradeData({
        branch_code: e.target.value,
        periode_id: formData.periode,
        course_id: null,
      });
      resetCategoryCourse();
      resetSelectedCourse();
      resetSelectedDuration();
      resetSelectedGrade();
      resetTotalPrice();
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
      resetTotalPrice();
      getCourseCategories(e.target.value);
      getGradeData({
        branch_code: formData.cabang,
        periode_id: e.target.value,
        course_id: null,
      });
    },
    [getCourseData]
  );

  const handleCourseChange = useCallback(
    (item: CourseCategoryStore) => {
      updateField("kategoriPaket", item.value);
      resetSelectedCourse();
      resetSelectedDuration();
      resetSelectedGrade();
      getCourseData(item.value);
      resetTotalPrice();
      setSelectedGrade(null);
    },
    [getPeriodeData]
  );

  const handleDurationCourse = useCallback(
    (item: CourseSelect) => {
      updateField("duration", item.value);
      updateField("paket", item.value);
      getGradeData({
        branch_code: formData.cabang,
        periode_id: formData.periode,
        course_id: item.course.course_id,
      });
      setSelectedCourse(item.course);
      calculateTotalPaymentCourse(item.course);
    },
    [getPeriodeData]
  );

  const handleGradeChange = useCallback(
    (item: GradeSelect) => {
      handleOptionTabClick(item.value);
      calculateTotalPaymentGrade(item.grade);
      updateField("pembayaranGrade", item.grade.price);
      setSelectedGrade(item.grade);
      if (item.grade.price === 0) {
        updateField("isGrade", 0);
      } else {
        updateField("isGrade", 1);
      }
    },
    [getPeriodeData]
  );

  return {
    handleSubmit,
    formData,
    calculateTotalPaymentCourse,
    calculateTotalPaymentGrade,
    handleBranchChange,
    handlePeriodeChange,
    handleCourseChange,
    handleDurationCourse,
    handleGradeChange,
    errors
  };
}