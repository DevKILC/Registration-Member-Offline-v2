// hooks/useTiktokTracking.ts
'use client';

import { useState } from 'react';
import tiktokPixelService from '@/app/services/tiktokPixelService';
import { Hasher } from '@/app/_backend/_helper/hasher';
import { useFormDataStore } from "@/app/hooks/useFormDataStore";
import { useEventParamsData } from "./useEventParamsDataHook";

export const useTiktokTracking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { formData } = useFormDataStore();
  const { eventParamsData } = useEventParamsData();

  /**
   * Send TikTok event ke Pixel (client) dan Events API (server) secara bersamaan
   * @param eventName - Nama event TikTok (e.g., 'AddPaymentInfo', 'InitiateCheckout', 'ViewContent', 'CompletePayment')
   * @param customData - Data custom sesuai jenis event
   * @param options - Opsi tambahan untuk kontrol tracking
   */
  const sendEvent = async (
    eventName: string,
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

    // Hanya trigger jika utm_source adalah TTADS
    if (eventParamsData?.utm_source === "TTADS") {
      try {
        // Generate event_id yang konsisten
        const eventId = formData.nomor
          ? Hasher.sha256(String(formData.nomor))
          : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Prepare hashed user data
        const hashedUserData: Record<string, any> = {};
        if (formData.email) hashedUserData.email = Hasher.sha256(String(formData.email));
        if (formData.nomor) hashedUserData.phone_number = Hasher.sha256(String(formData.nomor));
        if (formData.number) hashedUserData.external_id = Hasher.sha256(String(formData.number));

        // 1. CLIENT-SIDE: TikTok Pixel tracking
        if (!options?.skipPixel && typeof window !== 'undefined' && window.ttq) {
          try {
            const pixelUserData = {
              ...hashedUserData,
              ttp: eventParamsData?.ttp,
              ttclid: eventParamsData?.ttclid,
            };

            if (Object.keys(pixelUserData).length > 0) {
              window.ttq.identify(pixelUserData);
            }

            window.ttq.track(eventName, customData || {});
            
            results.pixel = { success: true, timestamp: Date.now() };
            console.log(`[TikTok Pixel] ${eventName} tracked on client with user data`);
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
              event: eventName,
              event_id: eventId,
              timestamp: new Date().toISOString(),
              context: {
                user_agent: eventParamsData?.user_agent || (typeof window !== 'undefined' ? window.navigator.userAgent : ''),
                ip: eventParamsData?.ip_adress,
                page: {
                  url: typeof window !== 'undefined' ? window.location.href : undefined,
                  referrer: typeof document !== 'undefined' ? document.referrer : undefined,
                },
                user: {
                  ...hashedUserData,
                  ttp: eventParamsData?.ttp,
                  ttclid: eventParamsData?.ttclid,
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
    } else {
      // Jika bukan dari TTADS, langsung return tanpa tracking
      setIsLoading(false);
      return results;
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