"use client";
import { useEffect } from "react";
import CustomLayout from "@/app/_components/layout";
import Button from "@/app/_components/_partials/button";
import Label from "@/app/_components/_partials/label";
import Input from "@/app/_components/_partials/input";
import PaymentOption from "@/app/_components/_partials/paymentOption";
import BottomSheet from "@/app/_components/_partials/sheet";
import Modal from "@/app/_components/_partials/modal";
import PrivacyPolicy from "@/app/_components/_partials/privacyPolicy";
import { useConfirmationPageHooks } from "@/app/hooks/useConfirmationPageHook";
import { useFormDataStore } from "@/app/hooks/useFormDataStore";
import { changeTotalPaymentToIndonesianCurrency } from "@/app/_backend/_helper/changeTotalPaymentToIndonesianCurrency";
import { useCourseDataStore } from "@/app/hooks/useCourseDataStore";
import { useAccomodationDataStore } from "@/app/hooks/useAccomodationDataStore";
import { useGradeDataStore } from "@/app/hooks/useGradeDataStore";

export default function KonfirmasiPage() {

  const { formData, updateField, modalTosIsOpen, setModalTosIsOpen } = useFormDataStore();

  const { 
    handleTosConfirmation, 
    akomodasi, 
    errors, 
    isOpen, 
    setIsOpen, 
    router, 
    handleSubmit, 
    capitalizeFirstLetter, 
    handleVoucherChange, 
    calculateVoucher,
    isSubmitting
  } = useConfirmationPageHooks();

  const { selectedCourse } = useCourseDataStore();
  const { selectedPickup, selectedLocation } = useAccomodationDataStore();
  const { selectedGrade } = useGradeDataStore();

  useEffect(() => {
    // Pastikan semua nilai tersedia sebelum menghitung
    if (selectedCourse && formData) {
      const courseFee = selectedCourse.price || formData.pembayaranCourse || 0;
      const pickupFee = formData.pembayaranPenjemputan || 0;
      const adminFee = Number(process.env.NEXT_PUBLIC_ADMIN_FEE) || 0;

      // Update pembayaran course jika belum ada
      if (formData.pembayaranCourse !== courseFee) {
        updateField("pembayaranCourse", courseFee);
      }

      // Update pembayaran penjemputan jika belum ada
      if (formData.pembayaranPenjemputan !== pickupFee) {
        updateField("pembayaranPenjemputan", pickupFee);
      }

      // Update total pembayaran
      const totalPayment = courseFee + pickupFee + adminFee;
      updateField("pembayaran", totalPayment);

      if(formData.diskonNominal > 0){
        calculateVoucher(formData.diskonNominal);
      }

      if(formData.diskonNominal === 0){
        calculateVoucher(0);
      }
    }
  }, [selectedCourse, selectedPickup, formData.pembayaranCourse, formData.pembayaranPenjemputan]);

  const metode_pembayaran = [
    {
      id: "1",
      value: "bsm",
      checked: formData.metode_pembayaran === "bsm",
      icon: "https://idn-static-assets.s3-ap-southeast-1.amazonaws.com/website/img/merchant_logos/idn_bsi.png",
      label: "Bank Syariah Indonesia",
    },
    {
      id: "2",
      value: "prismalink_bca",
      checked: formData.metode_pembayaran === "prismalink_bca",
      icon: "https://idn-static-assets.s3-ap-southeast-1.amazonaws.com/emailblast/assets/merchant/img_logo_merchant_bca.png",
      label: "Bank BCA",
    },
    {
      id: "3",
      value: "prismalink_mandiri",
      checked: formData.metode_pembayaran === "prismalink_mandiri",
      icon: "https://idn-static-assets.s3-ap-southeast-1.amazonaws.com/emailblast/assets/merchant/img_logo_merchant_mandiri.png",
      label: "Bank Mandiri",
    },
    {
      id: "4",
      value: "BNI",
      checked: formData.metode_pembayaran === "BNI",
      icon: "https://idn-static-assets.s3-ap-southeast-1.amazonaws.com/emailblast/assets/merchant/img_logo_merchant_bni.png",
      label: "BNI",
    },
    {
      id: "5",
      value: "BRI",
      checked: formData.metode_pembayaran === "BRI",
      icon: "https://idn-static-assets.s3-ap-southeast-1.amazonaws.com/emailblast/assets/merchant/img_logo_merchant_bri.png",
      label: "BRI",
    },
  ];

  return (
    <CustomLayout mainline="Tinggal selangkah lagi menuju kesuksesan! 🚀" line="Konfirmasi dulu biar gak ada kekeliruan nanti {'<3'} ! 😍 #InggrisItuSeru #BelajarSeruDiLC">
      <form onSubmit={handleSubmit} className={`w-full flex flex-col space-y-10 ${akomodasi ? "lg:space-y-3" : "lg:space-y-6"}`}>
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
                    <span className="text-gray-700">: {capitalizeFirstLetter(formData.gender === "F" ? "laki-laki" : "perempuan") || "Belum diisi"}</span>
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
                    Biaya {selectedCourse?.name || ""} {selectedCourse?.duration_name || ""}
                  </span>
                  <span>
                    {formData.diskonNominal === 0 && <>{changeTotalPaymentToIndonesianCurrency(formData.pembayaranCourse || 0)}</>}
                    {formData.diskonNominal > 0 && (
                      <>
                        <span className="line-through text-gray-400">{changeTotalPaymentToIndonesianCurrency(formData.pembayaranCourse || 0)}</span>
                        <span className="text-red-500">{changeTotalPaymentToIndonesianCurrency(formData.pembayaranCourse - formData.diskonNominal || 0)}</span>
                      </>
                    )}
                  </span>
                </div>
                {selectedGrade ? (
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Biaya Fasilitas Kamar {selectedGrade?.name}
                    </span>
                    <span>{changeTotalPaymentToIndonesianCurrency(formData.pembayaranGrade || 0)}</span>
                  </div>
                ) : (
                  []
                )}
                {formData.pembayaranPenjemputan ? (
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Biaya Penjemputan {selectedPickup?.pickup_name} Ke {selectedLocation?.location_name}
                    </span>
                    <span>{changeTotalPaymentToIndonesianCurrency(formData.pembayaranPenjemputan || 0)}</span>
                  </div>
                ) : (
                  []
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Biaya Admin</span>
                  <span>{changeTotalPaymentToIndonesianCurrency(Number(process.env.NEXT_PUBLIC_ADMIN_FEE))}</span>
                </div>
                <div className="my-2 border-b border-gray-300"></div>
                <div className="flex justify-between text-black text-[15px] font-bold">
                  <span>Total Pembayaran</span>
                  <span className="px-2 py-1">{changeTotalPaymentToIndonesianCurrency(formData.pembayaran)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between w-full space-y-4 lg:space-y-0">
            <div className="flex flex-col space-y-2 w-full lg:w-1/2">
              <Label htmlFor="diskon" className="font-bold">
                Kode Voucher :
              </Label>
              <Input type="text" name="diskon" placeholder="Ketikan disini (jika ada)" value={formData.diskon || ""} onChange={(e) => handleVoucherChange(e)} />
            </div>

            <div className={`w-full lg:pt-0 lg:w-1/4 `}>
              <div className="flex flex-col justify-center items-center ">
                <h2 className="text-center text-black font-semibold text-sm pb-2">Total Biaya :</h2>
                <h2 className="bg-bill text-center text-white py-2 px-6 rounded-[10px]">{changeTotalPaymentToIndonesianCurrency(formData.pembayaran)}</h2>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3 ">
            <Label htmlFor="pembayaran" className="font-bold" required>
              Metode Pembayaran :
            </Label>

            <div onClick={() => setIsOpen(true)} className={`cursor-pointer border border-gray-400 w-full p-2 rounded-[10px] text-black ${errors.metode_pembayaran ? "border-red-500" : ""}`}>
              {formData.metode_pembayaran || "Pilih Pembayaran"}
            </div>

            {errors.metode_pembayaran && <p className="text-red-500 text-[10px] pl-2 ">{errors.metode_pembayaran}</p>}
          </div>

          {/* Privacy Policy */}
          <div className="">
            <div className="flex flex-col space-x-2 pb-4 gap-3">
              <span className="text-center">
                <a onClick={() => setModalTosIsOpen(true)} className="text-blue-600 hover:underline animate-pulse cursor-pointer underline">
                  Kebijakan Privasi dan Syarat & Ketentuan
                </a>
              </span>{" "}
              <div className="flex items-center justify-between gap-4 flex-row">
                <input type="checkbox" id="privacy" checked={formData.tos} onChange={handleTosConfirmation} />
                <label htmlFor="privacy" className="text-sm text-red-600 ">
                  Anda wajib membaca dan menyetujui Kebijakan Privasi dan Syarat & Ketentuan di bawah ini sebelum menekan tombol proses pendaftaran!
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-row w-full gap-4">
              <Button type="button" className="w-full bg-white border-2 border-main-color" onClick={() => (formData.cabang !== "PARE" ? router.push("/pages/program") : router.push("/pages/akomodasi"))}>
                Kembali
              </Button>

              <Button disabled={isSubmitting || !formData.tos} type="submit" className="w-full transition-all duration-200 text-white  disabled:bg-gray-300 disabled:cursor-not-allowed">
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
            {metode_pembayaran.map((item) => (
              <PaymentOption
                key={item.id}
                id={item.id}
                value={item.value}
                checked={item.checked}
                icon={item.icon}
                label={item.label}
                onChange={(e) => updateField("metode_pembayaran", e.target.value)}
                className={`${errors.metode_pembayaran ? "border-red-500" : ""}`}
              />
            ))}

            <PaymentOption
              key="other"
              id="other"
              value="Pembayaran Lain"
              checked={formData.metode_pembayaran === "Pembayaran Lain"}
              icon="https://www.pngplay.com/wp-content/uploads/7/Debit-Card-Icon-PNG-Clipart-Background.png"
              label="Metode Pembayaran Lain"
              onChange={(e) => updateField("metode_pembayaran", e.target.value)}
              className={` ${errors.metode_pembayaran ? "border-red-500" : ""}`}
            />
          </div>

          {/* Fixed Button at the Bottom */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200">
            <button
              type="button"
              className="w-full bg-main-color text-black py-2 rounded-lg"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Pilih
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Modal */}
      <Modal isOpen={modalTosIsOpen} onClose={() => setModalTosIsOpen(false)} title="Kebijakan Privasi dan Syarat & Ketentuan">
        <PrivacyPolicy />
      </Modal>
    </CustomLayout>
  );
}

