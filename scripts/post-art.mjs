// Renders the images for the general design posts (1600×1000 webp) to public/img/posts/<name>.webp.
// Each is a small design explainer in the site's palette. Run: node scripts/post-art.mjs [name…]
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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

// WCAG contrast ratio, computed rather than typed in.
const lum = (hex) => {
  const c = hex.match(/\w\w/g).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

const ARTS = {
  spacing: {
    tone: 'light', eyebrow: 'UI design · Spacing', title: 'Spacing is <em>rhythm,</em><br>not a number.',
    body: `<div class="bars">${[4, 8, 12, 16, 24, 32, 48, 64].map((n) => `<div class="bar"><i style="height:${n * 4.2}px"></i><span>${n}</span></div>`).join('')}</div>
      <p class="note">One base unit, a few steps, used the same way everywhere.</p>`,
  },
  type: {
    tone: 'dark', eyebrow: 'UI design · Typography', title: 'Fewer sizes.<br><em>Clearer</em> hierarchy.',
    body: `<div class="type">${[['Display', 56], ['Title', 36], ['Heading', 24], ['Body', 17], ['Caption', 13]].map(([k, n]) => `<div class="trow"><span class="tk">${k} · ${n}</span><span class="tv" style="font-size:${n}px">The quick brown fox</span></div>`).join('')}</div>`,
  },
  loading: {
    tone: 'light', eyebrow: 'UX · Loading states', title: 'Show what’s <em>coming,</em><br>not just that it’s coming.',
    body: `<div class="duo">
      <div class="mock"><div class="spin"></div><p class="cap">Spinner: something is happening</p></div>
      <div class="mock sk"><div class="sk-row"><i class="c"></i><div><i class="l w60"></i><i class="l w40"></i></div></div><i class="l w90"></i><i class="l w80"></i><i class="l w50"></i><i class="blk"></i><p class="cap">Skeleton: this is what will load</p></div>
    </div>`,
  },
  contrast: {
    tone: 'dark', eyebrow: 'Accessibility · Contrast', title: 'Light grey text is<br>a <em>readability</em> bug.',
    body: `<div class="swatches">${['#AAAAAA', '#8A8A8A', '#767676', '#141615'].map((c) => { const r = ratio(c, '#FFFFFF'); return `<div class="sw"><p style="color:${c}">Aa</p><span>${c} on white</span><b class="${r >= 4.5 ? 'ok' : 'no'}">${r.toFixed(2)}:1 ${r >= 4.5 ? '✓' : '✕'}</b></div>`; }).join('')}</div>
      <p class="note dk">WCAG AA: 4.5:1 for body text, 3:1 for large text and UI components.</p>`,
  },
  targets: {
    tone: 'light', eyebrow: 'UX · Touch targets', title: 'The icon is 24px.<br>The <em>target</em> isn’t.',
    body: `<div class="targets">
      <div class="tg"><div class="hit h44"><div class="ic"></div></div><b>44 × 44 pt</b><span>Apple HIG</span></div>
      <div class="tg"><div class="hit h48"><div class="ic"></div></div><b>48 × 48 dp</b><span>Material Design</span></div>
      <div class="tg"><div class="hit h24"><div class="ic"></div></div><b>24 × 24 px</b><span>WCAG 2.2 minimum</span></div>
    </div>`,
  },
  tokens: {
    tone: 'dark', eyebrow: 'Design systems · Tokens', title: 'Name tokens by <em>role,</em><br>not by colour.',
    body: `<div class="cols">
      <div class="col no"><p class="h">Don’t</p>${['green-500', 'gray-200', 'blue-600', 'red-400'].map((t) => `<code>${t}</code>`).join('')}</div>
      <div class="arrow">→</div>
      <div class="col ok"><p class="h">Do</p>${[['#1a9b55', 'status.success'], ['#e6e6e1', 'border.subtle'], ['#0f1411', 'action.primary'], ['#d64545', 'status.error']].map(([c, t]) => `<code><i style="background:${c}"></i>${t}</code>`).join('')}</div>
    </div>`,
  },
  states: {
    tone: 'light', eyebrow: 'UI design · Components', title: 'A button has <em>six</em> states,<br>not one.',
    body: `<div class="btns">${[['Default', ''], ['Hover', 'hv'], ['Pressed', 'pr'], ['Focus', 'fc'], ['Disabled', 'ds'], ['Loading', 'ld']].map(([k, c]) => `<div class="bs"><span class="btn ${c}">${c === 'ld' ? '<i class="mini"></i>' : 'Save changes'}</span><p>${k}</p></div>`).join('')}</div>`,
  },
  empty: {
    tone: 'dark', eyebrow: 'UX · Empty states', title: 'An empty state is<br>an <em>onboarding</em> screen.',
    body: `<div class="duo">
      <div class="mock lt bad"><p class="nd">No data</p><p class="cap">Dead end</p></div>
      <div class="mock lt good"><div class="eico"></div><p class="et">No invoices yet</p><p class="ed">Connect your accounting tool and every payment gets checked automatically.</p><span class="btn">Connect a source</span><p class="cap">Next step</p></div>
    </div>`,
  },
  errors: {
    tone: 'light', eyebrow: 'UX writing · Errors', title: 'Every error answers<br><em>three</em> questions.',
    body: `<div class="err">
      <div class="ecard"><p class="et">Couldn’t upload invoices.csv</p><p class="ed">Row 14 is missing an amount, so nothing was imported.</p><div class="eb"><span class="btn">Fix row 14</span><span class="btn gh">Upload again</span></div></div>
      <ol class="ann"><li><b>What happened</b>Couldn’t upload the file</li><li><b>Why</b>Row 14 has no amount</li><li><b>What now</b>Fix it, or upload again</li></ol>
    </div>`,
  },
  trust: {
    tone: 'dark', eyebrow: 'AI UX · Trust patterns', title: 'Five patterns that make<br>AI <em>trustworthy.</em>',
    body: `<div class="chips">
      <span class="chip"><i class="dot g"></i>Confidence · High</span>
      <span class="chip"><i class="dot b"></i>Source · Gmail, 09:41</span>
      <span class="chip">Why this?</span>
      <span class="chip">↶ Undo</span>
      <span class="chip lime">Approve before it acts</span>
    </div>
    <div class="aicard"><p class="ak">AI suggestion</p><p class="at">Launch date moved to 14 March</p><p class="ad">From Sarah’s email · Confidence: high</p><div class="eb"><span class="btn lime">Accept</span><span class="btn gh dk">Review source</span></div></div>`,
  },
  microcopy: {
    tone: 'light', eyebrow: 'UX writing · Buttons', title: 'A button should say<br>what <em>happens next.</em>',
    body: `<div class="cols lt">
      <div class="col no"><p class="h">Vague</p><span class="btn gh">Submit</span><span class="btn gh">OK</span><span class="btn gh">Yes</span></div>
      <div class="arrow">→</div>
      <div class="col ok"><p class="h">Specific</p><span class="btn">Send invoice</span><span class="btn red">Delete 3 files</span><span class="btn gh">Keep editing</span></div>
    </div>`,
  },
};

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1200px; height: 750px; overflow: hidden; }
body { position: relative; font-family: Geist, sans-serif; }
body.dark { color: #f3f6f4; background: radial-gradient(75% 70% at 100% 100%, #104332 0%, rgba(16,67,50,0) 70%), #0f1411; }
body.light { color: #141615; background: radial-gradient(70% 70% at 100% 100%, #e3f3e9 0%, rgba(227,243,233,0) 70%), #f6f6f3; }
.eyebrow { position: absolute; left: 64px; top: 56px; font: 400 14px/1 'Geist Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: #1a9b55; }
.dark .eyebrow { color: #9ef0c6; }
h1 { position: absolute; left: 64px; top: 92px; font-weight: 500; font-size: 52px; line-height: 1.06; letter-spacing: -0.04em; }
h1 em { font: italic 400 1.08em/1 Newsreader, serif; letter-spacing: -0.02em; color: #1a9b55; }
.dark h1 em { color: #9ef0c6; }
.stage { position: absolute; left: 64px; right: 64px; top: 270px; bottom: 56px; }
.note { position: absolute; left: 0; bottom: 0; font: 400 15px/1.4 'Geist Mono', monospace; color: #6b6f6c; }
.note.dk { color: #9aa59f; }
.btn { display: inline-flex; align-items: center; justify-content: center; height: 48px; padding: 0 22px; border-radius: 999px; background: #0f1411; color: #fff; font: 500 17px/1 Geist, sans-serif; }
.btn.gh { background: transparent; color: #141615; box-shadow: inset 0 0 0 1.5px #cfcfc8; }
.btn.gh.dk { color: #f3f6f4; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.25); }
.btn.lime { background: #c8ff4d; color: #0f1411; }
.btn.red { background: #c93a3a; }
/* spacing */
.bars { display: flex; align-items: flex-end; gap: 30px; height: 300px; padding-bottom: 40px; }
.bar { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.bar i { display: block; width: 72px; border-radius: 10px; background: linear-gradient(180deg, #9ef0c6, #1a9b55); }
.bar span { font: 500 18px/1 'Geist Mono', monospace; color: #3f3f3d; }
/* type */
.type { display: grid; gap: 10px; }
.trow { display: grid; grid-template-columns: 210px 1fr; align-items: baseline; gap: 20px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,.1); }
.tk { font: 400 14px/1 'Geist Mono', monospace; letter-spacing: .1em; text-transform: uppercase; color: #9aa59f; }
.tv { font-weight: 500; letter-spacing: -0.02em; line-height: 1.05; white-space: nowrap; }
/* duo mocks */
.duo { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; height: 100%; }
.mock { position: relative; border-radius: 22px; background: #fff; box-shadow: 0 1px 0 #e6e6e1, 0 24px 50px rgba(15,20,17,.08); padding: 34px 32px 60px; display: flex; flex-direction: column; gap: 12px; }
.cap { position: absolute; left: 32px; bottom: 22px; font: 400 14px/1 'Geist Mono', monospace; letter-spacing: .06em; text-transform: uppercase; color: #6b6f6c; }
.spin { margin: auto; width: 64px; height: 64px; border-radius: 50%; border: 6px solid #e6e6e1; border-top-color: #1a9b55; }
.sk-row { display: flex; gap: 14px; align-items: center; margin-bottom: 8px; }
.sk-row > div { flex: 1; display: grid; gap: 10px; }
.sk i { display: block; background: linear-gradient(90deg, #ececE8, #f4f4f1); border-radius: 8px; }
.sk .c { width: 52px; height: 52px; border-radius: 50%; }
.sk .l { height: 14px; } .w40 { width: 40%; } .w50 { width: 50%; } .w60 { width: 60%; } .w80 { width: 80%; } .w90 { width: 90%; }
.sk .blk { height: 90px; border-radius: 14px; margin-top: 6px; }
.mock.lt { background: #fff; color: #141615; }
.bad { align-items: center; justify-content: center; }
.nd { font-size: 20px; color: #9a9a96; }
.good { align-items: center; text-align: center; justify-content: center; }
.eico { width: 64px; height: 64px; border-radius: 18px; background: #eef7f1; box-shadow: inset 0 0 0 1.5px #bfe3cc; }
.et { font-weight: 600; font-size: 22px; letter-spacing: -0.02em; }
.ed { max-width: 380px; font-size: 16px; line-height: 1.45; color: #55595a; }
/* contrast */
.swatches { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.sw { border-radius: 22px; background: #fff; padding: 34px 28px; gap: 16px; color: #141615; display: grid; gap: 10px; }
.sw p { font-weight: 600; font-size: 104px; line-height: 1; letter-spacing: -0.03em; }
.sw span { font: 400 15px/1 'Geist Mono', monospace; color: #55595a; }
.sw b { font: 600 22px/1 'Geist Mono', monospace; } .sw .ok { color: #1a9b55; } .sw .no { color: #c93a3a; }
/* targets */
.targets { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; height: 100%; }
.tg { border-radius: 22px; background: #fff; box-shadow: 0 1px 0 #e6e6e1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
.hit { display: grid; place-items: center; border: 2px dashed #1a9b55; border-radius: 12px; background: rgba(26,155,85,.08); margin-bottom: 14px; }
.h44 { width: 132px; height: 132px; } .h48 { width: 144px; height: 144px; } .h24 { width: 72px; height: 72px; border-color: #c49a1a; background: rgba(196,154,26,.08); }
.ic { width: 72px; height: 72px; border-radius: 10px; background: #0f1411; }
.h24 .ic { width: 52px; height: 52px; }
.tg b { font-size: 22px; letter-spacing: -0.02em; } .tg span { font: 400 14px/1 'Geist Mono', monospace; color: #6b6f6c; text-transform: uppercase; letter-spacing: .08em; }
/* tokens + microcopy columns */
.cols { display: grid; grid-template-columns: 1fr 80px 1fr; align-items: center; height: 100%; max-width: 820px; }
.col { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.col .h { font: 400 14px/1 'Geist Mono', monospace; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 4px; }
.col.no .h { color: #ff8a80; } .col.ok .h { color: #9ef0c6; }
.cols.lt .col.no .h { color: #c93a3a; } .cols.lt .col.ok .h { color: #1a9b55; }
.col code { display: inline-flex; align-items: center; gap: 12px; padding: 12px 18px; border-radius: 12px; background: rgba(255,255,255,.07); font: 400 20px/1 'Geist Mono', monospace; color: #f3f6f4; }
.col.no code { color: #9aa59f; text-decoration: line-through; text-decoration-color: rgba(255,138,128,.6); }
.col code i { width: 18px; height: 18px; border-radius: 5px; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.35); }
.arrow { font-size: 36px; color: #6b6f6c; text-align: center; }
/* states */
.btns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 34px 24px; padding-top: 10px; }
.bs { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.bs .btn { min-width: 220px; height: 56px; font-size: 18px; }
.bs p { font: 400 14px/1 'Geist Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: #6b6f6c; }
.btn.hv { background: #26302b; } .btn.pr { background: #000; transform: scale(.97); } .btn.fc { box-shadow: 0 0 0 3px #f6f6f3, 0 0 0 6px #1a9b55; }
.btn.ds { background: #e3e3de; color: #9a9a96; } .btn.ld { background: #26302b; }
.mini { width: 22px; height: 22px; border-radius: 50%; border: 3px solid rgba(255,255,255,.3); border-top-color: #fff; }
/* errors */
.err { display: grid; grid-template-columns: 1.15fr 1fr; gap: 40px; align-items: center; height: 100%; }
.ecard { border-radius: 22px; background: #fff; padding: 30px; box-shadow: 0 1px 0 #e6e6e1, 0 24px 50px rgba(15,20,17,.08); border-left: 6px solid #c93a3a; display: grid; gap: 12px; }
.eb { display: flex; gap: 12px; margin-top: 10px; }
.ann { list-style: none; display: grid; gap: 18px; counter-reset: a; }
.ann li { counter-increment: a; display: grid; gap: 4px; padding-left: 52px; position: relative; font-size: 18px; color: #3f3f3d; }
.ann li::before { content: counter(a); position: absolute; left: 0; top: 0; width: 36px; height: 36px; border-radius: 50%; background: #0f1411; color: #c8ff4d; display: grid; place-items: center; font: 600 16px/1 'Geist Mono', monospace; }
.ann b { font-size: 20px; color: #141615; }
/* trust */
.chips { display: flex; flex-wrap: wrap; gap: 12px; max-width: 560px; }
.chip { display: inline-flex; align-items: center; gap: 10px; height: 46px; padding: 0 18px; border-radius: 999px; background: rgba(255,255,255,.08); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); font-size: 17px; }
.chip.lime { background: #c8ff4d; color: #0f1411; box-shadow: none; font-weight: 500; }
.dot { width: 10px; height: 10px; border-radius: 50%; } .dot.g { background: #3ddc84; } .dot.b { background: #6aa8ff; }
.aicard { position: absolute; right: 0; top: -40px; width: 470px; border-radius: 22px; background: #171e1a; box-shadow: inset 0 0 0 1px rgba(255,255,255,.1), 0 30px 60px rgba(0,0,0,.4); padding: 28px; display: grid; gap: 8px; }
.ak { font: 400 13px/1 'Geist Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: #9ef0c6; }
.at { font-weight: 500; font-size: 24px; letter-spacing: -0.02em; } .ad { color: #9aa59f; font-size: 16px; }
`;

const page = (a) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@1,6..72,400&display=block" rel="stylesheet">
<style>${css}</style></head><body class="${a.tone}">
<p class="eyebrow">${a.eyebrow}</p>
<h1>${a.title}</h1>
<div class="stage">${a.body}</div>
</body></html>`;

const only = process.argv.slice(2);
const dir = mkdtempSync(join(tmpdir(), 'post-art-'));
mkdirSync(resolve('public/img/posts'), { recursive: true });
try {
  for (const [name, a] of Object.entries(ARTS).filter(([n]) => !only.length || only.includes(n))) {
    const html = join(dir, `${name}.html`);
    const png = join(dir, `${name}.png`);
    writeFileSync(html, page(a));
    execFileSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
      '--force-device-scale-factor=2', '--window-size=1200,750', '--virtual-time-budget=8000', `--screenshot=${png}`, pathToFileURL(html).href]);
    const r = await sharp(png).resize({ width: 1600 }).webp({ quality: 88, effort: 5 }).toFile(resolve('public/img/posts', `${name}.webp`));
    console.log(`${name}.webp  ${r.width}×${r.height}  ${Math.round(r.size / 1024)} KB`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
