const http = require("http");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const types = { ".html":"text/html", ".css":"text/css", ".js":"text/javascript", ".webp":"image/webp", ".svg":"image/svg+xml", ".json":"application/json", ".xml":"application/xml", ".txt":"text/plain" };
http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split("?")[0]);
  if (u === "/") u = "/index.html";
  const fp = path.join(root, u);
  if (!fp.startsWith(root) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); res.end("404"); return; }
  res.writeHead(200, { "Content-Type": types[path.extname(fp)] || "application/octet-stream" });
  fs.createReadStream(fp).pipe(res);
}).listen(4321, () => console.log("Serving on http://localhost:4321"));
