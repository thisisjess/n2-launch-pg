/**
 * Captures the Design section left-side dashboard crop from n2-platform-grok.
 * Portrait slice: header + expanded sidebar + Dashboard title + four phase cards.
 * Run platform first: cd ../n2-platform-grok && npm run dev -- --port 5173
 * Then: node scripts/capture-design-dashboard.mjs
 */
import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.N2_PLATFORM_URL || 'http://localhost:5173';
const OUT_DIR = path.join(__dirname, '../src/assets/design');
const OUT_FILE = path.join(OUT_DIR, 'design-dashboard-full.png');

async function waitForApp(page) {
  await page.waitForSelector('#root > *', { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
}

const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1400, height: 900, deviceScaleFactor: 2 } });
const page = await browser.newPage();

try {
  await mkdir(OUT_DIR, { recursive: true });

  // Fresh session: admin role, no onboarding scaffold — full dashboard
  await page.evaluateOnNewDocument(() => {
    window.localStorage.setItem(
      'n2-theme-state',
      JSON.stringify({ density: 'comfortable', mode: 'light', palette: 'n2Demo' }),
    );
    window.sessionStorage.setItem('n2-demo-role', 'admin');
    window.sessionStorage.setItem(
      'n2-onboarding',
      JSON.stringify({ completed: true, fresh: false, addons: [] }),
    );
  });

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
  await waitForApp(page);
  await page.waitForSelector('[data-capture="dashboard-phase-cards"]', { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1200));

  await page.screenshot({ path: OUT_FILE, fullPage: false });
  console.log(`✓ ${path.basename(OUT_FILE)} (full viewport 1440×900 @2x)`);
} finally {
  await browser.close();
}

console.log('\nDesign dashboard crop saved to src/assets/design/');