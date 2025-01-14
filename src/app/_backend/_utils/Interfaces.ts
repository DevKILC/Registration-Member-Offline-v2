export interface FormData {
    nama: string;
    email: string;
    nomor: string | number;
    gender: string;
    kesibukan: string;
    paket: { value: string; label: string };
    paketdetail: { value: string; label: string };
    jampertemuanprivate1: string;
    jampertemuanprivate2: string;
    jampertemuan: string;
    tipekamar: string;
    cabang: string;
    periode: string;
    lokasijemput: string;
    kendaraan: string;
    penumpang: string;
    diskon: string;
    pembayaran: string;
    [key: string]: string | number | boolean | { value: string; label: string };
  }
  