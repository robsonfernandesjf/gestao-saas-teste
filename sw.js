const sharp = require('sharp');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zzqoxpgidalxjxhgyuot.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cW94cGdpZGFseGp4aGd5dW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NDI0NjIsImV4cCI6MjA5NzIxODQ2Mn0.FX-9C-u4xjDY1CS8vwOhbfIDPMGmHSbQUFpvxmQ9j5M';

function slugSeguro(valor) {
  return String(valor || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

async function buscarLoja(slug) {
  const url = `${SUPABASE_URL}/rest/v1/lojas_publico?id=eq.${encodeURIComponent(slug)}&select=nome,logo_base64,cor_accent&limit=1`;
  const resposta = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
  });
  if (!resposta.ok) throw new Error(`Supabase ${resposta.status}`);
  const dados = await resposta.json();
  return dados[0] || null;
}

function bufferDaLogo(valor) {
  if (!valor || typeof valor !== 'string') return null;
  const data = valor.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/);
  if (data) return Buffer.from(data[1], 'base64');
  return null;
}

function fallbackSvg(nome, cor, tamanho) {
  const inicial = String(nome || 'L').trim().charAt(0).toUpperCase() || 'L';
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tamanho}" height="${tamanho}" viewBox="0 0 ${tamanho} ${tamanho}"><rect width="100%" height="100%" rx="${Math.round(tamanho * .18)}" fill="${cor || '#B56B7A'}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="${Math.round(tamanho * .48)}" font-weight="700" fill="#fff">${inicial}</text></svg>`);
}

module.exports = async function handler(req, res) {
  const slug = slugSeguro(req.query.loja);
  const size = [180, 192, 512].includes(Number(req.query.size)) ? Number(req.query.size) : 192;
  if (!slug) return res.status(400).send('Loja não informada');

  let loja = null;
  try { loja = await buscarLoja(slug); } catch (erro) { console.error(erro); }

  const logo = bufferDaLogo(loja?.logo_base64) || fallbackSvg(loja?.nome || 'LegadoERP', loja?.cor_accent, size);
  const maskable = req.query.maskable === '1';
  const margem = maskable ? Math.round(size * 0.16) : Math.round(size * 0.08);

  try {
    const png = await sharp(logo)
      .resize(size - margem * 2, size - margem * 2, { fit: 'contain', withoutEnlargement: false })
      .extend({ top: margem, bottom: margem, left: margem, right: margem, background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=86400');
    res.status(200).send(png);
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Falha ao gerar ícone');
  }
};
