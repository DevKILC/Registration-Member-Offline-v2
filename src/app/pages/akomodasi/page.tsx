"use client";

import CustomLayout from "@/app/_components/layout";
import Select from "@/app/_components/_partials/select";
import Button from "@/app/_components/_partials/button";
import Label from "@/app/_components/_partials/label";
import  TabList  from "@/app/_components/_partials/tablist";
import { useAccomodationPageHook } from "@/app/hooks/useAccomodationPageHook";
import { useFormDataStore } from "@/app/hooks/useFormDataStore";
import { useAccomodationDataStore } from "@/app/hooks/useAccomodationDataStore";
import { useAccomodationDataHook } from "@/app/hooks/useAccomodationDataHook";
import { PassengerSelect } from "@/app/_backend/_utils/Interfaces";
import { changeTotalPaymentToIndonesianCurrency } from "@/app/_backend/_helper/changeTotalPaymentToIndonesianCurrency";
import { useResetFormHook } from "@/app/hooks/useResetFormHook";
import { useCourseDataStore } from "@/app/hooks/useCourseDataStore";

export default function ProgramPage() {

  const { formData, updateField } = useFormDataStore();
  const { locationData, pickupData, passengerData, setSelectedLocation, setSelectedPickup, setSelectedPassenger, selectedPassenger } = useAccomodationDataStore();
  const { errors, handleSubmit, router } = useAccomodationPageHook();
  const { getPickupData, getPassengerData } = useAccomodationDataHook();
  const { resetAccomodationPrice, resetPassenger, resetPickup } = useResetFormHook();
  const { selectedCourse } = useCourseDataStore();

  const locationChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const location = locationData.find((item) => item.value === e.target.value)?.pickupLocation;
    updateField("lokasijemput", e.target.value);
    getPickupData(e.target.value);
    setSelectedLocation(location || null);
  };

  const passengerChangeHandler = (data: PassengerSelect) => {
    updateField("penumpang", data.label);
    setSelectedPassenger(data.passenger);;
    updateField("pembayaranPenjemputan", data.passenger.price);
    if(data.value === selectedPassenger?.price) return;
    const coursePrice = selectedCourse?.price || 0;
    const gradePrice = formData.pembayaranGrade || 0;
    const passengerPrice = data.passenger.price || 0;
    console.log(coursePrice, gradePrice, passengerPrice);
    const total = Number(coursePrice) + Number(gradePrice) + Number(passengerPrice);
    updateField("pembayaran", total);
  };

  return (
    <CustomLayout mainline="Wah, dikit lagi nih! Langkah demi langkah menuju kesuksesan dimulai! 🚀" line="Ayo, kita taklukkan bahasa Inggris bareng-bareng! 💪 #DrivesYourSuccess #BoostYourEnglishWithLC">
      <form onSubmit={handleSubmit} className="mx-auto flex flex-col space-y-10 lg:space-y-[6.85rem]">
        <div className="flex flex-col space-y-4 min-h-[320px] h-full">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="lokasijemput">Pilih Lokasi Penjemputan :</Label>
            <Select
              name="lokasijemput"
              options={locationData}
              value={formData.lokasijemput}
              onChange={(e) => {
                locationChangeHandler(e);
                resetAccomodationPrice();
                resetPassenger();
                resetPickup();
              }}
            />
            {locationData.length === 0 && <p className="text-red-500 text-sm pl-2 border border-red-500 p-3 rounded-lg">Penjemputan belum tersedia untuk saat ini 🙏🏻</p>}
          </div>

          <div className={formData.lokasijemput === "tidak_perlu_dijemput" || formData.lokasijemput === "" ? "hidden" : "block"}>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <div className="w-full md:w-1/2 flex flex-col space-y-2">
                <Label htmlFor="kendaraan">Pilih Tipe Kendaraan :</Label>
                <div className="lg:overflow-y-auto scroll-hidden ">
                  <ul className="lg:flex lg:flex-row lg:space-x-4 grid :grid-cols-auto-fit grid-cols-2 gap-4 lg:gap-0">
                    {pickupData.length === 0 && <p className="text-red-500 text-sm pl-2 border border-red-500 p-3 rounded-lg">Kendaraan belum tersedia untuk saat ini 🙏🏻</p>}
                    {pickupData.map((item) => (
                      <TabList
                        key={item.value}
                        label={item.label}
                        value={item.value}
                        onClick={() => {
                          updateField("kendaraan", item.value);
                          setSelectedPickup(item.pickup || null);
                          getPassengerData(item.value);
                          resetAccomodationPrice();
                          resetPassenger();
                        }}
                        isActive={formData.kendaraan === item.value}
                        className={`w-full ${errors.kendaraan ? "border-red-500" : ""} `}
                      />
                    ))}
                  </ul>

                  {errors.kendaraan && <p className="text-red-500 text-[10px] pl-2 lg:absolute ">{errors.kendaraan}</p>}
                </div>
              </div>

              <div className="w-full md:w-1/2 flex flex-col space-y-2">
                <Label htmlFor="penumpang">Banyak Penumpang :</Label>
                <ul className="lg:flex lg:flex-row lg:space-x-4 grid :grid-cols-auto-fit grid-cols-5 gap-4 lg:gap-0">
                  {passengerData.length === 0 && <p className="text-red-500 text-sm pl-2 border border-red-500 p-3 rounded-lg">Jumlah penumpang belum tersedia untuk saat ini 🙏🏻</p>}
                  {passengerData.map((item) => (
                    <TabList
                      key={item.value}
                      label={item.label}
                      value={item.value}
                      onClick={() => passengerChangeHandler(item)}
                      isActive={formData.penumpang === item.label}
                      className={`w-full ${errors.penumpang ? "border-red-500" : ""} `}
                    />
                  ))}
                </ul>

                {errors.penumpang && <p className="text-red-500 text-[10px] pl-2 lg:absolute lg:translate-y-[3.8rem]">{errors.penumpang}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-center w-full space-y-4 lg:space-y-0">
            <div className={`w-full lg:pt-5 lg:w-1/4 ${formData.lokasijemput === "tidak_perlu_dijemput" ? "hidden" : "block"}`}>
              <div className="flex flex-col justify-center items-center ">
                <h2 className="text-center text-black font-semibold text-sm pb-2">Biaya Akomodasi :</h2>
                <h2 className="bg-bill text-center text-white py-2 px-6 rounded-[10px]">{changeTotalPaymentToIndonesianCurrency(formData.pembayaranPenjemputan)}</h2>
              </div>
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <div className="">
          <div className="flex flex-col justify-center items-center">
            <p className="text-gray-500 text-sm text-center pb-4">Biaya akomodasi akan di tambahkan dengan biaya program sebelumnya!</p>
            <div className="flex flex-row w-full gap-4">
              <Button type="button" className="w-full bg-white border-2 border-main-color" onClick={() => router.push("/pages/program")}>
                Kembali
              </Button>
              <Button type="submit" className="w-full">
                Yuk Lanjut!
              </Button>
            </div>
          </div>
        </div>
      </form>
    </CustomLayout>
  );
}
