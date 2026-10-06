#!/usr/bin/env python3
"""
GroupTodo sync server.

index.html is standalone, but browsers outside desktop Chrome/Edge cannot write
to a folder on their own. This serves index.html and exposes a tiny REST API over
a markdown vault so the app reads and writes the very same .md files that Neovim,
Logseq or Obsidian open.

    python3 serve.py [--vault DIR] [--port 8777] [--host 127.0.0.1]

Defaults to the vault path used by the original Neovim config:
    ~/storage/shared/Documents/OrgMode

API
    GET    /api/ping            -> {"ok": true, ...}
    GET    /api/list            -> ["journals/2026-09-17.md", "pages/1/Foo.md", ...]
    GET    /api/file?path=REL   -> raw file contents
    PUT    /api/file?path=REL   -> writes the body (creates parent dirs)
    DELETE /api/file?path=REL   -> deletes the file

Every path is confined to the vault; traversal outside it is refused.
Binds to localhost by default. Pass --host 0.0.0.0 only on a network you trust:
there is no authentication, so anyone who can reach the port can read and edit
your vault.
"""

import argparse
import json
import os
import posixpath
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_VAULT = os.path.expanduser("~/storage/shared/Documents/OrgMode")
ALLOWED_EXT = (".md", ".org")
SKIP_DIRS = {".git", ".obsidian", ".trash", "node_modules", "logseq"}
MAX_BODY = 8 * 1024 * 1024


class Vault:
    def __init__(self, root):
        self.root = os.path.abspath(os.path.expanduser(root))
        os.makedirs(self.root, exist_ok=True)

    def resolve(self, rel):
        """Map a client-supplied relative path to an absolute path inside the vault."""
        if not rel:
            raise ValueError("empty path")
        rel = posixpath.normpath(rel.replace("\\", "/")).lstrip("/")
        if rel.startswith("..") or os.path.isabs(rel):
            raise ValueError("path escapes the vault")
        if not rel.endswith(ALLOWED_EXT):
            raise ValueError("only .md and .org files are served")
        full = os.path.abspath(os.path.join(self.root, rel))
        if full != self.root and not full.startswith(self.root + os.sep):
            raise ValueError("path escapes the vault")
        return full

    def list(self):
        out = []
        for dirpath, dirnames, filenames in os.walk(self.root):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
            for name in filenames:
                if not name.endswith(ALLOWED_EXT) or name.startswith("."):
                    continue
                full = os.path.join(dirpath, name)
                out.append(os.path.relpath(full, self.root).replace(os.sep, "/"))
        return sorted(out)

    def read(self, rel):
        with open(self.resolve(rel), "r", encoding="utf-8") as fh:
            return fh.read()

    def write(self, rel, text):
        full = self.resolve(rel)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        tmp = full + ".tmp"
        with open(tmp, "w", encoding="utf-8") as fh:
            fh.write(text)
        os.replace(tmp, full)          # atomic: never leaves a half-written page

    def delete(self, rel):
        full = self.resolve(rel)
        if os.path.exists(full):
            os.remove(full)


