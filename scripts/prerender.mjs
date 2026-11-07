// Runs after `vite build` and the SSR build (see package.json "build").
// Writes one HTML file per page with its content and link-preview tags, a 404 page,
// and sitemap.xml, so each page arrives ready to read and shares as a preview card.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve('dist');
const { render, cases, profile, home } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href);

const SITE = profile.site; // https://sakshamshukla.com
const IMAGE = `${SITE}/og.jpg`;
const template = readFileSync(resolve(dist, 'index.html'), 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** First sentences of `text`, kept under ~200 characters for preview cards. */
const brief = (text) => {
  let out = '';
  for (const s of text.match(/[^.!?]+[.!?]+/g) ?? [text]) {
    if (out && (out + s).length > 200) break;
    out += s;
  }
  return out.trim();
};

const pages = [
  { path: '/', title: 'Saksham Shukla — Product Designer', description: home.sub },
  { path: '/about', title: 'About — Saksham Shukla', description: profile.summary },
  { path: '/resume', title: 'Résumé — Saksham Shukla', description: `One-page résumé. ${profile.summary}` },
  ...cases.map((c) => ({ path: `/work/${c.slug}`, title: `${c.name} — Saksham Shukla`, description: brief(c.summary) })),
];

function head({ path, title, description }, notFound = false) {
  const url = SITE + (path === '/' ? '/' : path);
  return [
    notFound ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Saksham Shukla" />',
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    notFound ? '' : `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${IMAGE}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:alt" content="Saksham Shukla, product designer: AI, conversational and in-vehicle products" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${IMAGE}" />`,
  ].filter(Boolean).join('\n    ');
}

async function page(meta, renderPath, file, notFound = false) {
  let body = await render(renderPath);
  // React emits image preloads at the start of the markup; they belong in <head>,
  // and left inside #root they would break hydration.
  const preloads = body.match(/^(?:<link [^>]*\/>)+/)?.[0] ?? '';
  body = body.slice(preloads.length);
  const html = template
    .replace('</head>', `${preloads}
  </head>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(meta.description)}" />\n    ${head(meta, notFound)}`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  if (!html.includes(esc(meta.title)) || html.includes('<div id="root"></div>')) throw new Error(`Pre-render failed for ${renderPath}`);
  const out = resolve(dist, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`  ${file}  ${Math.round(html.length / 1024)} KB`);
}

for (const p of pages) await page(p, p.path, p.path === '/' ? 'index.html' : `${p.path.slice(1)}/index.html`);
await page({ path: '/404', title: 'Not found — Saksham Shukla', description: 'This page isn’t in the dossier.' }, '/404', '404.html', true);

writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${SITE}${p.path === '/' ? '/' : p.path}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
);
rmSync(resolve('dist-ssr'), { recursive: true, force: true });
console.log(`Pre-rendered ${pages.length} pages + 404.html, wrote sitemap.xml`);
