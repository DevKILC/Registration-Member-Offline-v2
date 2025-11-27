
export const metaPixelConfig = {
  version: 'v18.0',
  pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID!,
  accessToken: process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN!,
  baseUrl: 'https://graph.facebook.com',
};

export const tiktokPixelConfig = {
    pixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID!,
    accessToken: process.env.NEXT_PUBLIC_TIKTOK_ACCESS_TOKEN!,
    baseUrl: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
}
