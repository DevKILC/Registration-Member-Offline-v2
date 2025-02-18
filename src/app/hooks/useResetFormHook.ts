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
    updateField('kendaraan', '');
  }

  const resetPeriode = () => {
    updateField('periode', '');
  }

  const resetLokasiPenjemputan = () => {
    updateField('lokasijemput', '');
  }

  const resetKendaraanPenjemputan = () => {
    updateField('kendaraan', '');
  }

  const resetPenumpangPenjemputan = () => {
    updateField('penumpang', '');
  }

  const resetPembayaranPenjemputan = () => {
    updateField('pembayaranPenjemputan', '');
  };

  const resetPembayaranPaket = () => {
    updateField('pembayaranCourse', '');
  };

  return {
    resetCategoryCourse,
    resetSelectedCourse,
    resetSelectedDuration,
    resetSelectedGrade,
    resetTotalPrice,
    resetAccomodationPrice,
    resetPassenger,
    resetPickup,
    resetPeriode,
    resetLokasiPenjemputan,
    resetKendaraanPenjemputan,
    resetPenumpangPenjemputan,
    resetPembayaranPenjemputan,
    resetPembayaranPaket,
  };
};
