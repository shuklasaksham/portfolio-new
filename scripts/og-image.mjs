// Renders scripts/og-image.html to public/og.jpg (1200×630), the link-preview image.
// JPEG keeps it well under WhatsApp's ~300 KB preview limit.
// Run: npm run og-image
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync, statSync } from 'node:fs';
import sharp from 'sharp';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const png = resolve('public/og.tmp.png');
const out = resolve('public/og.jpg');
const browser = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((b) => b && existsSync(b));
if (!browser) throw new Error('No Chrome or Edge found; set CHROME_PATH.');

execFileSync(browser, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--allow-file-access-from-files',
  '--force-device-scale-factor=1',
  '--window-size=1200,630',
  '--virtual-time-budget=8000',
  `--screenshot=${png}`,
  pathToFileURL(resolve('scripts/og-image.html')).href,
]);
await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
rmSync(png);
console.log(`Wrote ${out} (${Math.round(statSync(out).size / 1024)} KB)`);
