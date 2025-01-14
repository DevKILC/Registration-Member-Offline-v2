import { FormData } from "./Interfaces";

export const validateFormData = (formData: FormData) => {
  const requiredFields = [
    { field: "nama", label: "Nama Lengkap" },
    { field: "email", label: "Email" },
    { field: "nomor", label: "Nomor WhatsApp" },
    { field: "gender", label: "Jenis Kelamin" },
    { field: "kesibukan", label: "Kesibukan" },
  ];

  const missingFields = requiredFields.filter(
    (item) => !formData[item.field as keyof typeof formData]
  );

  const namaValue = String(formData.nama || '');
  const nomorValue = String(formData.nomor || '');

  // Jika Field Kosong Semua maka return Isi Formulir
  if (missingFields.length === 5) {
    return {
      isValid: false,
      missingFields: [{ field: "all", label: "Isi Formulir" }],
    };
  }

  if (nomorValue.length < 10 || nomorValue.length > 15) {
    return {
      isValid: false,
      missingFields: [{ field: "nomor", label: "Nomor WhatsApp harus antara 10-15 digit" }],
    };
  }

  if (namaValue && !/^[a-zA-Z\s.,]+$/.test(namaValue)) {
    return {
      isValid: false,
      missingFields: [{ field: "nama", label: "Nama Lengkap hanya boleh mengandung huruf, titik, dan koma" }],
    };
  }

  if (namaValue && namaValue.startsWith(' ')) {
    return {
      isValid: false,
      missingFields: [{ field: "nama", label: "Nama Lengkap tidak boleh diawali dengan spasi" }],
    };
  }

  const emailValue = String(formData.email || '');
  if (emailValue && emailValue.startsWith(' ')) {
    return {
      isValid: false,
      missingFields: [{ field: "email", label: "Email tidak boleh diawali dengan spasi" }],
    };
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};
export const validateFormDataProgram = (formData: FormData) => {
  const savedData = JSON.parse(sessionStorage.getItem("formData") || "{}");

  const requiredFields = [
    { field: "cabang", label: "Cabang" },
    { field: "periode", label: "Periode" },
    { field: "paket.value", label: "Paket" }, // Periksa `value` dalam `paket`
    { field: "paketdetail.value", label: "Durasi Paket" }, // Periksa `value` dalam `paketdetail`
  ];

  // Tambahkan field berdasarkan nilai `paket`
  switch (savedData?.paket?.value) {
    case "integrated":
      requiredFields.push(
        { field: "jampertemuan", label: "Jam Pertemuan" }
      );
      break;
    case "private":
      requiredFields.push(
        { field: "jampertemuanprivate1", label: "Jam Pertemuan Private 1" },
        { field: "jampertemuanprivate2", label: "Jam Pertemuan Private 2" }
      );
      break;
    default:
      requiredFields.push(
        { field: "tipekamar", label: "Tipe Kamar" }
      );
      break;
  }

  // Validasi dengan mendukung properti nested seperti `paket.value`
  const missingFields = requiredFields.filter((item) => {
    const fieldParts = item.field.split(".");
    
    let value: FormData | Record<string, unknown> = formData;

    // Traverse untuk properti nested
    for (const part of fieldParts) {
      if (!value || !value[part]) {
        return true; // Return true jika properti tidak ada atau kosong
      }
      value = value[part] as Record<string, unknown>;
    }

    return false;
  });

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};


export const validateFormDataAkomodasi = (formData: FormData) => {

  const requiredFields = [
    { field: "lokasijemput", label: "Penjemputan" },
  ];

  switch (formData.lokasijemput) {
    case "ga_perlu_dijemput":
      break;
    default:
      requiredFields.push(
        { field: "kendaraan", label: "Kendaraan" },
        { field: "penumpang", label: "Banyak Penumpang" },
      );
      break;
  };
  const missingFields = requiredFields.filter(
    (item) => !formData[item.field as keyof typeof formData]
  );

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};


export const validateFormDataKonfirmasi = (formData: FormData) => {

  const requiredFields = [
    { field: "pembayaran", label: "Metode Pembayaran" },
  ];
  const missingFields = requiredFields.filter(
    (item) => !formData[item.field as keyof typeof formData]
  );

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};