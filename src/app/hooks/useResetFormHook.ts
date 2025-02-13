import { useFormDataStore } from "./useFormDataStore";

export const useResetFormHook = () => {

  const { updateField } = useFormDataStore();

  const resetCategoryCourse = () => {
    updateField('kategoriPaket', '');
  };

  const resetSelectedCourse = () => {
    updateField('paket', '');
  }

  const resetSelectedDuration = () => {
    updateField('duration', '');
  }

  const resetSelectedGrade = () => {
    updateField('grade', '');
  }

  const resetTotalPrice = () => {
    updateField('pembayaran', 0);
  }

  const resetAccomodationPrice = () => {
    updateField('pembayaranPenjemputan', 0);
  }

  const resetPassenger = () => {
    updateField('penumpang', '');
  }

  const resetPickup = () => {
    updateField("kendaraan", "");
  }

  return {
    resetCategoryCourse,
    resetSelectedCourse,
    resetSelectedDuration,
    resetSelectedGrade,
    resetTotalPrice,
    resetAccomodationPrice,
    resetPassenger,
    resetPickup
  };
};
