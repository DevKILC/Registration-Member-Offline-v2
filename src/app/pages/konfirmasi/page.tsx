"use client";
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
import { metodePembayaran } from "@/app/data/data";

export default function KonfirmasiPage() {

  const {
    formData,
    updateField,
    modalTosIsOpen,
    setModalTosIsOpen,
    setSelectedPaymentMethod,
    selectedPaymentMethod,
    courseDataIsValid,
    personalDataIsValid
  } = useFormDataStore();

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
    isSubmitting,

  } = useConfirmationPageHooks();

  const { selectedCourse } = useCourseDataStore();
  const { selectedPickup, selectedLocation } = useAccomodationDataStore();



  return (
    <CustomLayout mainline="Final Check! Pastikan Semua Datamu Benar! 🚀" line="Cek kembali data dan total pembayaranmu jangan sampai ada yang terlewat! 🤗">
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
                    <span className="text-gray-700">: {formData.nama ? (
                      <>
                        <span className=" md:hidden lg:hidden">
                          {formData.nama.length > 15 ? `${capitalizeFirstLetter(formData.nama.slice(0, 15))}...` : capitalizeFirstLetter(formData.nama)}
                        </span>
                        <span className="hidden md:inline lg:inline">
                          {capitalizeFirstLetter(formData.nama)}
                        </span>
                      </>
                    ) : "Belum diisi"}</span>
                  </div>
                  <div className="flex items-center text-[14px]">
                    <span className="w-24 text-gray-500">WhatsApp</span>
                    <span className="text-gray-700">: {formData.nomor || "Belum diisi"}</span>
                  </div>
                  <div className="flex items-center text-[14px]">
                    <span className="w-24 text-gray-500">Email</span>

                    <span className="text-gray-700">: {formData.email ? (
                      <>
                        <span className=" md:hidden lg:hidden">
                          {formData.email.length > 15 ? `${capitalizeFirstLetter(formData.email.slice(0, 15))}...` : capitalizeFirstLetter(formData.email)}
                        </span>
                        <span className="hidden md:inline lg:inline">
                          {capitalizeFirstLetter(formData.email)}
                        </span>
                      </>
                    ) : "Belum diisi"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-[14px]">
                    <span className="w-24 text-gray-500">Jenis Kelamin</span>
                    <span className="text-gray-700">: {capitalizeFirstLetter(formData.gender === "M" ? "Laki-laki" : "Perempuan") || "Belum diisi"}</span>
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
                  <span>Biaya {selectedCourse?.name || ""}</span>
                  <span>{changeTotalPaymentToIndonesianCurrency(formData.pembayaranCourse + formData.pembayaranGrade || 0)}</span>
                </div>
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
                {formData.diskonNominal > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Diskon</span>
                    <span>{changeTotalPaymentToIndonesianCurrency(formData.diskonNominal)}</span>
                  </div>
                )}
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
              <Input
                type="text"
                name="diskon"
                placeholder="Ketikan disini (jika ada)"
                value={formData.diskon || ""}
                onChange={(e) => updateField("diskon", e.target.value)}
                onBlur={(e) => handleVoucherChange(e)}
              />
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
              {selectedPaymentMethod.label || "Pilih Pembayaran"}
            </div>

            {errors.metode_pembayaran && <p className="text-red-500 text-[10px] pl-2 ">{errors.metode_pembayaran}</p>}
          </div>

          {/* Privacy Policy */}
          <div className="">
            <div className="flex flex-col gap-3 pb-4 items-center justify-center">
              <div className="flex items-center justify-between gap-4">
                <input type="checkbox" id="privacy" checked={formData.tos} onChange={handleTosConfirmation} className="mr-2" />
                <label htmlFor="privacy" className="text-sm text-black">
                  Dengan mencentang ini, kamu menyetujui{" "}
                  <a onClick={() => setModalTosIsOpen(true)} className="text-blue-600 hover:underline animate-pulse cursor-pointer">
                    Kebijakan Privasi & Syarat Ketentuan.
                  </a>{" "}
                  Pastikan sudah membaca sebelum lanjut ke proses pendaftaran!
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-row w-full gap-4">
              <Button
                type="button"
                className={`w-full bg-white border-2 text-black border-main-color ${!formData.tos ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!formData.tos}
                onClick={() => (formData.cabang !== "PARE" ? router.push("/pages/program") : router.push("/pages/akomodasi"))}
              >
                Kembali
              </Button>

              <Button
                disabled={isSubmitting || !formData.tos || !courseDataIsValid || !personalDataIsValid}
                type="submit"
                className="w-full transition-all duration-200 text-color disabled:bg-gray-300 disabled:cursor-not-allowed"
                id="submit_form"
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
            {metodePembayaran.map((item) => (
              <PaymentOption
                key={item.id}
                id={item.id.toString()}
                value={item.value}
                checked={formData.metode_pembayaran === item.value}
                icon={item.icon}
                label={item.label}
                onChange={(e) => {
                  updateField("metode_pembayaran", e.target.value);
                  setSelectedPaymentMethod(item);
                }}
                className={`${errors.metode_pembayaran ? "border-red-500" : ""}`}
              />
            ))}

            <PaymentOption
              key="other"
              id="other"
              value="infradigital"
              checked={formData.metode_pembayaran === "infradigital"}
              icon="https://www.pngplay.com/wp-content/uploads/7/Debit-Card-Icon-PNG-Clipart-Background.png"
              label="Metode Pembayaran Lain"
              onChange={(e) => {
                updateField("metode_pembayaran", e.target.value);
                setSelectedPaymentMethod({ id: 0, value: "infradigital", icon: "", label: "Metode Pembayaran Lain" });
              }}
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

