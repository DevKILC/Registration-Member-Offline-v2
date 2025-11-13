// app/api/tiktok/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { tiktokPixelConfig } from '@/app/config/pixelConfig';
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Validasi field wajib
    if (!payload.event) {
      return NextResponse.json(
        { error: 'Missing required field: event' },
        { status: 400 }
      );
    }

    // Format payload untuk TikTok Events API
    const tiktokPayload = {
      pixel_code: tiktokPixelConfig.pixelId,
      event: payload.event,
      event_id: payload.event_id || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: payload.timestamp || new Date().toISOString(),
      context: {
        user_agent: payload.context?.user_agent || request.headers.get('user-agent') || '',
        ip: payload.context?.ip || 
            request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            '',
        page: payload.context?.page || {},
        user: payload.context?.user || {},
      },
      properties: payload.properties || {},
    };

    console.log('[TikTok API Route] Sending payload:', JSON.stringify(tiktokPayload, null, 2));

    const response = await fetch(tiktokPixelConfig.baseUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Access-Token': tiktokPixelConfig.accessToken,
      },
      body: JSON.stringify(tiktokPayload),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('[TikTok API Route] TikTok error:', result);
      return NextResponse.json(
        { error: 'Failed to send event to TikTok', details: result },
        { status: response.status }
      );
    }

    console.log('[TikTok API Route] Success:', result);
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('[TikTok API Route] Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}