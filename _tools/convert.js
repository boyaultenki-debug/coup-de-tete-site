const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SRC = "C:/Users/Enki_Goat/.claude/image-cache/ad933fc9-320f-4111-8b44-e83a08d7419b";
const OUT = path.join(__dirname, "..", "assets", "img", "gallery");

// Curated display order (mix textures/colours for visual rhythm — no per-cut categories)
const order = [2, 13, 9, 1, 6, 8, 11, 3, 16, 5, 10, 4, 12, 7, 15, 14];

(async () => {
  let i = 0;
  for (const n of order) {
    i++;
    const src = path.join(SRC, `${n}.png`);
    const base = String(i).padStart(2, "0");
    const meta = await sharp(src).metadata();
    // grid version
    await sharp(src)
      .rotate()
      .resize({ width: 900, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(OUT, `${base}.webp`));
    // large version for lightbox
    await sharp(src)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(OUT, `${base}-lg.webp`));
    console.log(`${base}  <- ${n}.png  ${meta.width}x${meta.height}`);
  }

  // Hero image (portrait-strong shot) -> reuse image 2 (long balayage)
  await sharp(path.join(SRC, "2.png"))
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(OUT, "..", "hero.webp"));

  // OG / social share image 1200x630 (cover crop of image 13)
  await sharp(path.join(SRC, "13.png"))
    .rotate()
    .resize({ width: 1200, height: 630, fit: "cover", position: "top" })
    .webp({ quality: 80 })
    .toFile(path.join(OUT, "..", "meta", "og.webp"));

  console.log("ALL DONE");
})();
