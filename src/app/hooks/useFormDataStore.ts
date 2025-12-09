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
  provinsi: "",
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
  bank_code: "",
  nationality: "",
  clid: null,
};

const initialPaymentMethod: PaymentMethod = {
  id: 0,
  value: "",
  icon: "",
  label: "",
};

interface formDataState {
  formData: useForm;
  errors: useForm;
  personalDataIsValid: boolean;
  courseDataIsValid: boolean;
  selectedPaymentMethod: PaymentMethod;
  isPopupOpen: boolean;
  modalTosIsOpen: boolean;
}

interface FormActions {
  updateField: (field: string, value: string | number) => void;
  updateClid: (id: string | number | null, source: string | number | null) => void;
  checkClidExists: (id: string | number | null, source: string | number | null) => void;
  resetForm: () => void;
  handleTabClick: (field: string, value: string | number) => void;
  handleOptionTabClick: (value: string | number) => void;
  setIsPopupOpen: (value: boolean) => void;
  setTos: (value: boolean) => void;
  setModalTosIsOpen: (value: boolean) => void;
  setSelectedPaymentMethod: (value: PaymentMethod) => void;
  setPersonalDataIsValid: (value: boolean) => void;
  setCourseDataIsValid: (value: boolean) => void;
  resetPaymentMethod: () => void;
}

export const useFormDataStore = create<formDataState & FormActions>()(
  persist(
    (set) => ({
      formData: initialFormData,

      updateField: (field: string, value: string | number) =>
        set((state) => ({
          formData: { ...state.formData, [field]: value }
        })),

      // Fungsi khusus untuk update clid dengan validasi
      updateClid: (id: string | number | null, source: string | number | null) =>
        set((state) => ({
          formData: {
            ...state.formData,
            clid: (!id && !source) ? null : { id: id, source: source }
          } as unknown as useForm
        })),

      // FIXED: Hanya update state jika benar-benar ada perubahan
      checkClidExists: (id: string | number | null, source: string | number | null) => {
        set((state) => {
          if (!id && !source) {
            if (state.formData.clid === null) {
              return state; 
            }
            return {
              formData: { ...state.formData, clid: null }
            };
          }
          return state; 
        });
      },

      resetForm: () => set({ formData: initialFormData }),

      handleTabClick: (field: string, value: string | number) =>
        set((state) => ({
          formData: { ...state.formData, [field]: value }
        })),

      handleOptionTabClick: (value: string | number) =>
        set((state) => ({
          formData: { ...state.formData, grade: String(value) },
        })),

      isPopupOpen: true,
      setIsPopupOpen: (value: boolean) => set({ isPopupOpen: value }),

      setTos: (value: boolean) =>
        set((state) => ({
          formData: { ...state.formData, tos: value }
        })),

      modalTosIsOpen: false,
      setModalTosIsOpen: (value: boolean) => set({ modalTosIsOpen: value }),

      errors: initialFormData,
      selectedPaymentMethod: initialPaymentMethod,
      setSelectedPaymentMethod: (value: PaymentMethod) =>
        set({ selectedPaymentMethod: value }),

      resetPaymentMethod: () => set({ selectedPaymentMethod: initialPaymentMethod }),

      personalDataIsValid: false,
      setCourseDataIsValid: (value: boolean) => set({ courseDataIsValid: value }),

      courseDataIsValid: false,
      setPersonalDataIsValid: (value: boolean) =>
        set({ personalDataIsValid: value }),
    }),
    {
      name: "form-data-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formData: state.formData,
        selectedPaymentMethod: state.selectedPaymentMethod,
        isPopupOpen: state.isPopupOpen,
        personalDataIsValid: state.personalDataIsValid,
        courseDataIsValid: state.courseDataIsValid,
      }),
    }
  )
);