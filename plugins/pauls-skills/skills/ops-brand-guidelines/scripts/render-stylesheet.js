// Renders Resources/stylesheet.html to Resources/OPS Tech Stylesheet.pdf.
// Usage: node scripts/render-stylesheet.js   (needs Playwright with Chromium)
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const dir = path.join(__dirname, '..', 'Resources');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.join(dir, 'stylesheet.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: path.join(dir, 'OPS Tech Stylesheet.pdf'),
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
})();
