// hooks/useMetaTracking.ts
'use client';

import { useState } from 'react';
import metaPixelService from '@/app/services/metaPixelService';
import { Hasher } from '@/app/_backend/_helper/hasher';
import { MetaUserData } from '@/app/_backend/_utils/Interfaces';

export const useMetaTracking = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Generic function untuk send Meta CAPI event
   * @param eventName - Nama event Meta (e.g., 'AddPaymentInfo', 'InitiateCheckout', 'ViewContent', 'Purchase')
   * @param userData - Data user yang akan di-hash
   * @param customData - Data custom sesuai jenis event
   */
  const sendEvent = async (
    eventName: string,
    userData: MetaUserData,
    customData?: Record<string, any>,
  ) => {
    setIsLoading(true);
    try {
      const payload = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: userData.ph ? Hasher.sha256(userData.ph) : undefined,
            action_source: 'website',
            event_source_url: typeof window !== 'undefined' ? window.location.href : undefined,
            user_data: {
              em: userData.em,
              ph: userData.ph,
              fn: userData.fn,
              fbp: userData.fbp, // _fbp cookie
              fbc: userData.fbc, // _fbc cookie atau fbclid parameter
              client_ip_address: userData.client_ip_address,
              client_user_agent: userData.client_user_agent,
            },
            custom_data: customData || {},
          },
        ],
      };

      const result = await metaPixelService.sendEvent(payload);
      console.log(`[Meta CAPI] ${eventName} sent successfully:`, result);
      return result;
    } catch (error) {
      console.error(`[Meta CAPI] Error sending ${eventName}:`, error);
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

export default useMetaTracking;