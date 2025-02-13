"use client";

import Input from "./_components/_partials/input";
import CustomLayout from "./_components/layout";
import Select from "./_components/_partials/select";
import Button from "./_components/_partials/button";
import Label from "./_components/_partials/label";
import TabList from "./_components/_partials/tablist";
import { useEffectHomePageHooks } from "./hooks/useHomePageHook";
import { genderOptions } from "@/app/data/gender"
import { useFormDataStore } from "./hooks/useFormDataStore";
import { useEducationDataHook } from "./hooks/useEducationDataHook";
import { useEducationDataStore } from "./hooks/useEducationDataStore";
import { useBranchBranch } from "./hooks/useBranchDataHook";

export default function Page() {

  const { formData, updateField, handleTabClick } = useFormDataStore();
  const { getEducations } = useEducationDataHook();
  const { educationData } = useEducationDataStore();
  const { getBranchData } = useBranchBranch();
  const { 
    errors,
    handleSubmit,
    
  } = useEffectHomePageHooks();

  return (
    <CustomLayout mainline="Langkah pertama untuk sukses dimulai di sini! 🚀" line="Let's conquer English together! 💪 #KampungInggrisLC #RaihSuksesMuBersamaLC">
      <form onSubmit={handleSubmit} className="mx-auto flex flex-col space-y-10 lg:space-y-44">
        <div className="flex flex-col space-y-4 h-full">
          {/* Input Nama */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama" required>
              Nama Lengkap :
            </Label>
            <Input
              type="text"
              name="nama"
              placeholder="Masukan nama lengkap anda"
              value={formData.nama}
              onChange={(e) => {
                updateField("nama", e.target.value);
              }}
              className={` ${errors.nama ? "border-red-500" : ""} `}
            />

            {errors.nama && <p className="text-red-500 text-[10px] pl-2 lg:absolute lg:translate-y-[3.8rem]">{errors.nama}</p>}
          </div>

          {/* Input Email dan Nomor WhatsApp */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex flex-col space-y-2 w-full md:w-1/2">
              <Label htmlFor="email" required>
                Email :
              </Label>
              <Input
                type="text"
                name="email"
                placeholder="youremail@gmail.com"
                value={formData.email}
                onChange={(e) => {
                  updateField("email", e.target.value);
                }}
                className={` ${errors.email ? "border-red-500" : ""} `}
              />

              {errors.email && <p className="text-red-500 text-[10px] pl-2 lg:absolute lg:translate-y-[3.8rem]">{errors.email}</p>}
            </div>

            <div className="flex flex-col space-y-2 w-full md:w-1/2">
              <Label htmlFor="nomor" required>
                Nomor WhatsApp :
              </Label>
              <Input
                type="number"
                name="nomor"
                min="11"
                placeholder="0857xxxxxx"
                value={formData.nomor}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 15) {
                    // Hanya angka, maksimal 15 karakter
                    updateField("nomor", value); // Lanjutkan hanya jika input valid
                  }
                }}
                className={` ${errors.nomor ? "border-red-500" : ""} `}
              />

              {errors.nomor && <p className="text-red-500 text-[10px] pl-2 lg:absolute lg:translate-y-[3.8rem]">{errors.nomor}</p>}
            </div>
          </div>

          {/* Select Gender dan Kesibukan */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="w-full flex flex-col space-y-2 md:w-1/2">
              <Label htmlFor="gender" required>
                Jenis Kelamin:
              </Label>

              <ul className=" lg:flex lg:flex-row lg:space-x-4 grid :grid-cols-auto-fit grid-cols-2 gap-4 lg:gap-0">
                {genderOptions.map((item) => (
                  <TabList
                    key={item.value}
                    label={item.label}
                    value={item.value}
                    onClick={() => {
                      handleTabClick("gender", item.value);
                      getEducations();
                    }}
                    isActive={formData.gender === item.value}
                    className={`w-full ${errors.gender ? "border-red-500" : ""} `}
                  />
                ))}
              </ul>

              {errors.gender && <p className="text-red-500 text-[10px] pl-2 lg:absolute lg:translate-y-[3.8rem]">{errors.gender}</p>}
            </div>

            <div className="flex flex-col space-y-2 md:w-1/2">
              <Label htmlFor="kesibukan" required>
                Kesibukan :
              </Label>
              <Select name="kesibukan" options={educationData} value={formData.kesibukan} onChange={
                (e) => {
                  updateField("kesibukan", e.target.value);
                  getBranchData(e.target.value);
                }
              } className={` ${errors.kesibukan ? "border-red-500" : ""} `} />

              {errors.kesibukan && <p className="text-red-500 text-[10px] pl-2 lg:absolute lg:translate-y-[3.8rem]">{errors.kesibukan}</p>}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0"></div>
        </div>

        {/* Submit Button */}
        <div className="">
          <div className="flex flex-col justify-center items-center ">
            <p className="text-gray-500 text-sm text-center pb-4">Pastikan anda telah mengisi data diri dengan baik & benar sebelum lanjut!</p>
            <Button type="submit" className="w-full lg:w-full">
              Yuk Lanjut!
            </Button>
          </div>
        </div>
      </form>
    </CustomLayout>
  );
}
