import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useForm } from "@/app/_backend/_utils/Interfaces";

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
  biayaAdmin: 0,
  metode_pembayaran: "",
  feedback: "",
  rating: 0,
  tos: false,
  cs: "",
  cs_id: "",
};

interface FormStore {
  formData: useForm;
  errors: useForm;
  isPopupOpen: boolean;
  modalTosIsOpen: boolean;
  updateField: (field: string, value: string | number) => void;
  resetForm: () => void;
  handleTabClick: (field: string, value: string | number) => void;
  handleOptionTabClick: (value: string | number) => void;
  setIsPopupOpen: (value: boolean) => void;
  setTos: (value: boolean) => void;
  setModalTosIsOpen: (value: boolean) => void;
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
          formData: { ...state.formData, grade: String(value), jampertemuan: String(value) },
        })),
      isPopupOpen: true,
      setIsPopupOpen: (value: boolean) => set({ isPopupOpen: value }),
      setTos: (value: boolean) => set((state) => ({ formData: { ...state.formData, tos: value } })),
      modalTosIsOpen: false,
      setModalTosIsOpen: (value: boolean) => set({ modalTosIsOpen: value }),
      errors: initialFormData,
    }),
    {
      name: "form-data-storage", // nama key di localStorage
      storage: createJSONStorage(() => localStorage), // menggunakan localStorage

      // Optional: Pilih state mana yang ingin disimpan
      partialize: (state) => ({
        formData: state.formData,
        isPopupOpen: state.isPopupOpen
      }),
    }
  )
);