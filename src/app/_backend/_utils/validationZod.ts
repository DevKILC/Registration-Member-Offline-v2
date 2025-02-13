import {z} from "zod";

export const dataDiriSchema = z.object({
    nama: z.string().regex(/^[a-zA-Z\s.,]+$/, "Nama hanya boleh mengandung huruf, titik, dan koma").min(1, "Nama tidak boleh kosong").refine(str => !str.startsWith(' '), "Nama tidak boleh diawali dengan spasi"),
    email: z.string().email("Email tidak valid").min(1, "Email tidak boleh kosong").refine(str => !str.startsWith(' '), "Email tidak boleh diawali dengan spasi"),
    nomor: z.string().min(11, "Nomor WhatsApp minimal 11 digit").max(15, "Nomor WhatsApp tidak valid"),
    gender: z.string().min(1, "Jenis Kelamin harus dipilih"),
    kesibukan: z.string().min(1, "Kesibukan harus dipilih"),
});

export const programSchema = z.object({
  cabang : z.string().min(1, "Cabang harus dipilih"),
  periode : z.string().min(1, "Periode harus dipilih"),
  kategoriPaket : z.string().min(1, "Paket harus dipilih"),
  paket : z.string().min(1, "Paket harus dipilih"),
  duration : z.string().min(1, "Durasi paket harus dipilih"),
  grade : z.string().min(1, "Tipe Kamar harus dipilih"),
});


export const akomodasiSchema = z
  .object({
    lokasijemput: z.string().min(1, "Lokasi Penjemputan harus dipilih"),
    kendaraan: z.string(),
    penumpang: z.string().min(1, "Banyak Penumpang harus dipilih"),
  })
  .superRefine((data, ctx) => {
    if (data.lokasijemput !== "tidak_perlu_dijemput") {
      if (!data.kendaraan || data.kendaraan.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["kendaraan"],
          message: "Kendaraan harus dipilih jika penjemputan diperlukan",
        });
      }
      if (!data.penumpang || data.penumpang === "0") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["penumpang"],
          message: "Penumpang harus dipilih jika penjemputan diperlukan",
        });
      }
    }
  });

  export const konfirmasiSchema = z.object({
    metode_pembayaran: z.string().min(1, "Metode Pembayaran harus dipilih"),
  });
  
