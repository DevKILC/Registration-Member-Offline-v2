// hooks/useTiktokTracking.ts
'use client';

import { useState } from 'react';
import tiktokPixelService from '@/app/services/tiktokPixelService';
import { Hasher } from '@/app/_backend/_helper/hasher';
import { TiktokUserData } from '@/app/_backend/_utils/Interfaces';

export const useTiktokTracking = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Generic function untuk send TikTok Events API
   * @param eventName - Nama event TikTok (e.g., 'AddPaymentInfo', 'InitiateCheckout', 'ViewContent', 'CompletePayment')
   * @param userData - Data user yang akan di-hash
   * @param customData - Data custom sesuai jenis event
   */
  const sendEvent = async (
    eventName: string,
    userData: TiktokUserData,
    customData?: Record<string, any>,
  ) => {
    setIsLoading(true);
    try {
      const payload = {
        event_source: 'web',
        event_source_id: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID, // TikTok Pixel ID
        data: [
          {
            event: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: userData.phone_number ? Hasher.sha256(userData.phone_number) : undefined,
            user: {
              email: userData.email,
              phone_number: userData.phone_number,
              external_id: userData.external_id,
              ttp: userData.ttp, // _ttp cookie (TikTok tracking cookie)
              ttclid: userData.ttclid, // TikTok Click ID dari URL
              ip: userData.ip,
              user_agent: userData.user_agent,
            },
            page: {
              url: typeof window !== 'undefined' ? window.location.href : undefined,
              referrer: typeof document !== 'undefined' ? document.referrer : undefined,
            },
            properties: customData || {},
          },
        ],
      };

      const result = await tiktokPixelService.sendEvent(payload);
      console.log(`[TikTok Events API] ${eventName} sent successfully:`, result);
      return result;
    } catch (error) {
      console.error(`[TikTok Events API] Error sending ${eventName}:`, error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendEvent,
  };
};

export default useTiktokTracking;