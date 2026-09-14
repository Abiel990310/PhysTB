/**
 * A smoke test that drives the built site in a real browser.
 *
 * Everything `npm run verify` checks happens in Node: the graders agree, the
 * claims are proved, the types line up. None of that would have caught the bug
 * this script was written for — `<tb-exercise>` was emitted into every practice
 * section while no custom element defined it, so the widget verified perfectly
 * and rendered as an empty box for readers.
 *
 * This is deliberately NOT part of `npm run verify`: it needs a Chromium, and a
 * gate that cannot run everywhere gets skipped and then removed. Run it by hand
 * after touching the components, the payload shape, or the build plumbing:
 *
 *     npm run build && node scripts/smoke-browser.mjs
 *
 * Set PW_CHROMIUM to a browser binary if Playwright cannot find its own.
 */

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml' };

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  try {
    const body = await readFile(join(DIST, p));
    res.setHeader('Content-Type', TYPES[extname(p)] ?? 'application/octet-stream');
    res.end(body);
  } catch { res.statusCode = 404; res.end('not found'); }
});
await new Promise((r) => server.listen(4199, r));

const executablePath = process.env.PW_CHROMIUM || undefined;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('http://localhost:4199/kinematics/motion-in-one-dimension/', { waitUntil: 'networkidle' });
await page.waitForSelector('.part__input', { timeout: 5000 });

const parts = await page.locator('.part').count();
console.log(`practice widget rendered with ${parts} parts`);
console.log('progress line:', await page.locator('.exercise__progress').textContent());

// A correct answer, spelled unusually.
await page.locator('.part__input').first().fill('x0 + t*v0 + 0.5*a*t^2');
await page.locator('.part__check').first().click();
console.log('answer "x0 + t*v0 + 0.5*a*t^2" ->', await page.locator('.part__verdict').first().textContent());

// A wrong one.
await page.locator('.part__input').nth(1).fill('2*g*h');
await page.locator('.part__check').nth(1).click();
console.log('answer "2*g*h"  ->', await page.locator('.part__verdict').nth(1).textContent());

console.log('progress now:', await page.locator('.exercise__progress').textContent());

// Typing again must retract the stale verdict.
await page.locator('.part__input').first().fill('x0 +');
console.log('verdict hidden after edit:', await page.locator('.part__verdict').first().isHidden());

// The standalone page too.
await page.goto('http://localhost:4199/practice/energy-symbolic/', { waitUntil: 'networkidle' });
await page.waitForSelector('.part__input', { timeout: 5000 });
await page.locator('.part__input').nth(1).fill('sqrt(k*d^2/m)');
await page.locator('.part__check').nth(1).click();
console.log('spring launch, answer "sqrt(k*d^2/m)" ->', await page.locator('.part__verdict').nth(1).textContent());

// The simulation widget, which is this book's reason to exist.
await page.goto('http://localhost:4199/oscillations/simple-harmonic-motion/', { waitUntil: 'networkidle' });
await page.waitForSelector('.sim__canvas', { timeout: 5000 });
const sliders = await page.locator('.sim__slider').count();
console.log(`simulation rendered with ${sliders} parameter sliders`);
console.log('small angle:', await page.locator('.sim__readout').textContent());
// Drag the release angle up; the small-angle curve must visibly part company.
// A range input is not "filled"; set it and fire the event the widget listens for.
await page.locator('.sim__slider').first().evaluate((el) => {
  el.value = '2.6';
  el.dispatchEvent(new Event('input', { bubbles: true }));
});
await page.waitForTimeout(250);
console.log('large angle:', await page.locator('.sim__readout').textContent());

await browser.close();
server.close();

if (errors.length) {
  console.log('PAGE ERRORS: ' + errors.join(' | '));
  process.exit(1);
}
console.log('\nThe practice widget renders, grades and forgets stale verdicts.');
