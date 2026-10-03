const { chromium } = require("playwright");
const path = require("path");
const outDir = path.join(__dirname, "..", "_shots");
const base = "http://localhost:4321/";
(async () => {
  const browser = await chromium.launch();
  const errs = [];
  const desk = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  for (const p of ["salon.html","mentions-legales.html","index.html"]) {
    const page = await desk.newPage();
    page.on("pageerror", (e) => errs.push(`${p} ${e.message}`));
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, `v2-${p.replace(".html","")}.png`), fullPage: true });
    const ovf = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (ovf > 1) errs.push(`${p} OVERFLOW ${ovf}`);
    await page.close();
  }
  await desk.close();
  await browser.close();
  console.log(errs.length ? "ISSUES: " + errs.join("; ") : "✅ clean");
})();
