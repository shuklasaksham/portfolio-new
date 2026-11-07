// Renders scripts/favicon.html to every site icon in public/:
//   favicon.ico (16, 32, 48), favicon-32.png, icon-192.png, icon-512.png (rounded corners)
//   apple-touch-icon.png (180, square: iOS rounds the corners itself)
// Run: npm run favicon
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const browser = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((b) => b && existsSync(b));
if (!browser) throw new Error('No Chrome or Edge found; set CHROME_PATH.');

const page = pathToFileURL(resolve('scripts/favicon.html')).href;
function render(query, file) {
  execFileSync(browser, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--default-background-color=00000000',
    '--force-device-scale-factor=1',
    '--window-size=512,512',
    '--virtual-time-budget=8000',
    `--screenshot=${file}`,
    page + query,
  ]);
  return file;
}

const pub = (f) => resolve('public', f);
const round = render('?round', resolve('public/icon.round.tmp.png'));
const square = render('', resolve('public/icon.square.tmp.png'));

const png = (src, size) => sharp(src).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
writeFileSync(pub('icon-512.png'), await png(round, 512));
writeFileSync(pub('icon-192.png'), await png(round, 192));
writeFileSync(pub('favicon-32.png'), await png(round, 32));
writeFileSync(pub('apple-touch-icon.png'), await sharp(square).resize(180, 180).flatten({ background: '#0b6e4f' }).png().toBuffer());

// favicon.ico holding PNG images (supported by every current browser).
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(round, s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e); // width
  header.writeUInt8(s, e + 1); // height
  header.writeUInt8(0, e + 2); // palette colours
  header.writeUInt8(0, e + 3); // reserved
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
writeFileSync(pub('favicon.ico'), Buffer.concat([header, ...images]));

rmSync(round);
rmSync(square);
console.log('Wrote favicon.ico, favicon-32.png, icon-192.png, icon-512.png, apple-touch-icon.png');
