const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const outDir = path.join(__dirname, "..", "_shots");
const pages = ["index.html","prestations.html","realisations.html","salon.html","contact.html"];
const base = "http://localhost:4321/";

(async () => {
  const browser = await chromium.launch();
  // reduced motion forces .reveal -> visible, so we see real content/layout
  const desk = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  for (const p of pages) {
    const page = await desk.newPage();
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, `full-${p.replace(".html","")}.png`), fullPage: true });
    await page.close();
  }
  await desk.close();

  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  for (const p of ["index.html","prestations.html","realisations.html"]) {
    const page = await mob.newPage();
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, `mfull-${p.replace(".html","")}.png`), fullPage: true });
    await page.close();
  }
  // mobile menu open
  const mp = await mob.newPage();
  await mp.goto(base + "index.html", { waitUntil: "networkidle" });
  await mp.click(".nav-toggle");
  await mp.waitForTimeout(400);
  await mp.screenshot({ path: path.join(outDir, "mob-menu.png") });
  await mp.close();
  await mob.close();

  await browser.close();
  console.log("done");
})();
