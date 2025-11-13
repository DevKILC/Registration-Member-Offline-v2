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
   * @param userData - Data user untuk advanced matching
   * @param customData - Data custom sesuai jenis event
   * @param options - Opsi tambahan untuk kontrol tracking
   */
  const sendEvent = async (
    eventName: string,
    userData: TiktokUserData,
    customData?: Record<string, any>,
    options?: {
      skipPixel?: boolean;
      skipServer?: boolean;
    }
  ) => {
    setIsLoading(true);
    
    const results = {
      pixel: null as any,
      server: null as any,
      errors: [] as string[],
    };

    try {
      // Prepare hashed user data
      const hashedUserData: Record<string, any> = {};
      if (userData.email) hashedUserData.email = Hasher.sha256(userData.email);
      if (userData.phone_number) hashedUserData.phone_number = Hasher.sha256(userData.phone_number);
      if (userData.external_id) hashedUserData.external_id = Hasher.sha256(userData.external_id);

      // 1. CLIENT-SIDE: TikTok Pixel tracking
      if (!options?.skipPixel && typeof window !== 'undefined' && window.ttq) {
        try {
          const pixelUserData = {
            ...hashedUserData,
            ttp: userData.ttp,
            ttclid: userData.ttclid,
          };

          if (Object.keys(pixelUserData).length > 0) {
            window.ttq.identify(pixelUserData);
          }

          window.ttq.track(eventName, customData || {});
          
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
          // Format payload yang BENAR sesuai TikTok Events API
          const payload = {
            event: eventName, // WAJIB: nama event
            event_id: hashedUserData.phone_number || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            context: {
              user_agent: userData.user_agent || (typeof window !== 'undefined' ? window.navigator.userAgent : ''),
              ip: userData.ip,
              page: {
                url: typeof window !== 'undefined' ? window.location.href : undefined,
                referrer: typeof document !== 'undefined' ? document.referrer : undefined,
              },
              user: {
                ...hashedUserData,
                ttp: userData.ttp,
                ttclid: userData.ttclid,
              },
            },
            properties: customData || {},
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

declare global {
  interface Window {
    ttq?: {
      track: (eventName: string, data?: Record<string, any>) => void;
      page: () => void;
      identify: (userData: Record<string, any>) => void;
    };
  } 
}