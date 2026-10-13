// Netlify Function: protected, manual Telegram smoke test (NOT a listing monitor).
export default async (request) => {
  const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
  const reply = (status, data) => new Response(JSON.stringify(data), { status, headers });
  if (request.method !== 'POST') return reply(405, { error: 'Metodo non consentito' });
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const secret = process.env.CASARADAR_ADMIN_KEY;
  if (!token || !chatId || !secret || secret.length < 20) return reply(503, { error: 'Variabili server non configurate' });
  const supplied = request.headers.get('x-casaradar-admin-key') || '';
  // Compare without leaking the expected key. Require long random key and rate-limit at edge if exposing broadly.
  if (supplied !== secret) return reply(403, { error: 'Chiave non valida' });
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: '🏠 CasaRadar Roma — test riuscito!\nIl collegamento Telegram funziona.\n\n⚠️ Il monitoraggio degli annunci non è ancora attivo.' }),
      signal: AbortSignal.timeout(10000)
    });
    const result = await response.json();
    if (!response.ok || !result.ok) return reply(502, { error: 'Telegram ha rifiutato il messaggio. Verifica token e chat ID.' });
    return reply(200, { ok: true, message: 'Messaggio di prova inviato su Telegram' });
  } catch { return reply(502, { error: 'Non è stato possibile contattare Telegram' }); }
};
