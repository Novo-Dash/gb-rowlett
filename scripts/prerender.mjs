// ─────────────────────────────────────────────────────────────────────────────
// prerender.mjs — pré-render da "/" depois do `vite build`.
//
// • dist/index.html → HTML já renderizado (o React só hidrata): o hero, o poster
//   e o H1 pintam sem esperar o JS (LCP no celular).
// • O JS de entrada só começa a baixar DEPOIS que o poster do hero decodificou
//   (teto de 2 s). Um toque em qualquer botão antes disso fica guardado e é
//   reexecutado quando o React assume (Root.tsx → HydrationReplay).
// • <meta name="opening-at"> + script de uma linha: passada a data de abertura,
//   html.offer-off antes da primeira pintura. Sem data confirmada, nada entra.
// • Modo client (VITE_UX_MODE=client): robots index,follow + bloco de tracking
//   do kit nd (só com IDs reais) + a lista de pendências (publishWarnings) no
//   terminal. Modo prospect: noindex, sem tracking.
// Os .br/.gz do index são refeitos aqui (o plugin de compressão roda antes).
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const serverEntry = path.join(root, 'dist-server', 'entry-server.js')

const tpl = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
if (!tpl.includes('<div id="root"></div>')) throw new Error('prerender: <div id="root"></div> não encontrado em dist/index.html')

const { render, openingISO, uxMode, tracking, publishWarnings } = await import(pathToFileURL(serverEntry).href)
const appHtml = render()
const client = uxMode === 'client'

// LCP: a foto do hero (quadrada no celular, 16:9 no tablet, a 2550×1080 do Adryan a partir de 1024px)
let head = `    <link rel="preload" as="image" type="image/avif" media="(max-width: 767px)"
      imagesrcset="/img/film-m-540.avif 540w, /img/film-m-760.avif 760w, /img/film-m-1080.avif 1080w" imagesizes="100vw" fetchpriority="high" />
    <link rel="preload" as="image" type="image/avif" media="(min-width: 768px) and (max-width: 1023px)"
      imagesrcset="/img/hero-d-1280.avif 1280w, /img/hero-d-1920.avif 1920w" imagesizes="100vw" fetchpriority="high" />
    <link rel="preload" as="image" type="image/avif" media="(min-width: 1024px)"
      imagesrcset="/img/hero-w-1920.avif 1920w, /img/hero-w-2550.avif 2550w" imagesizes="max(100vw, 236svh)" fetchpriority="high" />
`
if (openingISO) {
  head += `    <meta name="opening-at" content="${openingISO}" />
    <script>try{if(Date.now()>Date.parse(document.querySelector('meta[name="opening-at"]').content))document.documentElement.classList.add('offer-off')}catch(e){}</script>
`
}

// Bloco de tracking do kit (Pixel, GA4/Ads, Clarity), só em client e só com ID.
let trackingBlock = ''
if (client && tracking && (tracking.pixel || tracking.ga4 || tracking.ads || tracking.clarity)) {
  const nd = JSON.stringify({ pixel: tracking.pixel, ga4: tracking.ga4, ads: tracking.ads, clarity: tracking.clarity })
  trackingBlock = `    <!-- nd:tracking:start (Novo Dash kit; gerado de src/nd/client.ts) -->
    <script>window.__ND=${nd}</script>
    <script>
      (function (n) {
        if (n.pixel) {
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', n.pixel);
          fbq('track', 'PageView');
        }
        var loader = n.ads || n.ga4;
        if (loader) {
          var s = document.createElement('script');
          s.async = true;
          s.src = 'https://www.googletagmanager.com/gtag/js?id=' + loader;
          document.head.appendChild(s);
          window.dataLayer = window.dataLayer || [];
          window.gtag = function () { window.dataLayer.push(arguments); };
          gtag('js', new Date());
          if (n.ga4) gtag('config', n.ga4);
          if (n.ads) gtag('config', n.ads);
        }
        if (n.clarity) {
          (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",n.clarity);
        }
      })(window.__ND);
    </script>
    <!-- nd:tracking:end -->
`
}

const entry = tpl.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/)
if (!entry) throw new Error('prerender: script de entrada não encontrado')
const preloads = [...tpl.matchAll(/<link rel="modulepreload" crossorigin href="([^"]+)">/g)].map((m) => m[1])
const loader = `<script>(function(){var q=window.__gbq=[];document.addEventListener('click',function(e){if(window.__gbh)return;var t=e.target.closest&&e.target.closest('button');if(t)q.push(t)},true);var d=0;function go(){if(d)return;d=1;${JSON.stringify(preloads)}.forEach(function(h){var l=document.createElement('link');l.rel='modulepreload';l.crossOrigin='';l.href=h;document.head.appendChild(l)});var s=document.createElement('script');s.type='module';s.crossOrigin='';s.src=${JSON.stringify(entry[1])};document.head.appendChild(s)}function later(){requestAnimationFrame(function(){setTimeout(go,0)})}var i=document.querySelector('.hero__poster img');if(!i||i.complete)later();else{var f=function(){(i.decode?i.decode():Promise.resolve()).then(later,later)};i.addEventListener('load',f,{once:true});i.addEventListener('error',later,{once:true})}setTimeout(go,2000)})()</script>`

let page = tpl
  .replace(entry[0], '')
  .replace(/\s*<link rel="modulepreload" crossorigin href="[^"]+">/g, '')
  .replace('<!-- nd:tracking:slot — o pré-render injeta o bloco do kit aqui, só em modo client e só com IDs reais. -->', trackingBlock.trimEnd())
  .replace('</head>', `${head}  </head>`)
  .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  .replace('</body>', `  ${loader}\n  </body>`)

if (client) {
  if (!page.includes('<meta name="robots" content="noindex, nofollow" />')) throw new Error('prerender: meta robots não encontrada')
  page = page.replace('<meta name="robots" content="noindex, nofollow" />', '<meta name="robots" content="index, follow" />')
}

// robots.txt e sitemap.xml conforme o modo
const pub = (name, body) => fs.writeFileSync(path.join(dist, name), body)
pub('robots.txt', client ? 'User-agent: *\nAllow: /\nDisallow: /memory/\nSitemap: https://gbrowlett.com/sitemap.xml\n' : 'User-agent: *\nDisallow: /\n')
pub(
  'sitemap.xml',
  client
    ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://gbrowlett.com/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`
    : `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n`,
)

const write = (name, html) => {
  const file = path.join(dist, name)
  fs.writeFileSync(file, html)
  fs.writeFileSync(file + '.br', zlib.brotliCompressSync(html))
  fs.writeFileSync(file + '.gz', zlib.gzipSync(html, { level: 9 }))
}
write('index.html', page)
fs.rmSync(path.join(root, 'dist-server'), { recursive: true, force: true })
// Publicação: as pendências que saíram da página voltam aqui, como aviso (não trava o build).
if (client && publishWarnings?.length) {
  const bar = '─'.repeat(72)
  console.warn(`\n\x1b[33m${bar}\n  ATENÇÃO, ainda sem confirmar (${publishWarnings.length}) · src/data/site.ts → publishWarnings\n${bar}\x1b[0m`)
  publishWarnings.forEach((w, i) => console.warn(`\x1b[33m  ${i + 1}. ${w}\x1b[0m`))
  console.warn(`\x1b[33m${bar}\x1b[0m\n`)
}
console.log(`prerender: index.html ${(page.length / 1024).toFixed(1)} KB (raiz ${(appHtml.length / 1024).toFixed(1)} KB) · modo ${client ? 'client' : 'prospect'}`)
