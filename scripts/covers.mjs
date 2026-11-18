// Renders the work-tile covers (1200×900) to public/img/covers/<slug>.webp.
// Each cover: company and my role, the headline, one sourced result, and the real screens.
// Run: npm run covers
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const browser = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((b) => b && existsSync(b));
if (!browser) throw new Error('No Chrome or Edge found; set CHROME_PATH.');

const img = (n) => pathToFileURL(resolve('public/img', `${n}.webp`)).href;

const COVERS = [
  {
    slug: 'tello', eyebrow: 'Verizon · tello.ai · Experience Designer II',
    title: 'A plan in <em>2.8 minutes,</em><br>not 15.', n: '+7%', label: 'Conversion · A/B test',
    layout: 'phones', shots: ['p/tello/02-plan-cards', 'p/tello/04-phone-selection', 'p/tello/10-sim-card-scan', 'p/tello/12-configure-steps'],
  },
  {
    slug: 'bang-olufsen', eyebrow: 'HARMAN · Audio by Bang & Olufsen · Experience Designer',
    title: 'Shaping sound <em>by feel,</em><br>not by equaliser.', n: '−40%', label: 'Interaction time',
    layout: 'pair', shots: ['p/bang-olufsen/05-beosonic-sound-circle', 'p/bang-olufsen/08-beosonic-ai-result'],
  },
  {
    slug: 'harman-kardon', eyebrow: 'HARMAN · Harman Kardon One Audio · Associate Experience Designer',
    title: 'Making sound<br>you can <em>see.</em>', n: '65%', label: 'Faster device setup',
    layout: 'pair', shots: ['p/harman-kardon/01-home', 'p/harman-kardon/06-seatsonic-seat-audio'],
  },
  {
    slug: 'plug', eyebrow: 'Plug · Founder and product designer',
    title: 'Every overpayment,<br><em>recovered.</em>', n: '39', label: 'Screens · 7 flows',
    layout: 'pair', shots: ['plug-overview', 'plug-finding'],
  },
  {
    slug: 'bracket', eyebrow: 'Bracket · Founder and product designer',
    title: 'An AI memory<br>people can <em>trust.</em>', n: '#9', label: 'On Product Hunt',
    layout: 'pair', shots: ['p/bracket/04-overview', 'p/bracket/05-change-review'],
  },
  {
    slug: 'darpan', eyebrow: 'DarpanAI · Founder and product designer',
    title: 'From an idea to a finished<br>reel, with <em>no editing.</em>', n: '65', label: 'Creators in 2 weeks',
    layout: 'phones', shots: ['p/darpan/04-shot-plan', 'p/darpan/09-take-review', 'p/darpan/12-reel-ready'],
  },
  {
    slug: 'relayos', eyebrow: 'RelayOS · Voice AI for manufacturers',
    title: 'One voice note to recover<br>a <em>delayed order.</em>', n: '46', label: 'Screens · full handoff',
    layout: 'wide-phone', shots: ['p/relayos/04-web-run-decision', 'p/relayos/03-whatsapp-plan-approval'],
  },
];

const css = `
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 900px; overflow: hidden; }
body { position: relative; font-family: Geist, sans-serif; color: #f3f6f4;
  background: radial-gradient(75% 60% at 100% 100%, #104332 0%, rgba(16,67,50,0) 70%), #0f1411; }
.eyebrow { position: absolute; left: 72px; top: 70px; max-width: 760px; font: 400 15px/1.5 'Geist Mono', monospace; letter-spacing: .13em; text-transform: uppercase; color: #9ef0c6; }
h1 { position: absolute; left: 72px; top: 112px; max-width: 820px; font-weight: 500; font-size: 64px; line-height: 1.04; letter-spacing: -0.04em; }
h1 em { font: italic 400 1.08em/1 Newsreader, serif; letter-spacing: -0.02em; color: #9ef0c6; }
.stat { position: absolute; right: 72px; top: 70px; text-align: right; }
.stat b { display: block; font-weight: 600; font-size: 60px; line-height: 1; letter-spacing: -0.04em; color: #c8ff4d; }
.stat span { display: block; margin-top: 10px; font: 400 14px/1.3 'Geist Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: #9aa59f; }
.shot { position: absolute; border-radius: 12px; box-shadow: 0 30px 70px rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.08); }
/* phones: a straight row, cut by the bottom edge */
.phones { position: absolute; left: 0; right: 0; top: 330px; display: flex; justify-content: center; gap: 28px; }
.phones img { width: 230px; border-radius: 26px; box-shadow: 0 30px 70px rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.08); }
.phones.n3 img { width: 250px; }
.phones img:nth-child(even) { margin-top: 40px; }
/* pair: a large screen and a second one overlapping it */
.pair .a { width: 800px; left: 72px; top: 350px; transform: perspective(1800px) rotateY(10deg) rotateX(3deg); transform-origin: left center; }
.pair .b { width: 520px; right: 56px; top: 440px; transform: perspective(1800px) rotateY(-9deg) rotateX(3deg); }
/* wide + phone */
.wide-phone .a { width: 780px; left: 72px; top: 350px; transform: perspective(1800px) rotateY(9deg) rotateX(3deg); transform-origin: left center; }
.wide-phone .b { width: 250px; right: 110px; top: 330px; border-radius: 26px; }
`;

const page = (c) => {
  let shots = '';
  if (c.layout === 'phones') shots = `<div class="phones n${c.shots.length}">${c.shots.map((s) => `<img src="${img(s)}" alt="">`).join('')}</div>`;
  else shots = `<div class="${c.layout}"><img class="shot a" src="${img(c.shots[0])}" alt=""><img class="shot b" src="${img(c.shots[1])}" alt=""></div>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono&family=Newsreader:ital,opsz,wght@1,6..72,400&display=block" rel="stylesheet">
<style>${css}</style></head><body>
<p class="eyebrow">${c.eyebrow}</p>
<h1>${c.title}</h1>
<p class="stat"><b>${c.n}</b><span>${c.label}</span></p>
${shots}
</body></html>`;
};

const only = process.argv.slice(2);
const dir = mkdtempSync(join(tmpdir(), 'covers-'));
try {
  for (const c of COVERS.filter((x) => !only.length || only.includes(x.slug))) {
    const html = join(dir, `${c.slug}.html`);
    const png = join(dir, `${c.slug}.png`);
    writeFileSync(html, page(c));
    execFileSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
      '--force-device-scale-factor=1', '--window-size=1200,900', '--virtual-time-budget=8000', `--screenshot=${png}`, pathToFileURL(html).href]);
    const out = resolve('public/img/covers', `${c.slug}.webp`);
    const r = await sharp(png).webp({ quality: 86, effort: 5 }).toFile(out);
    console.log(`${c.slug}.webp  ${Math.round(r.size / 1024)} KB`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
