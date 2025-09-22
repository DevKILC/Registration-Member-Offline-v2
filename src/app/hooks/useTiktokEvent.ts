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
  event_id?: string;
  value?: number;
  currency?: string;
  content_type?: string;
  content_id?: string;
  content_name?: string;
  content_category?: string;
}): void => {
  if (typeof window !== "undefined" && window.ttq) {
    if (paymentData) {
      const eventParams = {
        event_id: paymentData.event_id,
        value: paymentData.value,
        currency: paymentData.currency || 'IDR',
        content_type: paymentData.content_type || 'course_registration',
        content_id: paymentData.content_id,
        content_name: paymentData.content_name,
        content_category: paymentData.content_category,
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

// InitiateCheckout function with checkout data parameters
export const trackInitiateCheckout = (checkoutData?: {
  event_id?: string;
  value?: number;
  currency?: string;
  content_type?: string;
  content_id?: string;
  content_name?: string;
  quantity?: number;
  content_category?: string;
}): void => {
  if (typeof window !== "undefined" && window.ttq) {
    if (checkoutData) {
      const eventParams = {
        event_id: checkoutData.event_id,
        value: checkoutData.value,
        currency: checkoutData.currency || 'IDR',
        content_type: checkoutData.content_type || 'course_registration',
        content_id: checkoutData.content_id,
        content_name: checkoutData.content_name,
        quantity: checkoutData.quantity || 1,
        content_category: checkoutData.content_category,
      };

      // Remove undefined values
      const cleanParams = Object.fromEntries(
        Object.entries(eventParams).filter(([, value]) => value !== undefined)
      );
      window.ttq.track("InitiateCheckout", cleanParams);
      console.log("TikTok Pixel: InitiateCheckout event tracked with params:", cleanParams);
    } else {
      // Fallback to basic tracking without parameters
      window.ttq.track("InitiateCheckout");
      console.log("TikTok Pixel: InitiateCheckout event tracked");
    }
  } else {
    console.warn("TikTok Pixel: ttq not available");
  }
};