class Handler(BaseHTTPRequestHandler):
    server_version = "GroupTodo/1.0"
    vault = None

    # ---------- helpers ----------
    def _send(self, code, body=b"", ctype="text/plain; charset=utf-8"):
        if isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def _json(self, code, obj):
        self._send(code, json.dumps(obj), "application/json; charset=utf-8")

    def _rel(self):
        q = parse_qs(urlparse(self.path).query)
        vals = q.get("path") or []
        return vals[0] if vals else ""

    def log_message(self, fmt, *args):
        if self.path.startswith("/api/file") and self.command == "GET":
            return                      # loading a vault is hundreds of reads; stay quiet
        super().log_message(fmt, *args)

    # ---------- verbs ----------
    def do_OPTIONS(self):
        self._send(204)

    def do_GET(self):
        route = urlparse(self.path).path
        if route == "/api/ping":
            return self._json(200, {"ok": True, "vault": self.vault.root, "files": len(self.vault.list())})
        if route == "/api/list":
            return self._json(200, self.vault.list())
        if route == "/api/file":
            try:
                return self._send(200, self.vault.read(self._rel()), "text/markdown; charset=utf-8")
            except (ValueError, KeyError) as exc:
                return self._send(400, str(exc))
            except FileNotFoundError:
                return self._send(404, "not found")
        return self._static(route)

    def do_PUT(self):
        if urlparse(self.path).path != "/api/file":
            return self._send(404, "not found")
        length = int(self.headers.get("Content-Length") or 0)
        if length > MAX_BODY:
            return self._send(413, "too large")
        body = self.rfile.read(length).decode("utf-8")
        try:
            self.vault.write(self._rel(), body)
        except ValueError as exc:
            return self._send(400, str(exc))
        return self._json(200, {"ok": True})

    def do_DELETE(self):
        if urlparse(self.path).path != "/api/file":
            return self._send(404, "not found")
        try:
            self.vault.delete(self._rel())
        except ValueError as exc:
            return self._send(400, str(exc))
        return self._json(200, {"ok": True})

    # ---------- the app itself ----------
    # A service worker so the app can open itself when this server is not
    # running -- on Android that is whenever the OS decides Termux has had
    # enough. It is generated here rather than shipped as a file, so index.html
    # stays a single standalone document.
    SERVICE_WORKER = """
const SHELL = "grouptodo-shell-v1";

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL)
    .then(c => c.addAll(["./", "./index.html"]))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== SHELL).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // The vault is never cached: a stale page is fine, stale tasks are not.
  if (url.pathname.indexOf("/api/") === 0) return;
  if (e.request.mode !== "navigate" &&
      url.pathname !== "/" && !/index\\.html$/.test(url.pathname)) return;
  // Network first, so a newer index.html is picked up whenever the server is up.
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const copy = r.clone();
        caches.open(SHELL).then(c => c.put(e.request, copy)).catch(() => {});
        return r;
      })
      .catch(() => caches.match(e.request).then(m => m || caches.match("./index.html")))
  );
});
"""

    def _static(self, route):
        if route == "/sw.js":
            self.send_response(200)
            self.send_header("Content-Type", "application/javascript; charset=utf-8")
            self.send_header("Service-Worker-Allowed", "/")
            self.send_header("Cache-Control", "no-cache")
            body = self.SERVICE_WORKER.encode("utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return

        name = "index.html" if route in ("/", "") else os.path.basename(route)
        if not re.fullmatch(r"[\w.-]+", name or ""):
            return self._send(404, "not found")
        full = os.path.join(SCRIPT_DIR, name)
        if not os.path.isfile(full):
            return self._send(404, "not found")
        ctype = "text/html; charset=utf-8" if name.endswith(".html") else "application/octet-stream"
        with open(full, "rb") as fh:
            return self._send(200, fh.read(), ctype)


def main():
    ap = argparse.ArgumentParser(description="Serve GroupTodo over a markdown vault.")
    ap.add_argument("--vault", default=os.environ.get("GTD_VAULT", DEFAULT_VAULT))
    ap.add_argument("--port", type=int, default=int(os.environ.get("GTD_PORT", 8777)))
    ap.add_argument("--host", default=os.environ.get("GTD_HOST", "127.0.0.1"))
    args = ap.parse_args()

    Handler.vault = Vault(args.vault)
    count = len(Handler.vault.list())
    print(f"vault : {Handler.vault.root}  ({count} markdown files)")
    print(f"open  : http://{args.host}:{args.port}/")
    if args.host not in ("127.0.0.1", "localhost"):
        print("warning: no authentication -- anyone who can reach this port can edit the vault")
    ThreadingHTTPServer((args.host, args.port), Handler).serve_forever()


if __name__ == "__main__":
    main()
