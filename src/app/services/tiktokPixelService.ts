// services/tiktok.service.ts
import { tiktokPixelConfig } from '@/app/config/pixelConfig';

export const tiktokPixelService = {
  async sendEvent(payload: any) {
    try {
      const url = `${tiktokPixelConfig.baseUrl}/v1.3/pixel/track/`;
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Access-Token': tiktokPixelConfig.accessToken,
        },
        body: JSON.stringify({
          pixel_code: tiktokPixelConfig.pixelId,
          ...payload,
        }),
      });

      const result = await res.json();
      console.log('[TikTok Events API] Event sent ->', result);
      return result;
    } catch (error) {
      console.error('[TikTok Events API] Error sending event:', error);
      return null;
    }
  }
};

export default tiktokPixelService;