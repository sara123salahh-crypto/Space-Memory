// Cloudflare Worker: forwards chat requests to COSMO, keeps the key secret, adds CORS.
// Needs ONE secret named COSMO_KEY (Settings > Variables and Secrets).
const COSMO_URL = 'https://collabs.corexai.online/apis/cosmo/v1/chat/completions';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};
const reply = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (request.method !== 'POST') return reply({ error: { message: 'POST only' } }, 405);

    let body;
    try { body = await request.json(); } catch { return reply({ error: { message: 'Bad JSON' } }, 400); }
    const message = String(body.message || '').slice(0, 6000);
    if (!message) return reply({ error: { message: 'Empty message' } }, 400);

    const upstream = await fetch(COSMO_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + env.COSMO_KEY },
      body: JSON.stringify({ model: 'cosmo', message })
    });
    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: { ...CORS, 'Content-Type': 'application/json' }
    });
  }
};
