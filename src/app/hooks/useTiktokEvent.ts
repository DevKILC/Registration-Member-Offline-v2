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

// Generic TikTok event tracking function
function trackTikTokEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track(eventName, params);
    console.log("TikTok Event Fired:", eventName, params);
  } else {
    console.warn("TikTok Pixel not available yet");
  }
}

// AddPaymentInfo event tracker
export const trackAddPaymentInfo = (paymentData?: {
  event_id?: string;
  value?: number;
  currency?: string;
  content_type?: string;
  content_id?: string;
  content_name?: string;
  content_category?: string;
}) => {
  const params = paymentData ? {
    event_id: paymentData.event_id,
    value: paymentData.value,
    currency: paymentData.currency || 'IDR',
    content_type: paymentData.content_type || 'course_registration',
    content_id: paymentData.content_id,
    content_name: paymentData.content_name,
    content_category: paymentData.content_category,
  } : {};

  // Remove undefined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );

  trackTikTokEvent("AddPaymentInfo", cleanParams);
};

// InitiateCheckout event tracker
export const trackInitiateCheckout = (checkoutData?: {
  event_id?: string;
  value?: number;
  currency?: string;
  content_type?: string;
  content_id?: string;
  content_name?: string;
  quantity?: number;
  content_category?: string;
}) => {
  const params = checkoutData ? {
    event_id: checkoutData.event_id,
    value: checkoutData.value,
    currency: checkoutData.currency || 'IDR',
    content_type: checkoutData.content_type || 'course_registration',
    content_id: checkoutData.content_id,
    content_name: checkoutData.content_name,
    quantity: checkoutData.quantity || 1,
    content_category: checkoutData.content_category,
  } : {};

  // Remove undefined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );

  trackTikTokEvent("InitiateCheckout", cleanParams);
};

// Example usage:
// 1. View Content (landing page / program detail)
// trackTikTokEvent("ViewContent", {
//   content_type: "course",
//   content_ids: ["LC-INTENSIVE-01"],
//   currency: "IDR",
//   value: 2000000
// });

// 2. Add Payment Info
// trackAddPaymentInfo({
//   value: 2000000,
//   currency: "IDR",
//   content_id: "LC-INTENSIVE-01",
//   content_name: "Leadership Course Intensive"
// });

// 3. Initiate Checkout
// trackInitiateCheckout({
//   value: 2000000,
//   currency: "IDR", 
//   content_id: "LC-INTENSIVE-01",
//   content_name: "Leadership Course Intensive"
// });