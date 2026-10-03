const { chromium } = require("playwright");
const path = require("path");
const outDir = path.join(__dirname, "..", "_shots");
require("fs").mkdirSync(outDir, { recursive: true });
const base = "http://localhost:4321/";
(async () => {
  const browser = await chromium.launch();
  const desk = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const p1 = await desk.newPage();
  await p1.goto(base + "salon.html", { waitUntil: "networkidle" });
  await p1.waitForTimeout(400);
  // crop to the gérante section
  const sec = await p1.$("section.bg-sand");
  await sec.screenshot({ path: path.join(outDir, "nadia-desk.png") });
  await desk.close();
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const p2 = await mob.newPage();
  await p2.goto(base + "salon.html", { waitUntil: "networkidle" });
  await p2.waitForTimeout(400);
  const sec2 = await p2.$("section.bg-sand");
  await sec2.screenshot({ path: path.join(outDir, "nadia-mob.png") });
  await mob.close();
  await browser.close();
  console.log("done");
})();
