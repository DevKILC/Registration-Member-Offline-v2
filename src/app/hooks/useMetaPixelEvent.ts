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
    if (eventParamsData?.utm_source !== "FB") {
      console.log('[Meta Tracking] Skipped - utm_source is not FB');
      return results;
    }

    setIsLoading(true);

    try {
      // Generate consistent event ID
      const eventId = formData.nomor
        ? Hasher.sha256(String(formData.nomor))
        : `${Date.now()}-${Math.random().toString(36)}`;

      console.log(`[Meta Tracking] Starting ${eventName} with eventID: ${eventId}`);

      // ============================================
      // 1. CLIENT-SIDE: Meta Pixel tracking
      // ============================================
      if (!options?.skipPixel && typeof window !== 'undefined' && window.fbq) {
        try {
          console.log('[Meta Pixel] Preparing user data...');
          
          // Prepare UNHASHED user data for pixel (Meta hashes automatically)
          const pixelUserData: Record<string, any> = {};
          if (formData.email) pixelUserData.em = formData.email;
          if (formData.nomor) pixelUserData.ph = formData.nomor;
          if (formData.nama) pixelUserData.fn = formData.nama;
          if (eventParamsData?.fbp) pixelUserData.fbp = eventParamsData.fbp;
          if (eventParamsData?.fbc) pixelUserData.fbc = eventParamsData.fbc;

          console.log('[Meta Pixel] User data prepared:', Object.keys(pixelUserData));

          // Track event with eventID for deduplication
          window.fbq('track', eventName, customData || {}, { eventID: eventId });
          
          results.pixel = { 
            success: true, 
            timestamp: Date.now(),
            eventId: eventId 
          };
          
          console.log(`✅ [Meta Pixel] ${eventName} tracked successfully`);
        } catch (error) {
          const errorMsg = `[Meta Pixel] Error: ${error}`;
          console.error(errorMsg, error);
          results.errors.push(errorMsg);
          results.pixel = { success: false, error: errorMsg };
        }
      } else {
        console.log('[Meta Pixel] Skipped - pixel not available or disabled');
      }

      // ============================================
      // 2. SERVER-SIDE: Meta CAPI tracking
      // ============================================
      if (!options?.skipServer) {
        try {
          
          // Prepare HASHED user data for server
          const hashedUserData: Record<string, any> = {};
          if (formData.email) hashedUserData.em = Hasher.sha256(String(formData.email).toLowerCase().trim());
          if (formData.nomor) hashedUserData.ph = Hasher.sha256(String(formData.nomor).replace(/\D/g, ''));
          if (formData.nama) hashedUserData.fn = Hasher.sha256(String(formData.nama).toLowerCase().trim());

          console.log('[Meta CAPI] Hashed user data prepared:', Object.keys(hashedUserData));

          const payload = {
            data: [
              {
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                event_id: eventId, // Same eventID for deduplication
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
            test_event_code: 'TEST3703', // DISABLED - Remove for production
          };

          console.log('[Meta CAPI] Sending payload...', {
            eventName,
            eventId,
            hasUserData: Object.keys(hashedUserData).length > 0
          });

          results.server = await metaPixelService.sendEvent(payload);
          
          console.log(`✅ [Meta CAPI] ${eventName} sent successfully:`, results.server);
        } catch (error) {
          const errorMsg = `[Meta CAPI] Error: ${error}`;
          console.error(errorMsg, error);
          results.errors.push(errorMsg);
          results.server = { success: false, error: errorMsg };
        }
      } else {
        console.log('[Meta CAPI] Skipped - server tracking disabled');
      }

      // Summary
      console.log(`[Meta Tracking] ${eventName} Summary:`, {
        pixel: results.pixel?.success ? '✅' : '❌',
        server: results.server?.success || results.server?.events_received ? '✅' : '❌',
        errors: results.errors.length
      });

      return results;

    } catch (error) {
      const errorMsg = `[Meta Tracking] Unexpected error: ${error}`;
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

export default useMetaTracking;

// Type definition
declare global {
  interface Window {
    fbq?: {
      (action: 'track', eventName: string, data?: Record<string, any>, options?: Record<string, any>): void;
      (action: 'trackCustom', eventName: string, data?: Record<string, any>): void;
      (action: 'init', pixelId: string, userData?: Record<string, any>): void;
    };
  }
}