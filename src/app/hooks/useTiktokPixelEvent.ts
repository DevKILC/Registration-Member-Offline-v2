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
    const results = {
      pixel: null as any,
      server: null as any,
      errors: [] as string[],
    };

    // Check if tracking should run
    if (eventParamsData?.utm_source !== "TTADS") {
      console.log('[TikTok Tracking] Skipped - utm_source is not TTADS');
      return results;
    }

    setIsLoading(true);

    try {
      // Generate consistent event_id
      const eventId = formData.nomor
        ? Hasher.sha256(String(formData.nomor))
        : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      console.log(`[TikTok Tracking] Starting ${eventName} with eventID: ${eventId}`);

      // ============================================
      // 1. CLIENT-SIDE: TikTok Pixel tracking
      // ============================================
      if (!options?.skipPixel && typeof window !== 'undefined' && window.ttq) {
        try {
          console.log('[TikTok Pixel] Preparing user data...');

          // Prepare HASHED user data for pixel
          const pixelUserData: Record<string, any> = {};
          if (formData.email) {
            pixelUserData.sha256_email = Hasher.sha256(String(formData.email).toLowerCase().trim());
          }
          if (formData.nomor) {
            pixelUserData.sha256_phone_number = Hasher.sha256(String(formData.nomor).replace(/\D/g, ''));
          }
          if (formData.number) {
            pixelUserData.external_id = Hasher.sha256(String(formData.number));
          }
          
          // Add TikTok-specific identifiers
          if (eventParamsData?.ttp) pixelUserData.ttp = eventParamsData.ttp;
          if (eventParamsData?.ttclid) pixelUserData.ttclid = eventParamsData.ttclid;

          console.log('[TikTok Pixel] User data prepared:', Object.keys(pixelUserData));

          // Identify user if we have data
          if (Object.keys(pixelUserData).length > 0) {
            window.ttq.identify(pixelUserData);
            console.log('[TikTok Pixel] User identified');
          }

          // Track event
          window.ttq.track(eventName, customData || {});
          
          results.pixel = { 
            success: true, 
            timestamp: Date.now(),
            eventId: eventId 
          };
          
          console.log(`✅ [TikTok Pixel] ${eventName} tracked successfully`);
        } catch (error) {
          const errorMsg = `[TikTok Pixel] Error: ${error}`;
          console.error(errorMsg, error);
          results.errors.push(errorMsg);
          results.pixel = { success: false, error: errorMsg };
        }
      } else {
        console.log('[TikTok Pixel] Skipped - pixel not available or disabled');
      }

      // ============================================
      // 2. SERVER-SIDE: TikTok Events API tracking
      // ============================================
      if (!options?.skipServer) {
        try {
          console.log('[TikTok Events API] Preparing hashed user data...');

          // Prepare HASHED user data for server
          const hashedUserData: Record<string, any> = {};
          if (formData.email) {
            hashedUserData.email = Hasher.sha256(String(formData.email).toLowerCase().trim());
          }
          if (formData.nomor) {
            hashedUserData.phone_number = Hasher.sha256(String(formData.nomor).replace(/\D/g, ''));
          }
          if (formData.number) {
            hashedUserData.external_id = Hasher.sha256(String(formData.number));
          }

          console.log('[TikTok Events API] Hashed user data prepared:', Object.keys(hashedUserData));

          // Format payload sesuai TikTok Events API spec
          const payload = {
            event: eventName,
            event_id: eventId, // Same eventID for deduplication
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

          console.log('[TikTok Events API] Sending payload...', {
            eventName,
            eventId,
            hasUserData: Object.keys(hashedUserData).length > 0
          });

          results.server = await tiktokPixelService.sendEvent(payload);
          
          console.log(`✅ [TikTok Events API] ${eventName} sent successfully:`, results.server);
        } catch (error) {
          const errorMsg = `[TikTok Events API] Error: ${error}`;
          console.error(errorMsg, error);
          results.errors.push(errorMsg);
          results.server = { success: false, error: errorMsg };
        }
      } else {
        console.log('[TikTok Events API] Skipped - server tracking disabled');
      }

      // Summary
      console.log(`[TikTok Tracking] ${eventName} Summary:`, {
        pixel: results.pixel?.success ? '✅' : '❌',
        server: results.server?.success || results.server?.code === 0 || results.server?.message ? '✅' : '❌',
        errors: results.errors.length
      });

      return results;

    } catch (error) {
      const errorMsg = `[TikTok Tracking] Unexpected error: ${error}`;
      console.error(errorMsg, error);
      results.errors.push(errorMsg);
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