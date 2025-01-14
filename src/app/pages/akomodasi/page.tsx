"use client";

import CustomLayout from "@/app/_components/layout";
import Select from "@/app/_components/_partials/select";
import Button from "@/app/_components/_partials/button";
import Label from "@/app/_components/_partials/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import  TabList  from "@/app/_components/_partials/tablist";
import { validateFormDataAkomodasi } from "@/app/_backend/_utils/validationAlert";
import { toast } from "react-toastify";
import { akomodasiSchema } from "@/app/_backend/_utils/validationZod";
import { defaultFormData } from "@/app/_backend/_utils/formData";

export default function ProgramPage() {
  const router = useRouter();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

   // State untuk menyimpan data form
   const [formData, setFormData] = useState(defaultFormData);

  // Ambil data dari sessionStorage jika ada
  useEffect(() => {
    const savedData = sessionStorage.getItem("formData");
    if (savedData) setFormData(JSON.parse(savedData));
  }, []);

   // Handle submit form
   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

       const result = akomodasiSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: { [key: string]: string } = {};
          result.error.errors.forEach((err) => {
            fieldErrors[err.path[0]] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({});
          console.log("Validasi Berhasil:", formData);
        }

    // Simpan data di sessionStorage
    sessionStorage.setItem("formData", JSON.stringify(formData));

     const { isValid, missingFields } = validateFormDataAkomodasi(formData);
    
        if (isValid) {
         router.push("/pages/konfirmasi")
        } else {  
          const missingLabels = missingFields.map((item) => item.label);
              toast.error(
                "Mohon lengkapi data berikut: " + missingLabels.join(", ")
              );
       }
     };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  
    // Update state secara asinkron dan sinkronkan dengan sessionStorage
    setFormData((oldFormData) => {
      const updatedFormData = { ...oldFormData, [name]: value };
      sessionStorage.setItem("formData", JSON.stringify(updatedFormData));
      return updatedFormData;
    });
  };



  const handleTabClick = (value: string | number) => {
    setErrors((prevErrors) => ({ ...prevErrors, kendaraan : "" }));
    const updatedFormData = { ...formData, kendaraan : String(value) };
    setFormData(updatedFormData);
    sessionStorage.setItem("formData", JSON.stringify(updatedFormData));
  };


 

  // Options untuk dropdown
  const lokasiJemputOptions = [
    { value: "ga_perlu_dijemput", label: "Ga Perlu Dijemput" },
    { value: "bandara_dhoho_kediri", label: "Bandara Dhoho Kediri" },
    { value: "bandara_juanda_surabaya", label: "Bandara Juanda Surabaya" },
    { value: "stasiun_jombang", label: "Stasiun Jombang" },
  ];

  const kendaraanOptions = [
    { value: "mobil", label: "Mobil" },
    { value: "motor", label: "Motor" },
  ];

  const penumpangOptions = [
    { value: "1", label: "1 Penumpang" },
    { value: "2", label: "2 Penumpang" },
    { value: "3", label: "3 Penumpang" },
  ];

  return (
    <CustomLayout
      mainline="Wah, dikit lagi nih! Langkah demi langkah menuju kesuksesan dimulai! 🚀"
      line="Ayo, kita taklukkan bahasa Inggris bareng-bareng! 💪 #DrivesYourSuccess #BoostYourEnglishWithLC"
    >
       <form onSubmit={handleSubmit} className="mx-auto flex flex-col space-y-10 lg:space-y-[6.85rem]">
       <div className="flex flex-col space-y-4 min-h-[320px] h-full">

        <div className="flex flex-col space-y-2">
          <Label htmlFor="lokasijemput">Pilih Penjemputan :</Label>
          <Select
            name="lokasijemput"
            options={lokasiJemputOptions}
            value={formData.lokasijemput}
            onChange={handleChange}
          
          />
        </div>

       <div className={formData.lokasijemput === "ga_perlu_dijemput" || formData.lokasijemput === "" ? "hidden" : "block" }>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">

          <div className="w-full md:w-1/2 flex flex-col space-y-2">
            <Label htmlFor="kendaraan">Pilih Tipe Kendaraan :</Label>
            <div className="lg:overflow-y-auto scroll-hidden ">

                <ul className="lg:flex lg:flex-row lg:space-x-4 grid :grid-cols-auto-fit grid-cols-2 gap-4 lg:gap-0">

                  {kendaraanOptions.map((item) => (
                    <TabList 
                      key={item.value}
                      label={item.label}
                      value={item.value}
                      onClick={handleTabClick}
                      isActive={formData.kendaraan === item.value}
                      className={ `w-full ${errors.kendaraan ? 'border-red-500' : ''} `}
                      />
                    ))}
                  </ul>
    
                  {errors.kendaraan && <p className="text-red-500 text-[10px] pl-2 lg:absolute ">{errors.kendaraan}</p>}
    
    
                </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col space-y-2">
            <Label htmlFor="penumpang">Banyak Penumpang :</Label>
            <Select
              name="penumpang"
              options={penumpangOptions}
              value={formData.penumpang || ""}
              onChange={handleChange}
              className={` ${errors.penumpang ? 'border-red-500' : ''} `}
              />

              {errors.penumpang && <p className="text-red-500 text-[10px] pl-2 lg:absolute lg:translate-y-[3.8rem]">{errors.penumpang}</p>}

            </div>
        </div>
      </div>

        <div className="flex flex-col lg:flex-row justify-center w-full space-y-4 lg:space-y-0">
  
          <div className={`w-full lg:pt-5 lg:w-1/4 ${formData.lokasijemput === "ga_perlu_dijemput" ? "hidden" : "block"}`}>
               <div className="flex flex-col justify-center items-center ">
                <h2 className="text-center text-black font-semibold text-sm pb-2">Biaya Akomodasi :</h2>
                <h2 className="bg-bill text-center text-white py-2 px-6 rounded-[10px]">Rp 900.000</h2>
              </div>
          </div>
        </div>

  </div>
        {/* Submit Button */}
        <div className="">
        <div className="flex flex-col justify-center items-center">
          <p className="text-gray-500 text-sm text-center pb-4">
            Biaya akomodasi akan di tambahkan dengan biaya program sebelumnya!
          </p>
           <div className="flex flex-row w-full gap-4">
                      <Button type="button" className="w-full bg-white border-2 border-main-color" onClick={() => router.push("/pages/program")}>Kembali</Button>
                      <Button type="submit" className="w-full">Yuk Lanjut!</Button>
                    </div>
        </div>
        </div>
      </form>
    </CustomLayout>
  );
}
