// hooks/useMetaTracking.ts
'use client';

import { useState } from 'react';
import metaPixelService from '@/app/services/metaPixelService';
import { Hasher } from '@/app/_backend/_helper/hasher';
import { MetaUserData } from '@/app/_backend/_utils/Interfaces';

export const useMetaTracking = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Send Meta event ke Pixel (client) dan CAPI (server) secara bersamaan
   * @param eventName - Nama event Meta (e.g., 'AddPaymentInfo', 'InitiateCheckout', 'ViewContent', 'Purchase')
   * @param userData - Data user untuk advanced matching
   * @param customData - Data custom sesuai jenis event
   * @param options - Opsi tambahan untuk kontrol tracking
   */
  const sendEvent = async (
    eventName: string,
    userData: MetaUserData,
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

    try {
      const eventId = userData.ph 
        ? Hasher.sha256(userData.ph) 
        : `${Date.now()}-${Math.random().toString(36)}`;

      // 1. CLIENT-SIDE: Meta Pixel tracking (UNHASHED - Meta akan hash otomatis)
      if (!options?.skipPixel && typeof window !== 'undefined' && window.fbq) {
        try {
          // Prepare complete user data untuk pixel (UNHASHED + tracking cookies)
          const pixelUserData: Record<string, any> = {};
          if (userData.em) pixelUserData.em = userData.em;
          if (userData.ph) pixelUserData.ph = userData.ph;
          if (userData.fn) pixelUserData.fn = userData.fn;
          if (userData.external_id) pixelUserData.external_id = userData.external_id;
          if (userData.fbp) pixelUserData.fbp = userData.fbp;
          if (userData.fbc) pixelUserData.fbc = userData.fbc;

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
          if (userData.em) hashedUserData.em = Hasher.sha256(userData.em);
          if (userData.ph) hashedUserData.ph = Hasher.sha256(userData.ph);
          if (userData.fn) hashedUserData.fn = Hasher.sha256(userData.fn);
          if (userData.external_id) hashedUserData.external_id = Hasher.sha256(userData.external_id);

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
                  fbp: userData.fbp,
                  fbc: userData.fbc,
                  client_ip_address: userData.client_ip_address,
                  client_user_agent: userData.client_user_agent,
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