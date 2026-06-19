/**
 * Export n2 labs logo concepts B and I as transparent PNGs.
 * B — horizontal Kentwell lockup (dark script, light surfaces)
 * I — horizontal Kentwell lockup (white script, dark surfaces)
 *
 * Usage: node scripts/export-labs-logos-bi.mjs
 */
import puppeteer from 'puppeteer';
import { copyFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REF = path.join(__dirname, '../../n2-reference');
const OUT_REF = path.join(REF, 'assets');
const OUT_LAUNCH = path.join(__dirname, '../src/assets');
const SCALE = 4;

const exports = [
  {
    name: 'B',
    html: path.join(REF, 'n2-labs-logo-b-export.html'),
    file: 'n2-labs-logo-b.png',
  },
  {
    name: 'I',
    html: path.join(REF, 'n2-labs-logo-i-export.html'),
    file: 'n2-labs-logo-i.png',
  },
];

async function exportLogo(page, { html, out }) {
  await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-export]');
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 400));

  const clip = await page.evaluate(() => {
    const el = document.querySelector('[data-export]');
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });

  await page.screenshot({ path: out, clip, omitBackground: true });
}

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 800, height: 400, deviceScaleFactor: SCALE });

try {
  await mkdir(OUT_REF, { recursive: true });
  await mkdir(OUT_LAUNCH, { recursive: true });

  for (const item of exports) {
    const refOut = path.join(OUT_REF, item.file);
    const launchOut = path.join(OUT_LAUNCH, item.file);
    await exportLogo(page, { html: item.html, out: refOut });
    await copyFile(refOut, launchOut);
    console.log(`✓ Concept ${item.name} → ${item.file} (${SCALE}x, transparent)`);
  }
} finally {
  await browser.close();
}

console.log('\nSaved to n2-reference/assets/ and n2-launch-pg/src/assets/');