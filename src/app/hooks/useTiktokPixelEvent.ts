// hooks/useTiktokTracking.ts
'use client';

import { useState } from 'react';
import tiktokPixelService from '@/app/services/tiktokPixelService';
import { Hasher } from '@/app/_backend/_helper/hasher';
import { TiktokUserData } from '@/app/_backend/_utils/Interfaces';

export const useTiktokTracking = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Send TikTok event ke Pixel (client) dan Events API (server) secara bersamaan
   * @param eventName - Nama event TikTok (e.g., 'AddPaymentInfo', 'InitiateCheckout', 'ViewContent', 'CompletePayment')
   * @param userData - Data user yang akan di-hash untuk server-side
   * @param customData - Data custom sesuai jenis event
   * @param options - Opsi tambahan untuk kontrol tracking
   */
  const sendEvent = async (
    eventName: string,
    userData: TiktokUserData,
    customData?: Record<string, any>,
    options?: {
      skipPixel?: boolean; // Skip client-side pixel tracking
      skipServer?: boolean; // Skip server-side API tracking
    }
  ) => {
    setIsLoading(true);
    
    const results = {
      pixel: null as any,
      server: null as any,
      errors: [] as string[],
    };

    try {
      // 1. CLIENT-SIDE: TikTok Pixel tracking
      if (!options?.skipPixel && typeof window !== 'undefined' && window.ttq) {
        try {
          window.ttq.track(eventName, {
            ...userData,
            ...customData
          });
          results.pixel = { success: true, timestamp: Date.now() };
          console.log(`[TikTok Pixel] ${eventName} tracked on client`);
        } catch (error) {
          const errorMsg = `[TikTok Pixel] Error: ${error}`;
          console.error(errorMsg);
          results.errors.push(errorMsg);
        }
      }

      // 2. SERVER-SIDE: TikTok Events API tracking
      if (!options?.skipServer) {
        try {
          const payload = {
            event_source: 'web',
            event_source_id: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
            data: [
              {
                event: eventName,
                event_time: Math.floor(Date.now() / 1000),
                event_id: userData.phone_number 
                  ? Hasher.sha256(userData.phone_number) 
                  : `${Date.now()}-${Math.random().toString(36)}`,
                user: {
                  email: userData.email ? Hasher.sha256(userData.email) : undefined,
                  phone_number: userData.phone_number ? Hasher.sha256(userData.phone_number) : undefined,
                  external_id: userData.external_id ? Hasher.sha256(userData.external_id) : undefined,
                  ttp: userData.ttp,
                  ttclid: userData.ttclid,
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

          results.server = await tiktokPixelService.sendEvent(payload);
          console.log(`[TikTok Events API] ${eventName} sent successfully:`, results.server);
        } catch (error) {
          const errorMsg = `[TikTok Events API] Error: ${error}`;
          console.error(errorMsg);
          results.errors.push(errorMsg);
        }
      }

      return results;
    } catch (error) {
      console.error(`[TikTok Tracking] Unexpected error:`, error);
      results.errors.push(`Unexpected error: ${error}`);
      return results;
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

// Type definition untuk window.ttq (tambahkan ke global.d.ts atau types.d.ts)
declare global {
  interface Window {
    ttq?: {
      track: (eventName: string, data?: Record<string, any>) => void;
      page: () => void;
      identify: (data: Record<string, any>) => void;
    };
  }
}