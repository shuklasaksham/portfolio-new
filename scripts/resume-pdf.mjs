// Prints the /resume page (its print styles show only the document) to
// public/Saksham-Shukla-Resume.pdf with headless Chrome or Edge.
// Run the dev server first (npm run dev), then: npm run resume-pdf [url]
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const url = process.argv[2] ?? 'http://127.0.0.1:5173/resume';
const out = resolve('public/Saksham-Shukla-Resume.pdf');
const browsers = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean);
const browser = browsers.find((b) => existsSync(b));
if (!browser) throw new Error('No Chrome or Edge found; set CHROME_PATH.');

execFileSync(browser, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--virtual-time-budget=10000',
  `--print-to-pdf=${out}`,
  url,
]);
console.log(`Wrote ${out} (${Math.round(statSync(out).size / 1024)} KB)`);
