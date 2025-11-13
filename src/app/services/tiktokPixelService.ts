// services/tiktokPixelService.ts
export const tiktokPixelService = {
  async sendEvent(payload: any) {
    try {
      const res = await fetch('/api/tiktok/track', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      
      if (!res.ok) {
        console.error('[TikTok Events API] Error response:', result);
        return null;
      }

      console.log('[TikTok Events API] Success:', result);
      return result;
    } catch (error) {
      console.error('[TikTok Events API] Network error:', error);
      return null;
    }
  }
};

export default tiktokPixelService;