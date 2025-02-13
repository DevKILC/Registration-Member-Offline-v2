"use client";

import CustomLayout from "@/app/_components/layout";
import Select from "@/app/_components/_partials/select";
import Button from "@/app/_components/_partials/button";
import Label from "@/app/_components/_partials/label";
import { useRouter } from "next/navigation";
import TabList from "@/app/_components/_partials/tablist";
import { useProgramPagehooks } from "@/app/hooks/useProgramPageHook";
import { useFormDataStore } from "@/app/hooks/useFormDataStore";
import { useBranchDataStore } from "@/app/hooks/useBranchDataStore";
import { usePeriodeDataStore } from "@/app/hooks/usePeriodeDataStore";
import { useCourseCategoryDataStore } from "@/app/hooks/useCourseCategoryDataStore";
import { useCourseDataStore } from "@/app/hooks/useCourseDataStore";
import { useGradeDataStore } from "@/app/hooks/useGradeDataStore";
import { changeTotalPaymentToIndonesianCurrency } from "@/app/_backend/_helper/changeTotalPaymentToIndonesianCurrency";

export default function ProgramPage() {
  const router = useRouter();

  const { formData } = useFormDataStore();
  const { branchData } = useBranchDataStore();
  const { periodeData } = usePeriodeDataStore();
  const { courseCategoryData } = useCourseCategoryDataStore();
  const { courseData } = useCourseDataStore();
  const { gradeData, selectedGrade } = useGradeDataStore();

  const { 
    handleSubmit,
    handleBranchChange,
    handlePeriodeChange,
    handleCourseChange,
    handleDurationCourse,
    handleGradeChange,
    errors
  } = useProgramPagehooks();

  return (
    <CustomLayout mainline="Pilih paket program yang relevan biar kamu makin jago! 🚀" line="Drives your success from here!✨ #KampungInggrisLC #BestEnvironmentForTheBestResult">
      <form onSubmit={handleSubmit} className="mx-auto flex flex-col space-y-10 lg:space-y-[3.75rem]">
        <div className="flex flex-col space-y-4 min-h-[320px] h-full">
          {/* Select Cabang dan Periode */}
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="w-full lg:w-1/2 flex flex-col space-y-2">
              <Label htmlFor="cabang" required>
                Pilih Cabang :
              </Label>
              <Select name="cabang" options={branchData} value={formData.cabang} onChange={(e) => handleBranchChange(e)} className={` ${errors.cabang ? "border-red-500" : ""} `} />
              {branchData.length === 0 && (
                <p className="text-red-500 text-[10px] pl-2 lg:absolute lg:translate-y-[3.8rem]">
                  Maaf, belum ada cabang tersedia untuk jenjang <span className="font-bold uppercase">{formData.kesibukan}</span> saat ini 🙏🏻.
                </p>
              )}
              {errors.cabang && <p className="text-red-500 text-[10px] pl-2 lg:absolute lg:translate-y-[3.8rem]">{errors.cabang}</p>}
            </div>

            <div className="w-full lg:w-1/2 flex flex-col space-y-2">
              <Label htmlFor="periode" required>
                Periode :
              </Label>
              <Select name="periode" options={periodeData} value={formData.periode} onChange={(e) => handlePeriodeChange(e)} className={` ${errors.periode ? "border-red-500" : ""} `} />
              {periodeData.length === 0 && (
                <p className="text-red-500 text-[10px] pl-2 lg:absolute lg:translate-y-[3.8rem]">
                  Maaf, belum ada periode tersedia untuk cabang <span className="font-bold uppercase">{formData.cabang}</span> saat ini 🙏🏻.
                </p>
              )}
              {errors.periode && <p className="text-red-500 text-[10px] pl-2 lg:absolute lg:translate-y-[3.8rem]">{errors.periode}</p>}
            </div>
          </div>

          <div className="w-full flex flex-col sp`ac`e-y-2">
            <Label htmlFor="paket" required>
              Pilih Paket :
            </Label>

            <div className="w-full">
              <ul className="lg:flex lg:flex-row lg:flex-wrap max-w-full gap-4 grid grid-cols-2 ">
                {courseCategoryData.length === 0 && <p className="text-red-500 text-sm pl-2 border border-red-500 p-3 rounded-lg">Paket belum tersedia untuk saat ini 🙏🏻</p>}
                {courseCategoryData.map((item) => (
                  <TabList
                    key={item.course_id}
                    label={item.label}
                    value={item.value}
                    onClick={() => handleCourseChange(item)}
                    isActive={formData.kategoriPaket === item.value}
                    className={` ${errors.kategoriPaket ? "border-red-500" : ""} `}
                  />
                ))}
              </ul>

              {errors.kategoriPaket && <p className="text-red-500 text-[10px] pl-2 lg:absolute ">{errors.kategoriPaket}</p>}
            </div>
          </div>

          <div className="w-full flex flex-col space-y-2">
            <Label htmlFor="duration" required>
              Pilih Durasi Paket :
            </Label>

            <div className="overflow-y-auto scroll-hidden">
              <ul className="lg:flex lg:flex-row lg:flex-wrap lg:w-max max-w-full gap-4 grid grid-cols-2 ">
                {courseData.length === 0 && <p className="text-red-500 text-sm pl-2 border border-red-500 p-3 rounded-lg">Durasi paket belum tersedia untuk saat ini 🙏🏻</p>}
                {courseData.map((item) => (
                  <TabList
                    key={item.value}
                    label={item.label}
                    value={item.value}
                    onClick={() => handleDurationCourse(item)} // Pass the full item
                    isActive={formData.duration === item.value}
                    className={` ${errors.duration ? "border-red-500" : ""} `}
                  />
                ))}
              </ul>

              {errors.duration && <p className="text-red-500 text-[10px] pl-2 lg:absolute ">{errors.duration}</p>}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between w-full space-y-4 lg:space-y-0">
            <div className="flex flex-col space-y-2 w-full lg:w-1/2">
              {/* Gunakan switch untuk menentukan label */}
              <Label htmlFor="grade" required>
                Pilih Tipe Kamar
              </Label>

              {/* Menampilkan opsi sesuai dengan paket */}
              {(() => {
                return (
                  <div className="lg:overflow-y-auto scroll-hidden">
                    <ul className="lg:w-max w-full lg:flex lg:flex-row lg:space-x-4 grid grid-cols-2 gap-4 lg:gap-0">
                      {gradeData.length === 0 && <p className="text-red-500 text-sm pl-2 border border-red-500 p-3 rounded-lg">Pilihan tipe kamar belum tersedia untuk saat ini 🙏🏻</p>}
                      {gradeData.map((option) => (
                        <div key={option.grade.id}>
                          <TabList
                            label={option.label}
                            value={option.value}
                            onClick={() => handleGradeChange(option)}
                            isActive={(() => {
                              return formData.grade === option.value; // Aktif untuk grade
                            })()}
                            className={(() => {
                              return ` ${errors.grade ? "border-red-500" : ""} `;
                            })()}
                          />
                        </div>
                      ))}
                    </ul>

                    <div className="lg:absolute lg:w-1/4 w-auto h-auto pt-4">
                      <p className="lg:text-left text-center text-xs text-gray-400">{selectedGrade?.desc || "-"}</p>
                    </div>
                    {errors.grade && <p className="text-red-500 text-[10px] pl-2 lg:absolute">{errors.grade}</p>}
                  </div>
                );
              })()}
            </div>

            <div className="flex flex-col justify-center items-center w-full lg:pt-0 lg:w-1/4">
              <h2 className="text-center text-black font-semibold text-sm pb-2">Total Biaya :</h2>
              <h2 className="bg-bill text-center text-white py-2 px-6 rounded-[10px]">{changeTotalPaymentToIndonesianCurrency(formData.pembayaran)}</h2>
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <div className="">
          <div className="flex flex-col justify-center items-center">
            <p className="text-gray-500 text-sm text-center pb-4">Pastikan anda telah memilih program anda dengan baik & benar sebelum lanjut!</p>
            <div className="flex flex-row w-full gap-4">
              <Button type="button" className="w-full bg-white border-2 border-main-color" onClick={() => router.push("/")}>
                Kembali
              </Button>
              <Button type="submit" className="w-full">
                Lanjut!!
              </Button>
            </div>
          </div>
        </div>
      </form>
    </CustomLayout>
  );
}
