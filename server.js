const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 5173;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

http
  .createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    let file = path.join(ROOT, url === "/" ? "index.html" : url);

    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    fs.stat(file, (err, stat) => {
      if (!err && stat.isDirectory()) file = path.join(file, "index.html");
      fs.readFile(file, (err2, buf) => {
        if (err2) {
          res.writeHead(404, { "Content-Type": "text/html" }).end("<h1>404</h1>");
          return;
        }
        const ext = path.extname(file).toLowerCase();
        const stat2 = fs.statSync(file);
        res.writeHead(200, {
          "Content-Type": TYPES[ext] || "application/octet-stream",
          "Content-Length": stat2.size,
          /* no-store, not no-cache: an hour-long max-age on the hero video made
             a re-encoded hero invisible to anyone who had already loaded the
             page once. This server is a local preview, so freshness always
             wins over bandwidth here. A real host should fingerprint asset
             filenames instead. */
          "Cache-Control": "no-store",
        });
        res.end(buf);
      });
    });
  })
  .listen(PORT, () => console.log(`Portfolio running at http://localhost:${PORT}`));
