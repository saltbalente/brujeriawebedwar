import { createReadStream, existsSync, statSync } from "node:fs";
import { join, extname, normalize } from "node:path";
import { createBrotliCompress, createGzip } from "node:zlib";
import http from "node:http";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};

const compressible = new Set([".html", ".css", ".js", ".mjs", ".json", ".svg"]);

function send404(res) {
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = normalize(decoded).replace(/^([/\\])+/, "");
  return join(root, normalized === "" ? "index.html" : normalized);
}

function contentType(filePath) {
  return mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream";
}

function setCacheHeaders(res, filePath) {
  if (extname(filePath) === ".html") {
    res.setHeader("Cache-Control", "no-cache");
    return;
  }

  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
}

http
  .createServer((req, res) => {
    const filePath = safePath(req.url || "/");

    if (!existsSync(filePath)) {
      send404(res);
      return;
    }

    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      const indexPath = join(filePath, "index.html");
      if (!existsSync(indexPath)) {
        send404(res);
        return;
      }
      return serve(indexPath, req, res);
    }

    serve(filePath, req, res);
  })
  .listen(port, () => {
    console.log(`Serving ${root} on http://127.0.0.1:${port}`);
  });

function serve(filePath, req, res) {
  const type = contentType(filePath);
  setCacheHeaders(res, filePath);
  res.setHeader("Content-Type", type);
  res.setHeader("Vary", "Accept-Encoding");

  const accept = req.headers["accept-encoding"] || "";
  const encoding =
    compressible.has(extname(filePath).toLowerCase()) && /\bbr\b/.test(accept)
      ? "br"
      : compressible.has(extname(filePath).toLowerCase()) && /\bgzip\b/.test(accept)
        ? "gzip"
        : null;

  if (encoding === "br") {
    res.setHeader("Content-Encoding", "br");
    createReadStream(filePath).pipe(createBrotliCompress()).pipe(res);
    return;
  }

  if (encoding === "gzip") {
    res.setHeader("Content-Encoding", "gzip");
    createReadStream(filePath).pipe(createGzip({ level: 9 })).pipe(res);
    return;
  }

  res.setHeader("Content-Length", statSync(filePath).size);
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  createReadStream(filePath).pipe(res);
}
