# LegadoERP PWA multitenant — v33

## Arquivos
- `index.html`: ERP com manifesto real por loja e registro do service worker.
- `api/pwa/manifest.js`: manifesto específico por slug.
- `api/pwa/icon.js`: gera PNG 180, 192 e 512 usando a logo cadastrada.
- `public/sw.js`: service worker mínimo, sem cache do ERP.
- `package.json`: inclui o `sharp`, usado apenas para gerar os ícones.
- `vercel.json`: cabeçalhos necessários.

## Implantação segura
1. Copie os arquivos e pastas para a raiz do projeto atual na Vercel.
2. Substitua o HTML principal pelo `index.html` deste pacote.
3. Não remova outros arquivos do projeto.
4. Faça o deploy.
5. Teste primeiro em `/vitrine-legado`.

As funções aceitam as variáveis opcionais `SUPABASE_URL` e `SUPABASE_ANON_KEY`. Se não forem configuradas, usam os mesmos dados públicos já existentes no HTML.

## Teste
Abra:
- `/api/pwa/manifest?loja=vitrine-legado`
- `/api/pwa/icon?loja=vitrine-legado&size=192`
- `/sw.js`

Depois, no Android, remova a instalação/atalho antigo, limpe os dados do site e abra novamente `https://app.legadoerp.com.br/vitrine-legado`.
