'use client';

export const addPaymentInfo = async (data: any) => {
  const trackMetaPixelEvent = () => {
    const dataParams = {
      content_name: "Registrasi Lc Offline",
      content_category: "LC Offline",
      currency: "IDR",
      value: data.formData.pembayaran,
      fn: data.formData.nama,
      ph: data.formData.nomor,
      em: data.formData.email,
      fbp: data.fbp?.value,
      fbc: data.fbc,
    };
    console.log(dataParams);
    if (typeof window !== "undefined" && window.fbq) {
      try {
        if (typeof window.fbq === "function") {
          window.fbq("trackCustom", "AddPaymentInfo", {
            content_name: "Registrasi Lc Offline",
            content_category: "LC Offline",
            currency: "IDR",
            value: data.formData.pembayaran,
            fn: data.formData.nama,
            ph: data.formData.nomor,
            em: data.formData.email,
            fbp: data.fbp?.value,
            fbc: data.fbc,
          });
          console.log("Meta Pixel: AddPaymentInfo event tracked");
        } else {
          console.warn("Meta Pixel (fbq) is not a function");
        }
      } catch (error) {
        console.error("Meta Pixel Tracking Error:", error);
      }
    } else {
      console.warn("Meta Pixel script not loaded");
    }
  };

  return new Promise<void>((resolve) => {
    setTimeout(() => {
      trackMetaPixelEvent();
      resolve();
    }, 100);
  });
};
