/**
 * Captures launch-page benefit screenshots from n2-platform-grok @ localhost:5173.
 * n2Demo (glasses density + full red ramp) + precise per-benefit framing:
 * 1. Full project card
 * 2. Wizard step card (zoomed out to show d&d / upload card)
 * 3. Project detail right-col "Where this project is" journey card
 * 4. Tight Progress + Idle columns only (1/2/3 day values, latest filter chips)
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

/** Tight crop of *just* the Progress + Idle columns (plus header + a few rows).
 *  Zoomed in, no extra columns. Clamped to ~1.4 aspect for the launch card.
 *  Row selection prefers rows showing 1/2/3 day idle values.
 */
async function captureFlowsProgressIdle(page, outPath, { rowCount = 3 } = {}) {
  const box = await page.evaluate(
    ({ rows }) => {
      const table = document.querySelector('[data-capture="flows-table"]');
      if (!table) return null;

      // Strictly Progress + Idle only (as requested)
      const leftTh = table.querySelector('[data-capture="flows-col-progress"]');
      const idleTh = table.querySelector('[data-capture="flows-col-idle"]');
      if (!leftTh || !idleTh) return null;

      const lRect = leftTh.getBoundingClientRect();
      const iRect = idleTh.getBoundingClientRect();
      let dataRows = [...table.querySelectorAll('tbody tr')].filter(
        (tr) => tr.querySelectorAll('td').length > 1,
      );

      // Prefer rows that will show small idle values (1/2/3 days)
      let pickRows = dataRows.filter((tr) => /(today|1 day|2 days?|3 days?)/i.test(tr.textContent || ''));
      if (pickRows.length < rows) {
        pickRows = dataRows.slice(-rows); // fallback to last N (more recent after sort)
      }
      const lastRow = pickRows[pickRows.length - 1];
      if (!lastRow) return null;
      const lastRect = lastRow.getBoundingClientRect();

      const pad = 5; // tighter zoom as requested
      const extraLeftForRed = 10; // for more of the 4px red left border on the n2-list-card
      let width = iRect.right - lRect.left + pad * 2;
      let height = lastRect.bottom - lRect.top + pad * 2;

      // Clamp close to 1.4 for the launch benefit cards
      const targetAspect = 1.4;
      const maxH = width / targetAspect;
      if (height > maxH) height = maxH;

      return {
        x: Math.max(0, lRect.left - pad - extraLeftForRed),
        y: Math.max(0, lRect.top - pad),
        width: width + extraLeftForRed,
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

  // Benefit 1 — card crop of the project card to fit the 1.4 aspect square/container
  // Full card height (+ small vpad), width = effectiveH * 1.4, left-aligned to include the full 4px red left border.
  // This makes the PNG aspect ~1.4 so object-cover in the launch aspect-[1.4] box shows it perfectly fitted (no extra crop), cropping right of card if needed.
  await page.goto(`${BASE}/projects`, { waitUntil: 'networkidle2' });
  await waitForApp(page);
  await page.waitForSelector('[data-capture="project-card-first"]', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 300));
  const benefit1Box = await page.evaluate(() => {
    const el = document.querySelector('[data-capture="project-card-first"]');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const vPad = 8;
    const leftMargin = 8; // ensures full 4px red border is inside the image
    const effectiveH = r.height + vPad * 2;
    const targetW = effectiveH * 1.4;
    const x = Math.max(0, r.x - leftMargin);
    return {
      x,
      y: Math.max(0, r.y - vPad),
      width: targetW,
      height: effectiveH,
    };
  });
  if (benefit1Box) {
    await page.screenshot({ path: shots.benefit1, clip: benefit1Box });
    console.log(`✓ ${path.basename(shots.benefit1)} (card crop @ 1.4 aspect, full height + red border)`);
  } else {
    throw new Error('Project card not found for benefit1');
  }

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

  await page.waitForSelector('[data-capture="import-wizard-upload"]', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 400));
  // Zoom out a little to capture the full step *card* (not just the dashed dropzone)
  await captureTightElement(page, '[data-capture="import-wizard-upload"]', shots.benefit2, {
    pad: 12,
    padBottom: 8,
  });

  // Benefit 3 — project detail page, right column: "Where this project is" (journey phases)
  await page.goto(`${BASE}/projects/aluminum-alloy-characterization`, { waitUntil: 'networkidle2' });
  await waitForApp(page);
  await page.waitForSelector('[data-capture="project-journey-card"]', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 400));
  await captureTightElement(page, '[data-capture="project-journey-card"]', shots.benefit3, {
    pad: 12, // extra for more red accents / left breathing
  });

  // Benefit 4 — just Progress + Idle columns (tight zoom). Days will be 1/2/3 after mock update.
  await page.goto(`${BASE}/flows`, { waitUntil: 'networkidle2' });
  await waitForApp(page);
  await page.waitForSelector('[data-capture="flows-table"]', { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 400));

  // Force Alphabetical sort so low-idle rows (from recent updatedAt) are reliably in the DOM list
  // and the filter by text will find them for the tight Progress+Idle crop.
  await page.evaluate(() => {
    const candidates = [...document.querySelectorAll('button, [role="combobox"], [role="button"], select')];
    const sortEl = candidates.find(el => /unused|first|alpha|sort/i.test(el.textContent || el.value || ''));
    if (sortEl) {
      sortEl.click();
      // small delay for menu
    }
  });
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() => {
    const opts = [...document.querySelectorAll('[role="option"], li, [tabindex]')];
    const alpha = opts.find(o => /alpha/i.test(o.textContent || ''));
    if (alpha) alpha.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // Force nice 1/2/3 day values + ensure latest filter chip theme is visible for the crop
  await page.evaluate(() => {
    const table = document.querySelector('[data-capture="flows-table"]');
    if (!table) return;
    const dataRows = [...table.querySelectorAll('tbody tr')].filter(r => r.querySelectorAll('td').length > 1);
    const targets = dataRows.slice(0, 3);
    const values = ['1 day', '2 days', '3 days'];
    targets.forEach((row, i) => {
      // Find the idle cell (second-to-last td or by header position)
      const tds = [...row.querySelectorAll('td')];
      const idleCell = tds[tds.length - 2] || tds[tds.length - 1];
      if (idleCell) idleCell.textContent = values[i];
      // Force the status chip(s) in this row (in progress area) to match the red-tinted chip UI from benefit1 project cards
      // Card chips use: fontSize 0.5625rem, height 1rem, bgcolor #FCE4E6 or #FFF8F8, color #9F0218
      const chipsInRow = row.querySelectorAll('.MuiChip-root');
      chipsInRow.forEach(chip => {
        chip.style.fontSize = '0.5625rem';
        chip.style.height = '1rem';
        chip.style.backgroundColor = '#FCE4E6'; // reds[100] like main card chips
        chip.style.color = '#9F0218'; // reds[700]
        chip.style.border = 'none';
        const label = chip.querySelector('.MuiChip-label');
        if (label) {
          label.style.paddingLeft = '0.375rem';
          label.style.paddingRight = '0.375rem';
        }
      });
    });

    // Make sure the top filter chips have the n2-demo active styling to match card chip look
    const filterChips = [...document.querySelectorAll('.n2-filter-chip')];
    filterChips.forEach(c => {
      if (c.textContent && /All/i.test(c.textContent)) {
        c.classList.add('active');
        c.style.backgroundColor = '#FCE4E6';
        c.style.color = '#9F0218';
        c.style.border = 'none';
      }
    });
  });
  await new Promise((r) => setTimeout(r, 150));

  await captureFlowsProgressIdle(page, shots.benefit4, { rowCount: 3 });
} finally {
  await browser.close();
}

console.log(`\nCaptured from ${BASE} — n2 demo, tight focal crops.`);