'use client';

declare global {
  interface Window {
    fbq?: {
      (cmd: 'init', pixelId: string, advancedMatching?: Record<string, any>, options?: Record<string, any>): void;
      (cmd: 'track', eventName: string, params?: Record<string, any>, options?: { eventID?: string }): void;
      (cmd: 'trackCustom', eventName: string, params?: Record<string, any>, options?: { eventID?: string }): void;
      callMethod?: (...args: any[]) => void;
      loaded?: boolean;
      version?: string;
      queue?: any[];
    };
  }
}

// Generic Meta event tracking function
function trackMetaEvent(
  eventName: string,
  params: Record<string, any> = {},
  eventID?: string
) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    // remove undefined/empty values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, v]) =>
          v !== undefined &&
          v !== null &&
          !(Array.isArray(v) && v.length === 0) &&
          !(typeof v === 'string' && v.trim() === '')
      )
    );
    if (eventID) {
      window.fbq('track', eventName, cleanParams, { eventID });
    } else {
      window.fbq('track', eventName, cleanParams);
    }
    console.log('Meta Pixel Event Fired:', eventName, cleanParams, eventID ? { eventID } : '');
  } else {
    console.warn('Meta Pixel not available yet');
  }
}

/**
 * AddPaymentInfo tracker (STANDARD EVENT)
 * Rekomendasi param: value (number), currency ('IDR'), lalu content_ids+content_type ATAU contents[]
 */
export const trackAddPaymentInfo = (paymentData?: {
  event_id?: string;           // optional, useful if you also send CAPI
  value?: number;              // total value, number only
  currency?: string;           // default 'IDR'
  // Pilih salah satu skema di bawah:
  content_type?: string;       // e.g., 'course' | 'product'
  content_ids?: string[];      // e.g., ['LC-INTENSIVE-01']
  contents?: Array<{           // alternative detailed schema
    id: string;
    quantity?: number;
    item_price?: number;
  }>;

  // Non-standard (opsional): akan dikirim tapi tidak diperlukan
  content_name?: string;
  content_category?: string;
}) => {
  const params = paymentData
    ? {
        value: paymentData.value,
        currency: paymentData.currency || 'IDR',
        // gunakan salah satu: content_ids+content_type ATAU contents
        content_type: paymentData.content_type || (paymentData.contents ? undefined : 'course'),
        content_ids: paymentData.content_ids,
        contents: paymentData.contents,

        // opsional non-standar
        content_name: paymentData.content_name,
        content_category: paymentData.content_category
      }
    : {};

  trackMetaEvent('AddPaymentInfo', params, paymentData?.event_id);
};

/**
 * InitiateCheckout tracker (STANDARD EVENT)
 */
export const trackInitiateCheckout = (checkoutData?: {
  event_id?: string;
  value?: number;
  currency?: string;
  num_items?: number;

  // Pilih salah satu:
  content_type?: string;
  content_ids?: string[];
  contents?: Array<{
    id: string;
    quantity?: number;
    item_price?: number;
  }>;

  // Non-standard (opsional)
  content_name?: string;
  content_category?: string;
}) => {
  const params = checkoutData
    ? {
        value: checkoutData.value,
        currency: checkoutData.currency || 'IDR',
        num_items: checkoutData.num_items ?? 1,

        // gunakan salah satu skema
        content_type: checkoutData.content_type || (checkoutData.contents ? undefined : 'course'),
        content_ids: checkoutData.content_ids,
        contents: checkoutData.contents,

        // opsional non-standar
        content_name: checkoutData.content_name,
        content_category: checkoutData.content_category
      }
    : {};

  trackMetaEvent('InitiateCheckout', params, checkoutData?.event_id);
};

// Example usage:

// 1) ViewContent (landing/program detail) — panggil langsung generic
// trackMetaEvent('ViewContent', {
//   content_type: 'course',
//   content_ids: ['LC-INTENSIVE-01'],
//   currency: 'IDR',
//   value: 2000000
// });

// 2) AddPaymentInfo
// trackAddPaymentInfo({
//   value: 2000000,
//   currency: 'IDR',
//   content_type: 'course',
//   content_ids: ['LC-INTENSIVE-01'],
//   // atau gunakan contents:
//   // contents: [{ id: 'LC-INTENSIVE-01', quantity: 1, item_price: 2000000 }]
// });

// 3) InitiateCheckout
// trackInitiateCheckout({
//   value: 2000000,
//   currency: 'IDR',
//   num_items: 1,
//   content_type: 'course',
//   content_ids: ['LC-INTENSIVE-01']
//   // atau contents: [{ id: 'LC-INTENSIVE-01', quantity: 1, item_price: 2000000 }]
// });
