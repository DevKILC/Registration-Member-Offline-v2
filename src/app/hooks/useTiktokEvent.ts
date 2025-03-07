'use client'

declare global {
  interface Window {
    TiktokAnalyticsObject?: string;
    ttq?: {
      track: (event: string, params?: Record<string, any>) => void;
      page: () => void;
      load: (pixelId: string, options?: Record<string, any>) => void;
      identify: (data?: Record<string, any>) => void;
    };
  }
}

export const trackAddPaymentInfo = (): void => {
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track("AddPaymentInfo");
    console.log("TikTok Pixel: AddPaymentInfo event tracked");
  } else {
    console.warn("TikTok Pixel: ttq not available");
  }
};
