"use client";

import CustomLayout from "@/app/_components/layout";
import { useEffect, useState } from "react";
import Button from "@/app/_components/_partials/button";
import { useRouter } from "next/navigation";
// import Select from "@/app/_components/_partials/select";
import { toast } from "react-toastify";
import { validateFormDataKonfirmasi } from "@/app/_backend/_utils/validationAlert";
import Label from "@/app/_components/_partials/label";
import Input from "@/app/_components/_partials/input";
import PaymentOption from "@/app/_components/_partials/paymentOption";
import { konfirmasiSchema } from "@/app/_backend/_utils/validationZod";
import { defaultFormData } from "@/app/_backend/_utils/formData";
import BottomSheet from "@/app/_components/_partials/sheet";
import Modal from "@/app/_components/_partials/modal";
import PrivacyPolicy from "@/app/_components/_partials/privacyPolicy";

export default function KonfirmasiPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(defaultFormData)
  const [accepted, setAccepted] = useState(false);
  const [akomodasi, setAkomodasi] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);



  useEffect(() => {
    const savedData = sessionStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);

      const isAkomodasi = Boolean(
        parsedData.cabang === "PARE - JATIM" &&
        parsedData.lokasijemput !== "ga_perlu_dijemput" &&
        parsedData.kendaraan &&
        parsedData.penumpang
      );

      setAkomodasi(isAkomodasi);
    }
  }, []);

  // Handle submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = konfirmasiSchema.safeParse(formData);
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

    // Redirect ke halaman thankyou
    const { isValid, missingFields } = validateFormDataKonfirmasi(formData);

    if (isValid) {
      router.push("/pages/thankyou")
    } else {
      const missingLabels = missingFields.map((item) => item.label);
      toast.error(
        "Mohon lengkapi data berikut: " + missingLabels.join(", ")
      );
    }
  };


  function capitalizeFirstLetter(val: string | number | undefined) {
    if (val === null || val === undefined) return val; // Return the value as is if it's null or undefined
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

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

  const handlePayment = (e: React.ChangeEvent<HTMLInputElement>) => {

    setErrors((prevErrors) => ({ ...prevErrors, pembayaran: "" }));

    const updatedFormData = { ...formData, pembayaran: e.target.value };
    setFormData(updatedFormData);
    sessionStorage.setItem("formData", JSON.stringify(updatedFormData));
  };

  const pembayaran = [
    {
      id: "bsm",
      value: "Bank Syariah Indonesia",
      checked: formData.pembayaran === "Bank Syariah Indonesia",
      icon: "https://idn-static-assets.s3-ap-southeast-1.amazonaws.com/website/img/merchant_logos/idn_bsi.png",
      label: "Bank Syariah Indonesia",
    },
    {
      id: "prismalink_bca",
      value: "Bank BCA",
      checked: formData.pembayaran === "Bank BCA",
      icon: "https://idn-static-assets.s3-ap-southeast-1.amazonaws.com/emailblast/assets/merchant/img_logo_merchant_bca.png",
      label: "Bank BCA",
    },
    {
      id: "jatelindo",
      value: "Bank Mandiri",
      checked: formData.pembayaran === "Bank Mandiri",
      icon: "https://idn-static-assets.s3-ap-southeast-1.amazonaws.com/emailblast/assets/merchant/img_logo_merchant_mandiri.png",
      label: "Bank Mandiri",
    },
    {
      id: "bni",
      value: "BNI",
      checked: formData.pembayaran === "BNI",
      icon: "https://idn-static-assets.s3-ap-southeast-1.amazonaws.com/emailblast/assets/merchant/img_logo_merchant_bni.png",
      label: "BNI",
    },
    {
      id: "bri",
      value: "BRI",
      checked: formData.pembayaran === "BRI",
      icon: "https://idn-static-assets.s3-ap-southeast-1.amazonaws.com/emailblast/assets/merchant/img_logo_merchant_bri.png",
      label: "BRI",
    },
  ];



  return (
    <CustomLayout
      mainline="Tinggal selangkah lagi menuju kesuksesan! 🚀"
      line="Konfirmasi dulu biar gak ada kekeliruan nanti {'<3'} ! 😍 #InggrisItuSeru #BelajarSeruDiLC"
    >

      <form onSubmit={handleSubmit} className={`w-full flex flex-col space-y-10 ${akomodasi ? 'lg:space-y-3' : 'lg:space-y-6'}`} >
        <div className={`mx-auto lg:h-[68vh] w-full overflow-x-auto scroll-hidden flex flex-col space-y-6`}>
          {/* Main Content */}

          <div className="w-full mx-auto rounded-3xl lg:border lg:border-gray-400 bg-white p-2 lg:py-3 lg:px-6 h-auto">
            <h2 className="mb-4 text-center text-black text-xl font-bold">Ringkasan Pembayaran</h2>
            {/* Data Diri */}
            <div className="lg:mb-3 mb-6">
              <h3 className="mb-3 text-[16px] font-semibold text-gray-700">Data Diri</h3>
              <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2 lg:gap-x-8">
                <div className="space-y-2">
                  <div className="flex items-center text-[14px]">
                    <span className="w-24 text-gray-500">Nama</span>
                    <span className="text-gray-700">: {capitalizeFirstLetter(formData.nama) || "Belum diisi"}</span>
                  </div>
                  <div className="flex items-center text-[14px]">
                    <span className="w-24 text-gray-500">WhatsApp</span>
                    <span className="text-gray-700">: {formData.nomor || "Belum diisi"}</span>
                  </div>
                  <div className="flex items-center text-[14px]">
                    <span className="w-24 text-gray-500">Email</span>
                    <span className="text-gray-700">: {formData.email || "Belum diisi"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-[14px]">
                    <span className="w-24 text-gray-500">Jenis Kelamin</span>
                    <span className="text-gray-700">: {capitalizeFirstLetter(formData.gender) || "Belum diisi"}</span>
                  </div>
                  <div className="flex items-center text-[14px]">
                    <span className="w-24 text-gray-500">Kesibukan</span>
                    <span className="text-gray-700">: {capitalizeFirstLetter(formData.kesibukan) || "Belum diisi"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Pembayaran */}
            <div>
              <h3 className="mb-3 text-[16px] font-semibold text-gray-700">Detail Pembayaran</h3>
              <div className="space-y-3 text-[14px]">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Paket {formData.paket?.label || ''} {formData.paketdetail?.label || ''}
                  </span>
                  <span>Rp. 9.000.000</span>
                </div>
                {
                  akomodasi ? (
                    <div className="flex justify-between text-gray-600">
                      <span>Biaya Tambahan</span>
                      <span>Rp. 900.000</span>
                    </div>
                  ) : []
                }
                <div className="flex justify-between text-gray-600">
                  <span>Biaya Admin</span>
                  <span>Rp. 60.000</span>
                </div>
                <div className="my-2 border-b border-gray-300"></div>
                <div className="flex justify-between text-black text-[15px] font-bold">
                  <span>Total Pembayaran</span>
                  <span className="px-2 py-1">Rp. 9.960.000</span>
                </div>
              </div>
            </div>

          </div>

          <div className="flex flex-col lg:flex-row justify-between w-full space-y-4 lg:space-y-0">
            <div className="flex flex-col space-y-2 w-full lg:w-1/2">
              <Label htmlFor="diskon" className="font-bold">Kode Voucher :</Label>
              <Input
                type="text"
                name="diskon"
                placeholder="Ketikan disini (jika ada)"
                value={formData.diskon || ""}
                onChange={handleChange}
              />
            </div>

            <div className={`w-full lg:pt-0 lg:w-1/4 `}>
              <div className="flex flex-col justify-center items-center ">
                <h2 className="text-center text-black font-semibold text-sm pb-2">Total Biaya :</h2>
                <h2 className="bg-bill text-center text-white py-2 px-6 rounded-[10px]">Rp 9.960.000</h2>
              </div>
            </div>
          </div>


          <div className="flex flex-col space-y-3 ">
            <Label htmlFor="pembayaran" className="font-bold" required>Metode Pembayaran :</Label>

            <div
              onClick={() => setIsOpen(true)}
              className={`cursor-pointer border border-gray-400 w-full p-2 rounded-[10px] text-black ${errors.pembayaran ? "border-red-500" : ""}`}
            >
              {formData.pembayaran || "Pilih Pembayaran"}
            </div>

            {errors.pembayaran && <p className="text-red-500 text-[10px] pl-2 ">{errors.pembayaran}</p>}

          </div>
     
        {/* Privacy Policy */}
        <div className="">
          <div className="flex items-center justify-center space-x-2 pb-4">
            <input
              type="checkbox"
              id="privacy"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <label htmlFor="privacy" className="text-sm text-gray-500 ">
              Dengan melanjutkan, saya menyetujui{" "}
              <span>
                <a onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:underline">
                 Kebijakan Privasi dan Syarat & Ketentuan 
              </a>
              </span>{" "}
              yang berlaku
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex flex-row w-full gap-4">
            <Button type="button" className="w-full bg-white border-2 border-main-color" onClick={() => formData.cabang !== "PARE - JATIM" ? router.push("/pages/program") : router.push("/pages/akomodasi")}>Kembali</Button>

            <Button
              disabled={!accepted}
              type="submit"
              className="w-full transition-all duration-200 text-white  disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Konfirmasi
            </Button>

          </div>
        </div>
        </div>
      </form>

      <BottomSheet

        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Pilih Metode Pembayaran"
        initialHeight="80%" // Custom height
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-4 mb-12">
            {/* Payment Options */}
            {pembayaran.map((item) => (
              <PaymentOption
                key={item.id}
                id={item.id}
                value={item.value}
                checked={item.checked}
                icon={item.icon}
                label={item.label}
                onChange={handlePayment}
                className={`${errors.pembayaran ? "border-red-500" : ""}`}
              />
            ))}

            <PaymentOption
              key="other"
              id="other"
              value="Pembayaran Lain"
              checked={formData.pembayaran === "Pembayaran Lain"}
              icon="https://www.pngplay.com/wp-content/uploads/7/Debit-Card-Icon-PNG-Clipart-Background.png"
              label="Metode Pembayaran Lain"
              onChange={handlePayment}
              className={` ${errors.pembayaran ? "border-red-500" : ""}`}
            />
          </div>

          {/* Fixed Button at the Bottom */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200">
            <button
              type="button"
              className="w-full bg-main-color text-black py-2 rounded-lg"
              onClick={() => {
                setIsOpen(false);
                const syntheticEvent = {
                  target: Object.assign(document.createElement("input"), {
                    value: formData.pembayaran,
                  }),
                } as React.ChangeEvent<HTMLInputElement>;
                handlePayment(syntheticEvent);
              }}
            >
              Pilih
            </button>
          </div>
        </div>

      </BottomSheet>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Kebijakan Privasi dan Syarat & Ketentuan"
      >

        <PrivacyPolicy />
  

      </Modal>

    </CustomLayout>
  );
}

