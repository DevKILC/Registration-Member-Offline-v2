// app/api/meta/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { metaPixelConfig } from '@/app/config/pixelConfig';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Validasi struktur data
    if (!payload.data || !Array.isArray(payload.data) || payload.data.length === 0) {
      return NextResponse.json(
        { error: 'Invalid payload structure: missing data array' },
        { status: 400 }
      );
    }

    const event = payload.data[0];
    
    // Validasi field wajib
    if (!event.event_name) {
      return NextResponse.json(
        { error: 'Missing required field: event_name' },
        { status: 400 }
      );
    }

    // Ambil IP dan User Agent dari request headers jika tidak ada di payload
    const userIp = event.user_data?.client_ip_address || 
                   request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                   request.headers.get('x-real-ip') || 
                   '';
    
    const userAgent = event.user_data?.client_user_agent || 
                      request.headers.get('user-agent') || 
                      '';

    // Inject IP dan User Agent ke payload jika belum ada
    const finalPayload = {
      ...payload,
      data: [{
        ...event,
        user_data: {
          ...event.user_data,
          client_ip_address: userIp,
          client_user_agent: userAgent,
        }
      }],
    };

    // Log payload (redact sensitive info)
    console.log('[Meta API Route] Sending event:', {
      event_name: event.event_name,
      event_id: event.event_id,
      event_time: event.event_time,
      action_source: event.action_source,
      custom_data: event.custom_data,
      user_data_fields: Object.keys(event.user_data || {}),
    });

    // Send ke Meta Conversions API
    const apiUrl = `${metaPixelConfig.baseUrl}/${metaPixelConfig.pixelId}/events?access_token=${metaPixelConfig.accessToken}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalPayload),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('[Meta API Route] Meta error:', result);
      return NextResponse.json(
        { error: 'Failed to send event to Meta', details: result },
        { status: response.status }
      );
    }

    console.log('[Meta API Route] Success:', result);
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('[Meta API Route] Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}