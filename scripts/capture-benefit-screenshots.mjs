/**
 * Captures the four Benefits section screenshots from n2-platform-grok.
 * Run platform first: cd ../n2-platform-grok && npm run dev  (port 5173)
 * Then: node scripts/capture-benefit-screenshots.mjs
 */
import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.N2_PLATFORM_URL || 'http://localhost:5173';
const OUT_DIR = path.join(__dirname, '../src/assets/benefits');
const ASPECT = 1.4;

const shots = {
  benefit1: path.join(OUT_DIR, 'benefit-1-project-card.png'),
  benefit2: path.join(OUT_DIR, 'benefit-2-import-wizard.png'),
  benefit3: path.join(OUT_DIR, 'benefit-3-projects-overview.png'),
  benefit4: path.join(OUT_DIR, 'benefit-4-my-flows-idle.png'),
};

async function waitForApp(page) {
  await page.waitForSelector('#root > *', { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
}

function clipToAspect(box, aspect = ASPECT) {
  const width = Math.min(box.width, 480);
  const height = Math.min(width / aspect, box.height);
  return { x: box.x, y: box.y, width, height };
}

async function screenshotClip(page, clip, outPath) {
  await page.screenshot({ path: outPath, clip });
  console.log(`✓ ${path.basename(outPath)}`);
}

const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1400, height: 900 } });
const page = await browser.newPage();

try {
  await mkdir(OUT_DIR, { recursive: true });

  // 1 — Governed trust: single project card
  await page.goto(`${BASE}/projects`, { waitUntil: 'networkidle2' });
  await waitForApp(page);
  const card = await page.waitForSelector('[data-capture="project-card-first"]', { timeout: 10000 });
  const cardBox = await card.boundingBox();
  if (!cardBox) throw new Error('Project card not found');
  await screenshotClip(page, clipToAspect(cardBox, ASPECT), shots.benefit1);

  // 2 — Adoption: import wizard step 3 (Upload File)
  await page.goto(`${BASE}/flows`, { waitUntil: 'networkidle2' });
  await waitForApp(page);
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent?.includes('New import flow'));
    btn?.click();
  });
  await page.waitForSelector('.MuiDialog-root', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 400));

  const clickDialogNext = async () => {
    await page.evaluate(() => {
      [...document.querySelectorAll('.MuiDialog-root button')].find((b) => b.textContent?.trim() === 'Next')?.click();
    });
    await new Promise((r) => setTimeout(r, 450));
  };

  // Choose flow with file upload
  await page.evaluate(() => {
    for (const el of [...document.querySelectorAll('.MuiDialog-root div')]) {
      if (el.textContent?.includes('Material master — new record') && el.textContent?.includes('Creates new material')) {
        const r = el.getBoundingClientRect();
        if (r.width > 300 && r.height > 60 && r.height < 200) {
          el.click();
          return;
        }
      }
    }
  });
  await new Promise((r) => setTimeout(r, 450));
  await clickDialogNext();
  // Choose table
  await page.evaluate(() => {
    for (const el of [...document.querySelectorAll('.MuiDialog-root div')]) {
      if (el.textContent?.includes('Material Master — Metals') && el.textContent?.includes('Core material attributes')) {
        const r = el.getBoundingClientRect();
        if (r.width > 300 && r.height > 50 && r.height < 150) {
          el.click();
          return;
        }
      }
    }
  });
  await new Promise((r) => setTimeout(r, 450));
  await clickDialogNext();
  await page.waitForSelector('[data-capture="import-wizard-upload"]', { timeout: 15000 });

  const dialogClip = await page.evaluate(() => {
    const dialog = document.querySelector('.MuiDialog-paper');
    const upload = document.querySelector('[data-capture="import-wizard-upload"]');
    if (!dialog || !upload) return null;
    const d = dialog.getBoundingClientRect();
    const u = upload.getBoundingClientRect();
    const stepper = dialog.querySelector('.MuiDialogContent-root')?.firstElementChild;
    const top = stepper ? stepper.getBoundingClientRect().top : d.top + 56;
    const width = Math.min(d.width - 32, 520);
    const height = Math.min(u.bottom - top + 48, width / 1.4);
    return { x: d.left + 16, y: top - 8, width, height };
  });
  if (!dialogClip) throw new Error('Import wizard upload step not found');
  await screenshotClip(page, dialogClip, shots.benefit2);

  // 3 — Ecosystem: projects overview (title + grid)
  await page.goto(`${BASE}/projects`, { waitUntil: 'networkidle2' });
  await waitForApp(page);
  const overviewClip = await page.evaluate(() => {
    const title = [...document.querySelectorAll('h5, .MuiTypography-h5')].find((el) => el.textContent?.trim() === 'Projects');
    const grid = document.querySelector('[data-capture="projects-grid"]');
    if (!title || !grid) return null;
    const t = title.getBoundingClientRect();
    const g = grid.getBoundingClientRect();
    const width = Math.min(Math.max(g.right - t.left, 520), 560);
    const height = Math.min(g.bottom - t.top + 8, width / 1.4);
    return { x: t.left, y: t.top, width, height };
  });
  if (!overviewClip) throw new Error('Projects overview not found');
  await screenshotClip(page, overviewClip, shots.benefit3);

  // 4 — Clarity: My flows Progress + Idle columns (4 rows)
  await page.goto(`${BASE}/my-flows`, { waitUntil: 'networkidle2' });
  await waitForApp(page);
  // UX plan: Progress + Idle columns with 3–4 rows showing 1–3 day idle labels
  const flowsClip = await page.evaluate(() => {
    const table = document.querySelector('[data-capture="my-flows-table"]');
    if (!table) return null;
    const headers = [...table.querySelectorAll('th')];
    const progressTh = headers.find((th) => th.textContent?.trim() === 'Progress');
    const idleTh = headers.find((th) => th.textContent?.trim() === 'Idle');
    if (!progressTh || !idleTh) return null;

    const rows = [...table.querySelectorAll('tbody tr')].slice(0, 4);
    if (rows.length < 3) return null;

    const headerTop = progressTh.getBoundingClientRect().top;
    const lastRow = rows[rows.length - 1].getBoundingClientRect();
    const left = progressTh.getBoundingClientRect().left - 4;
    const right = idleTh.getBoundingClientRect().right + 4;
    const width = right - left;
    const height = Math.min(lastRow.bottom - headerTop + 6, width / 1.4);
    return { x: left, y: headerTop, width, height };
  });
  if (!flowsClip) throw new Error('My flows table not found');
  await screenshotClip(page, flowsClip, shots.benefit4);
} finally {
  await browser.close();
}

console.log('\nBenefit screenshots saved to src/assets/benefits/');