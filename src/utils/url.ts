/**
 * The API hands back `stream_url` over plain HTTP, which Android blocks by
 * default. Upgrading the scheme is the primary fix; `usesCleartextTraffic`
 * in app.json is the fallback.
 */
export const toHttps = (url: string): string => url.replace(/^http:\/\//i, 'https://');
