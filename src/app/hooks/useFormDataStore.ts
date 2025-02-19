import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useForm, PaymentMethod } from "@/app/_backend/_utils/Interfaces";

const initialFormData: useForm = {
  nama: "",
  email: "",
  nomor: "",
  gender: "",
  kesibukan: "",
  paket: "",
  kategoriPaket: "",
  duration: "",
  grade: "",
  isGrade: 0,
  cabang: "",
  periode: "",
  lokasijemput: "",
  kendaraan: "",
  penumpang: "",
  diskon: "",
  diskonPersen: 0,
  diskonNominal: 0,
  pembayaran: 0,
  pembayaranCourse: 0,
  pembayaranGrade: 0,
  pembayaranPenjemputan: 0,
  is_additional_meet_hour: 0,
  meet_hour: "",
  biayaAdmin: 0,
  metode_pembayaran: "",
  feedback: "",
  rating: 0,
  tos: false,
  cs: "",
  cs_id: "",
};

const initialPaymentMethod: PaymentMethod = {
  id: 0,
  value: "",
  icon: "",
  label: "",
};

interface FormStore {
  formData: useForm;
  errors: useForm;
  selectedPaymentMethod: PaymentMethod;
  isPopupOpen: boolean;
  modalTosIsOpen: boolean;
  updateField: (field: string, value: string | number) => void;
  resetForm: () => void;
  handleTabClick: (field: string, value: string | number) => void;
  handleOptionTabClick: (value: string | number) => void;
  setIsPopupOpen: (value: boolean) => void;
  setTos: (value: boolean) => void;
  setModalTosIsOpen: (value: boolean) => void;
  setSelectedPaymentMethod: (value: PaymentMethod) => void;
}

export const useFormDataStore = create<FormStore>()(
  persist(
    (set) => ({
      formData: initialFormData,
      updateField: (field: string, value: string | number) => set((state) => ({ formData: { ...state.formData, [field]: value } })),
      resetForm: () => set({ formData: initialFormData }),
      handleTabClick: (field: string, value: string | number) => set((state) => ({ formData: { ...state.formData, [field]: value } })),
      handleOptionTabClick: (value: string | number) =>
        set((state) => ({
          formData: { ...state.formData, grade: String(value)},
        })),
      isPopupOpen: true,
      setIsPopupOpen: (value: boolean) => set({ isPopupOpen: value }),
      setTos: (value: boolean) => set((state) => ({ formData: { ...state.formData, tos: value } })),
      modalTosIsOpen: false,
      setModalTosIsOpen: (value: boolean) => set({ modalTosIsOpen: value }),
      errors: initialFormData,
      selectedPaymentMethod: initialPaymentMethod,
      setSelectedPaymentMethod: (value: PaymentMethod) => set({ selectedPaymentMethod: value }),
    }),
    {
      name: "form-data-storage", // nama key di localStorage
      storage: createJSONStorage(() => localStorage), // menggunakan localStorage

      // Optional: Pilih state mana yang ingin disimpan
      partialize: (state) => ({
        formData: state.formData,
        selectedPatmentMethod: state.selectedPaymentMethod,
        isPopupOpen: state.isPopupOpen
      }),
    }
  )
);