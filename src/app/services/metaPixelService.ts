// services/meta.service.ts
import { metaPixelConfig } from '@/app/config/pixelConfig';

export const metaPixelService = {
  async sendEvent(payload: any) {
    try {
      const url = `${metaPixelConfig.baseUrl}/${metaPixelConfig.version}/${metaPixelConfig.pixelId}/events?access_token=${metaPixelConfig.accessToken}`;
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log('[Meta CAPI] Event sent ->', result);
      return result;
    } catch (error) {
      console.error('[Meta CAPI] Error sending event:', error);
      return null;
    }
  }
};

export default metaPixelService;