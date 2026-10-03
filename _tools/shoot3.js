const { chromium } = require("playwright");
const path = require("path");
const outDir = path.join(__dirname, "..", "_shots");
const base = "http://localhost:4321/";
(async () => {
  const browser = await chromium.launch();
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mp = await mob.newPage();
  await mp.goto(base + "index.html", { waitUntil: "networkidle" });
  await mp.click(".nav-toggle");
  await mp.waitForTimeout(400);
  await mp.screenshot({ path: path.join(outDir, "mob-menu2.png") });
  await mp.close();
  await mob.close();
  // contact desktop
  const desk = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const cp = await desk.newPage();
  await cp.goto(base + "contact.html", { waitUntil: "networkidle" });
  await cp.waitForTimeout(1200);
  await cp.screenshot({ path: path.join(outDir, "full-contact.png"), fullPage: true });
  await cp.close();
  await desk.close();
  await browser.close();
  console.log("done");
})();
