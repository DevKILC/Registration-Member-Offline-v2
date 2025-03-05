'use client';

declare global {
  interface Window {
    fbq?: {
      (command: "init", pixelId: string): void;
      (command: "trackCustom", eventName: string, eventData?: Record<string, any>): void;
      callMethod?: (...args: any[]) => void;
      loaded?: boolean;
      version?: string;
      queue?: any[];
    };
  }
}

export const addPaymentInfo = async (data: any) => {
  const trackMetaPixelEvent = () => {
    if (typeof window !== "undefined" && window.fbq) {
      try {
        const eventData = {
          content_name: "Registrasi Lc Offline",
          content_category: "LC Offline",
          currency: "IDR",
          value: data.formData.pembayaran,
          fn: data.formData.nama,
          ph: data.formData.nomor,
          em: data.formData.email,
          fbp: data.fbp?.value,
          fbc: data.fbc?.value,
        };

        console.log("Meta Pixel Submit Data:", eventData);

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
            fbc: data.fbc?.value,
          });
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
