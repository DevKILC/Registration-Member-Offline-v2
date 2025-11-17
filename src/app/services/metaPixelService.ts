
export const metaPixelService = {
  /**
   * Send event ke Meta Conversions API via internal route
   * Data user sudah ter-hash dari hook, tidak perlu hash lagi
   */
  async sendEvent(payload: any) {
    try {
      // Kirim ke route internal yang akan forward ke Meta API
      const response = await fetch('/api/meta/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[Meta Service] API error:', error);
        return { success: false, error };
      }

      const result = await response.json();
      console.log('[Meta Service] Event sent successfully:', result);
      return { success: true, data: result };
      
      } catch (error) {
        console.error('[Meta Service] Network error:', error);
        return { success: false, error: String(error) };
      }
    }
  };

export default metaPixelService;