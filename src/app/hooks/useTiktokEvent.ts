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

// Updated AddPaymentInfo function with payment data parameters
export const trackAddPaymentInfo = (paymentData?: {
  value?: number;
  currency?: string;
  content_type?: string;
  content_id?: string;
}): void => {
  if (typeof window !== "undefined" && window.ttq) {
    if (paymentData) {
      const eventParams = {
        value: paymentData.value,
        currency: paymentData.currency || 'IDR',
        content_type: paymentData.content_type || 'course_registration',
        content_id: paymentData.content_id,
      };

      // Remove undefined values
      const cleanParams = Object.fromEntries(
        Object.entries(eventParams).filter(([, value]) => value !== undefined)
      );
      window.ttq.track("AddPaymentInfo", cleanParams);
      console.log("TikTok Pixel: AddPaymentInfo event tracked with params:", cleanParams);
    } else {
      // Fallback to basic tracking without parameters
      window.ttq.track("AddPaymentInfo");
      console.log("TikTok Pixel: AddPaymentInfo event tracked");
    }
  } else {
    console.warn("TikTok Pixel: ttq not available");
  }
};