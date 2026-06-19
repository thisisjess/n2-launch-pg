/**
 * Captures launch-page benefit screenshots from n2-platform-grok.
 * Theme: n2 demo (comfortable · light) + MDMi marketing red (#D70321) shell/chrome.
 * Tight focal crops — each benefit highlights a specific UI affordance.
 */
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.PLATFORM_URL || 'http://localhost:5173';
const OUT = path.join(__dirname, '../src/assets');

const THEME_STATE = JSON.stringify({
  density: 'glasses', // n2Demo forces glasses anyway (large readable demo font); explicit here for clarity
  mode: 'light',
  palette: 'n2Demo',
});

const shots = {
  benefit1: path.join(OUT, 'benefits/benefit-1-project-card.png'),
  benefit2: path.join(OUT, 'benefits/benefit-2-import-wizard.png'),
  benefit3: path.join(OUT, 'benefits/benefit-3-projects-overview.png'),
  benefit4: path.join(OUT, 'benefits/benefit-4-my-flows-idle.png'),
  designDashboard: path.join(OUT, 'design/design-dashboard-full.png'),
};

async function applyDemoTheme(page) {
  await page.evaluateOnNewDocument((themeJson) => {
    window.localStorage.setItem('n2-theme-state', themeJson);
    window.sessionStorage.setItem('n2-demo-unlocked', 'true');
    window.sessionStorage.setItem('n2-demo-role', 'admin');
    window.sessionStorage.setItem(
      'n2-onboarding',
      JSON.stringify({ completed: true, fresh: false, addons: [] }),
    );
  }, THEME_STATE);
}

async function waitForApp(page) {
  await page.waitForFunction(() => document.querySelector('#root')?.children.length > 0, { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1000));
}

/** Tight crop around a single element — no aspect padding (avoids bleeding into adjacent UI). */
async function captureTightElement(page, selector, outPath, { pad = 10, padBottom = 0 } = {}) {
  const box = await page.evaluate(
    ({ sel, padding, extraBottom }) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: Math.max(0, r.x - padding),
        y: Math.max(0, r.y - padding),
        width: r.width + padding * 2,
        height: r.height + padding + extraBottom + padding,
      };
    },
    { sel: selector, padding: pad, extraBottom: padBottom },
  );
  if (!box) throw new Error(`Element not found: ${selector}`);
  await page.screenshot({ path: outPath, clip: box });
  console.log(`✓ ${path.basename(outPath)}`);
}

/** Tight crop across the first N project cards in the n2 demo projects grid. */
async function captureProjectsGridFocal(page, outPath, { cardCount = 3, pad = 8 } = {}) {
  const box = await page.evaluate(
    ({ count, padding }) => {
      const grid = document.querySelector('[data-capture="projects-grid"]');
      if (!grid) return null;
      const cards = [...grid.querySelectorAll('[data-capture="project-card-first"], .MuiCard-root')]
        .filter((card, index, all) => all.indexOf(card) === index)
        .slice(0, count);
      if (!cards.length) return null;
      const rects = cards.map((card) => card.getBoundingClientRect());
      const left = Math.min(...rects.map((r) => r.left));
      const top = Math.min(...rects.map((r) => r.top));
      const right = Math.max(...rects.map((r) => r.right));
      const bottom = Math.max(...rects.map((r) => r.bottom));
      return {
        x: Math.max(0, left - padding),
        y: Math.max(0, top - padding),
        width: right - left + padding * 2,
        height: bottom - top + padding * 2,
      };
    },
    { count: cardCount, padding: pad },
  );
  if (!box) throw new Error('Projects grid cards not found');
  await page.screenshot({ path: outPath, clip: box });
  console.log(`✓ ${path.basename(outPath)}`);
}

/** Crop a focal slice (Step Owner / Progress + Idle) from the live n2 demo All flows table.
 *  Uses last N rows (recent-ish after default sort) + 3 rows + wider start col for ~1.3-1.45 landscape aspect
 *  that fits the launch page's aspect-[1.4] benefit cards. Clamps height for consistency.
 */
async function captureFlowsProgressIdle(page, outPath, { rowCount = 3 } = {}) {
  const box = await page.evaluate(
    ({ rows }) => {
      const table = document.querySelector('[data-capture="flows-table"]');
      if (!table) return null;

      const headers = [...table.querySelectorAll('th')];
      // Prefer a left anchor that gives a bit more width/context while focusing progress/idle
      let leftTh = headers.find((th) => th.textContent?.trim() === 'Step Owner')
        || headers.find((th) => th.textContent?.trim() === 'Current Step')
        || table.querySelector('[data-capture="flows-col-progress"]');
      const idleTh = table.querySelector('[data-capture="flows-col-idle"]');
      if (!leftTh || !idleTh) return null;

      const lRect = leftTh.getBoundingClientRect();
      const iRect = idleTh.getBoundingClientRect();
      let dataRows = [...table.querySelectorAll('tbody tr')].filter(
        (tr) => tr.querySelectorAll('td').length > 1,
      );
      // Prefer rows for the recently-dated demo items (MAT/TENS etc have 0-2 day idles after mock tweak)
      let pickRows = dataRows.filter((tr) => /MAT-2026|TENS-2026|j-003|Alloy spec/i.test(tr.textContent || ''));
      if (pickRows.length < rows) {
        // fallback: any with small idle text
        const smallIdle = dataRows.filter((tr) => /(today|1 day|2 day|3 days?)/i.test(tr.textContent || ''));
        pickRows = [...pickRows, ...smallIdle].slice(0, rows);
      }
      if (pickRows.length < 1) pickRows = dataRows.slice(0, rows);
      const lastRow = pickRows[pickRows.length - 1];
      if (!lastRow) return null;
      const lastRect = lastRow.getBoundingClientRect();

      const pad = 8;
      let width = iRect.right - lRect.left + pad * 2;
      let height = lastRect.bottom - lRect.top + pad * 2;

      // Clamp to ~1.35 aspect (slightly tighter than 1.4 to leave breathing room in the card)
      const targetAspect = 1.35;
      const maxH = width / targetAspect;
      if (height > maxH) height = maxH;

      return {
        x: Math.max(0, lRect.left - pad),
        y: Math.max(0, lRect.top - pad),
        width,
        height,
      };
    },
    { rows: rowCount },
  );
  if (!box) throw new Error('Flows progress/idle columns not found');
  await page.screenshot({ path: outPath, clip: box });
  console.log(`✓ ${path.basename(outPath)}`);
}

