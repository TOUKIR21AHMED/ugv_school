// Cloudflare Pages Function: forward existing /api/* calls to Express on Render.
const BACKEND = 'https://united-school-api.onrender.com';

export async function onRequest({ request }) {
  const incoming = new URL(request.url);
  const target = new URL(incoming.pathname + incoming.search, BACKEND);
  try {
    const headers = new Headers(request.headers);
    headers.delete('host');
    const upstream = await fetch(new Request(target, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    }));
    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.delete('access-control-allow-origin');
    responseHeaders.delete('access-control-allow-credentials');
    responseHeaders.set('cache-control', 'no-store');
    return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: responseHeaders });
  } catch (error) {
    console.error('School API proxy failed:', String(error));
    return Response.json({ message: 'API connection temporarily unavailable' }, { status: 502 });
  }
}
