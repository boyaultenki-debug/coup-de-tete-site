const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const outDir = path.join(__dirname, "..", "_shots");
fs.mkdirSync(outDir, { recursive: true });

const pages = ["index.html","prestations.html","realisations.html","salon.html","contact.html"];
const base = "http://localhost:4321/";

(async () => {
  const browser = await chromium.launch();
  const consoleErrors = [];

  // Desktop full-page
  const desk = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  for (const p of pages) {
    const page = await desk.newPage();
    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(`[D ${p}] ${m.text()}`); });
    page.on("pageerror", (e) => consoleErrors.push(`[D ${p}] PAGEERROR ${e.message}`));
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, `desk-${p.replace(".html","")}.png`), fullPage: true });
    // check horizontal overflow
    const ovf = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (ovf > 1) consoleErrors.push(`[D ${p}] HORIZONTAL OVERFLOW ${ovf}px`);
    await page.close();
  }
  await desk.close();

  // Mobile (iPhone-ish 390px)
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  for (const p of pages) {
    const page = await mob.newPage();
    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(`[M ${p}] ${m.text()}`); });
    page.on("pageerror", (e) => consoleErrors.push(`[M ${p}] PAGEERROR ${e.message}`));
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, `mob-${p.replace(".html","")}.png`), fullPage: true });
    const ovf = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (ovf > 1) consoleErrors.push(`[M ${p}] HORIZONTAL OVERFLOW ${ovf}px`);
    await page.close();
  }
  await mob.close();

  // 320px extreme check
  const tiny = await browser.newContext({ viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true });
  const tp = await tiny.newPage();
  await tp.goto(base + "index.html", { waitUntil: "networkidle" });
  const ovf320 = await tp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (ovf320 > 1) consoleErrors.push(`[320 index] HORIZONTAL OVERFLOW ${ovf320}px`);
  await tiny.close();

  await browser.close();
  console.log(consoleErrors.length ? "ISSUES:\n" + consoleErrors.join("\n") : "✅ No console errors, no horizontal overflow (320/390/1280).");
})();