const browser = await puppeteer.launch({
  headless: true,
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
});
const page = await browser.newPage();
await applyDemoTheme(page);

try {
  // Design — full viewport dashboard
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
  await waitForApp(page);
  await page.waitForSelector('[data-capture="dashboard-phase-cards"]', { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: shots.designDashboard, fullPage: false });
  console.log(`✓ ${path.basename(shots.designDashboard)} (full viewport)`);

  // Benefit 1 — project card: chips, avatars, affordances
  await page.goto(`${BASE}/projects`, { waitUntil: 'networkidle2' });
  await waitForApp(page);
  await page.waitForSelector('[data-capture="project-card-first"]', { timeout: 10000 });
  await captureTightElement(page, '[data-capture="project-card-first"]', shots.benefit1, {
    pad: 8,
  });

  // Benefit 2 — import wizard: drag-and-drop zone + button
  await page.goto(`${BASE}/flows`, { waitUntil: 'networkidle2' });
  await waitForApp(page);
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('New import flow'),
    );
    btn?.click();
  });
  await page.waitForSelector('.MuiDialog-paper', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 500));

  const clickDialogNext = async () => {
    const clicked = await page.evaluate(() => {
      const next = [...document.querySelectorAll('.MuiDialog-paper button')].find(
        (b) => b.textContent?.trim() === 'Next' && !b.disabled,
      );
      if (!next) return false;
      next.click();
      return true;
    });
    if (!clicked) throw new Error('Next button not enabled in import wizard');
    await new Promise((r) => setTimeout(r, 500));
  };

  await page.evaluate(() => {
    const dialog = document.querySelector('.MuiDialog-paper');
    const card = [...dialog.querySelectorAll('div')].find((el) => {
      const style = window.getComputedStyle(el);
      return style.cursor === 'pointer' && el.textContent?.includes('steps') && el.textContent?.includes('Requires file upload');
    }) || [...dialog.querySelectorAll('div')].find((el) => {
      const style = window.getComputedStyle(el);
      return style.cursor === 'pointer' && el.textContent?.includes('steps');
    });
    card?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  await clickDialogNext();

  await page.evaluate(() => {
    const dialog = document.querySelector('.MuiDialog-paper');
    const table = [...dialog.querySelectorAll('div')].find((el) => {
      const style = window.getComputedStyle(el);
      return style.cursor === 'pointer' && el.textContent?.includes('Material Master — Metals');
    });
    table?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  await clickDialogNext();

  await page.waitForSelector('[data-capture="import-wizard-dropzone"]', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 400));
  await captureTightElement(page, '[data-capture="import-wizard-dropzone"]', shots.benefit2, {
    pad: 20,
    padBottom: 4,
  });

  // Benefit 3 — projects grid (n2 demo cards: red chips, left rail, affordances)
  await page.goto(`${BASE}/projects`, { waitUntil: 'networkidle2' });
  await waitForApp(page);
  await page.waitForSelector('[data-capture="projects-grid"]', { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 600));
  await captureProjectsGridFocal(page, shots.benefit3, { cardCount: 3, pad: 8 });

  // Benefit 4 — All flows (n2 demo): focal Progress+Idle (now wider start col + 3 rows + aspect clamp for launch 1.4 cards)
  await page.goto(`${BASE}/flows`, { waitUntil: 'networkidle2' });
  await waitForApp(page);
  await page.waitForSelector('[data-capture="flows-table"]', { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 600));

  // Encourage a friendlier row order for the marketing crop (mixed recent idles rather than wall of 30d+ Stalled)
  await page.evaluate(() => {
    // Click the sort control (MUI Select / combobox) if present and switch toward alpha or status for variety
    const candidates = [...document.querySelectorAll('button, [role="combobox"], [role="button"]')];
    const sortTrigger = candidates.find((el) => /unused|first|alpha|sort/i.test(el.textContent || ''));
    if (sortTrigger) {
      sortTrigger.click();
      return true;
    }
    return false;
  });
  await new Promise((r) => setTimeout(r, 250));

  // If a menu/popup appeared, pick "Alphabetical" (or any non-unused) for mixed idle values
  await page.evaluate(() => {
    const items = [...document.querySelectorAll('[role="option"], li, div[tabindex]')];
    const alpha = items.find((el) => /alpha|alphabet/i.test(el.textContent || ''));
    if (alpha) alpha.click();
    else {
      // fallback: just pick the first reasonable menu item or do nothing
      const first = items.find((el) => el.textContent && el.textContent.length < 30);
      first?.click();
    }
  });
  await new Promise((r) => setTimeout(r, 500));

  await captureFlowsProgressIdle(page, shots.benefit4, { rowCount: 3 });
} finally {
  await browser.close();
}

console.log(`\nCaptured from ${BASE} — n2 demo, tight focal crops.`);