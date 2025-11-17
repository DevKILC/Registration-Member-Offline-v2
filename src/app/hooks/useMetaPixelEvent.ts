// hooks/useMetaTracking.ts
'use client';

import { useState } from 'react';
import metaPixelService from '@/app/services/metaPixelService';
import { Hasher } from '@/app/_backend/_helper/hasher';
import { useFormDataStore } from "@/app/hooks/useFormDataStore";
import { useEventParamsData } from "./useEventParamsDataHook";

export const useMetaTracking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { formData } = useFormDataStore();
  const { eventParamsData } = useEventParamsData();

  /**
   * Send Meta event ke Pixel (client) dan CAPI (server) secara bersamaan
   * @param eventName - Nama event Meta (e.g., 'AddPaymentInfo', 'InitiateCheckout', 'ViewContent', 'Purchase')
   * @param userData - Data user untuk advanced matching
   * @param customData - Data custom sesuai jenis event
   * @param options - Opsi tambahan untuk kontrol tracking
   */


  const sendEvent = async (
    eventName: string,
    customData?: Record<string, any>,
    options?: {
      skipPixel?: boolean; // Skip client-side pixel tracking
      skipServer?: boolean; // Skip server-side CAPI tracking
    }
  ) => {
    setIsLoading(true);
    
    const results = {
      pixel: null as any,
      server: null as any,
      errors: [] as string[],
    };

    if (eventParamsData?.utm_source === "FB") {
      try {
        const eventId = formData.nomor
          ? Hasher.sha256(String(formData.nomor))
          : `${Date.now()}-${Math.random().toString(36)}`;

      // 1. CLIENT-SIDE: Meta Pixel tracking (UNHASHED - Meta akan hash otomatis)
      if (!options?.skipPixel && typeof window !== 'undefined' && window.fbq) {
        try {
          // Prepare complete user data untuk pixel (UNHASHED + tracking cookies)
          const pixelUserData: Record<string, any> = {};
          if (formData.email) pixelUserData.em = formData.email;
          if (formData.nomor) pixelUserData.ph = formData.nomor;
          if (formData.nama) pixelUserData.fn = formData.nama;
          if (formData.number) pixelUserData.number = formData.number;
          if (eventParamsData?.fbp) pixelUserData.fbp = eventParamsData?.fbp;
          if (eventParamsData?.fbc) pixelUserData.fbc = eventParamsData?.fbc;

          // Track with user data and custom data
          window.fbq('track', eventName, customData || {}, { eventID: eventId });
          
          // Set advanced matching data
          if (Object.keys(pixelUserData).length > 0) {
            window.fbq('init', process.env.NEXT_PUBLIC_META_PIXEL_ID!, pixelUserData);
          }
          
          results.pixel = { success: true, timestamp: Date.now() };
          console.log(`[Meta Pixel] ${eventName} tracked on client with user data`);
        } catch (error) {
          const errorMsg = `[Meta Pixel] Error: ${error}`;
          console.error(errorMsg);
          results.errors.push(errorMsg);
        }
      }

      // 2. SERVER-SIDE: Meta CAPI tracking (HASHED)
      if (!options?.skipServer) {
        try {
          // Prepare hashed user data untuk server
          const hashedUserData: Record<string, any> = {};
          if (formData.email) hashedUserData.em = Hasher.sha256(String(formData.email));
          if (formData.nomor) hashedUserData.ph = Hasher.sha256(String(formData.nomor));
          if (formData.nama) hashedUserData.fn = Hasher.sha256(String(formData.nama));
          if (formData.number) hashedUserData.number = Hasher.sha256(String(formData.number));

          const payload = {
            data: [
              {
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                event_id: eventId,
                action_source: 'website',
                event_source_url: typeof window !== 'undefined' ? window.location.href : undefined,
                user_data: {
                  ...hashedUserData,
                  fbp: eventParamsData?.fbp,
                  fbc: eventParamsData?.fbc,
                  client_ip_address: eventParamsData?.ip_adress,
                  client_user_agent: eventParamsData?.user_agent,
                },
                custom_data: customData || {},
              },
            ],
          };

          results.server = await metaPixelService.sendEvent(payload);
          console.log(`[Meta CAPI] ${eventName} sent successfully:`, results.server);
        } catch (error) {
          const errorMsg = `[Meta CAPI] Error: ${error}`;
          console.error(errorMsg);
          results.errors.push(errorMsg);
        }
      }

      return results;
    } catch (error) {
      console.error(`[Meta Tracking] Unexpected error:`, error);
      results.errors.push(`Unexpected error: ${error}`);
      return results;
    } finally {
      setIsLoading(false);
    }
  }else{
      setIsLoading(false);
      return results;
  }

  };

  return {
    isLoading,
    sendEvent,
  };
};

export default useMetaTracking;

// Type definition untuk window.fbq (tambahkan ke global.d.ts atau types.d.ts)
declare global {
  interface Window {
    fbq?: {
      (action: 'track', eventName: string, data?: Record<string, any>, options?: Record<string, any>): void;
      (action: 'trackCustom', eventName: string, data?: Record<string, any>): void;
      (action: 'init', pixelId: string, userData?: Record<string, any>): void;
    };
  }
}