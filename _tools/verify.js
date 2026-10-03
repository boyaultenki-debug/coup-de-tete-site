const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const pages = ["index.html","prestations.html","realisations.html","salon.html","contact.html","mentions-legales.html"];
let errors = 0;

function localRefs(html) {
  const refs = new Set();
  const re = /(?:src|href)="(\/[^"#?]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    const u = m[1];
    if (u.startsWith("/assets/") || pages.includes(u.replace(/^\//, "")) || u === "/site.webmanifest") refs.add(u);
  }
  return refs;
}

pages.forEach((p) => {
  const file = path.join(root, p);
  if (!fs.existsSync(file)) { console.log("MISSING PAGE:", p); errors++; return; }
  const html = fs.readFileSync(file, "utf8");
  localRefs(html).forEach((u) => {
    const fp = path.join(root, u.replace(/^\//, ""));
    if (!fs.existsSync(fp)) { console.log(`[${p}] broken ref -> ${u}`); errors++; }
  });
  // quick sanity
  const tel = (html.match(/tel:\+33476472174/g) || []).length;
  console.log(`${p.padEnd(22)} ok  (tel links: ${tel})`);
});

console.log(errors === 0 ? "\n✅ No broken local references." : `\n❌ ${errors} problem(s).`);
process.exit(errors ? 1 : 0);
