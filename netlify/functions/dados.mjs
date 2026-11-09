// Banco de dados do casal: Netlify Blobs (criado automaticamente pelo Netlify, sem configuração)
// GET  /api/dados?ping=1          -> { ok: true }
// GET  /api/dados?codigo=XXXX     -> dados salvos (ou null)
// PUT  /api/dados?codigo=XXXX     -> salva o JSON enviado
import { getStore } from '@netlify/blobs';

const CODIGO = /^[a-z0-9-]{8,64}$/i;
const LIMITE = 2_000_000; // 2 MB
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

export default async (req) => {
  const url = new URL(req.url);
  if (req.method === 'GET' && url.searchParams.get('ping')) return json({ ok: true });

  const codigo = (url.searchParams.get('codigo') || '').trim().toLowerCase();
  if (!CODIGO.test(codigo)) return json({ erro: 'código inválido' }, 400);

  const store = getStore({ name: 'casal-fit', consistency: 'strong' });

  if (req.method === 'GET') {
    const dados = await store.get(codigo, { type: 'json' });
    return json(dados ?? null);
  }

  if (req.method === 'PUT') {
    const corpo = await req.text();
    if (corpo.length > LIMITE) return json({ erro: 'dados grandes demais' }, 413);
    let dados;
    try { dados = JSON.parse(corpo); } catch { return json({ erro: 'JSON inválido' }, 400); }
    if (!dados || dados.v !== 1) return json({ erro: 'formato inválido' }, 400);
    await store.setJSON(codigo, dados);
    return json({ ok: true, em: Date.now() });
  }

  return json({ erro: 'método não permitido' }, 405);
};

export const config = { path: '/api/dados' };
