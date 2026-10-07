#!/usr/bin/env python3
"""
GroupTodo sync server.

index.html is standalone, but browsers outside desktop Chrome/Edge cannot write
to a folder on their own. This serves index.html and exposes a tiny REST API over
a markdown vault so the app reads and writes the very same .md files that Neovim,
Logseq or Obsidian open.

    python3 serve.py [--vault DIR] [--port 8777] [--host 127.0.0.1]
                     [--password-file FILE] [--insecure]

Defaults to the vault path used by the original Neovim config:
    ~/storage/shared/Documents/OrgMode

API
    GET    /api/ping            -> {"ok": true, ...}
    GET    /api/list            -> ["journals/2026-09-17.md", "pages/1/Foo.md", ...]
    GET    /api/file?path=REL   -> raw file contents
    PUT    /api/file?path=REL   -> writes the body (creates parent dirs)
    DELETE /api/file?path=REL   -> deletes the file

Every path is confined to the vault; traversal outside it is refused.

Binds to localhost by default and serves openly there. Reaching it from
anywhere else needs a password, set through GTD_PASSWORD or --password-file:
binding a non-loopback address without one is refused outright rather than
warned about. The password is checked with HTTP Basic, so the browser prompts
for it once and then attaches it to everything -- the page, the service worker
and the API alike.

Basic encodes rather than encrypts, so it is only private over HTTPS. The
intended shape is this server on localhost with TLS terminated in front of it:

    python3 serve.py --vault ~/vaults/work        # localhost, open
    tailscale serve --bg 8777                     # HTTPS, your devices only

    GTD_PASSWORD=... python3 serve.py --vault ~/vaults/work
    tailscale funnel --bg 8777                    # HTTPS, anyone with the URL
                                                  # -- hence the password
"""

import argparse
import base64
import hmac
import json
import os
import posixpath
import re
import sys
import time
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
    password = None        # None = open; anything else = HTTP Basic required
    realm = "GroupTodo"

    # ---------- helpers ----------
    def _send(self, code, body=b"", ctype="text/plain; charset=utf-8"):
        if isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        if not self.password:
            # Only an unprotected local server invites other origins in. Once a
            # password is set the app is served from this origin anyway, and a
            # wildcard would only widen what a hostile page could attempt.
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

    # ---------- the gate ----------
    # HTTP Basic rather than a token the app would have to carry: the browser
    # prompts natively, remembers it per origin, and attaches it to EVERY
    # request -- index.html, sw.js and the API alike. A token in a header would
    # protect the API and leave the page itself open, and would need a login
    # screen inside the app that the service worker then had to reason about.
    #
    # Basic sends the password reversibly encoded, so it is only private over
    # HTTPS. Terminate TLS in front of this (tailscale serve / funnel, or a
    # reverse proxy) and leave this bound to localhost.
    def authorised(self):
        if not self.password:
            return True
        header = self.headers.get("Authorization") or ""
        if not header.startswith("Basic "):
            return False
        try:
            raw = base64.b64decode(header[6:].strip(), validate=True).decode("utf-8")
        except Exception:
            return False
        _, _, supplied = raw.partition(":")
        # compare_digest so a wrong guess takes the same time as a near miss
        return hmac.compare_digest(supplied, self.password)

    def demand_password(self):
        time.sleep(0.5)                 # make a guessing run expensive
        body = b"GroupTodo: password required.\n"
        self.send_response(401)
        self.send_header("WWW-Authenticate", 'Basic realm="%s", charset="UTF-8"' % self.realm)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def log_message(self, fmt, *args):
        if self.path.startswith("/api/file") and self.command == "GET":
            return                      # loading a vault is hundreds of reads; stay quiet
        super().log_message(fmt, *args)

    # ---------- verbs ----------
    def do_OPTIONS(self):
        self._send(204)

    def do_GET(self):
        if not self.authorised():
            return self.demand_password()
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

    # The static and API handlers already suppress bodies for HEAD.
    do_HEAD = do_GET

    def do_PUT(self):
        if not self.authorised():
            return self.demand_password()
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
        if not self.authorised():
            return self.demand_password()
        if urlparse(self.path).path != "/api/file":
            return self._send(404, "not found")
        try:
            self.vault.delete(self._rel())
        except ValueError as exc:
            return self._send(400, str(exc))
        return self._json(200, {"ok": True})

    # ---------- the app itself ----------
    # Served from the script's own folder. index.html alone is enough to run
    # the app; sw.js, manifest.webmanifest and icon.svg are what turn it into
    # something a phone will keep on its home screen and open with no server.
    # When sw.js is missing -- someone copied out index.html and serve.py only
    # -- a built-in copy is served instead, so offline still works.
    FALLBACK_SW = """
const SHELL = "grouptodo-shell-v3";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL)
    .then(c => Promise.all(["./", "./index.html"].map(f => c.add(f).catch(() => {}))))
    .then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== SHELL).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // The vault is never cached: a stale page is fine, stale tasks are not.
  if (url.pathname.indexOf("/api/") !== -1) return;
  if (e.request.mode !== "navigate" &&
      url.pathname !== "/" && !/index\\.html$/.test(url.pathname)) return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        if (r && r.ok) {
          const copy = r.clone();
          caches.open(SHELL).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return r;
      })
      .catch(() => caches.match(e.request, {ignoreSearch: true})
        .then(m => m || caches.match("./index.html", {ignoreSearch: true})))
  );
});
"""

    CTYPES = {
        ".html": "text/html; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".webmanifest": "application/manifest+json; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
        ".css": "text/css; charset=utf-8",
        ".png": "image/png",
        ".md": "text/markdown; charset=utf-8",
    }

    def _file(self, full, ctype, extra=()):
        with open(full, "rb") as fh:
            body = fh.read()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        for k, v in extra:
            self.send_header(k, v)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def _static(self, route):
        name = "index.html" if route in ("/", "") else os.path.basename(route)
        if not re.fullmatch(r"[\w.-]+", name or ""):
            return self._send(404, "not found")
        full = os.path.join(SCRIPT_DIR, name)
        ext = os.path.splitext(name)[1].lower()
        ctype = self.CTYPES.get(ext, "application/octet-stream")

        if name == "sw.js":
            # Service-Worker-Allowed lets the worker claim the whole origin even
            # though it is fetched from a subpath.
            if os.path.isfile(full):
                return self._file(full, ctype, [("Service-Worker-Allowed", "/")])
            body = self.FALLBACK_SW.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Service-Worker-Allowed", "/")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return

        if not os.path.isfile(full):
            return self._send(404, "not found")
        return self._file(full, ctype)


LOOPBACK = ("127.0.0.1", "localhost", "::1")


def read_password(args):
    """Prefer a file, then the environment, then the command line.

    argv is the worst of the three: it shows up in `ps` for every other user on
    the machine and in your shell history. It stays available because it is the
    one that works in a one-line service definition, but it says so."""
    if args.password_file:
        with open(os.path.expanduser(args.password_file), "r", encoding="utf-8") as fh:
            return fh.read().strip()
    if os.environ.get("GTD_PASSWORD"):
        return os.environ["GTD_PASSWORD"].strip()
    if args.password:
        print("note: --password is visible in `ps`; prefer GTD_PASSWORD or --password-file")
        return args.password.strip()
    return None


def main():
    ap = argparse.ArgumentParser(description="Serve GroupTodo over a markdown vault.")
    ap.add_argument("--vault", default=os.environ.get("GTD_VAULT", DEFAULT_VAULT))
    ap.add_argument("--port", type=int, default=int(os.environ.get("GTD_PORT", 8777)))
    ap.add_argument("--host", default=os.environ.get("GTD_HOST", "127.0.0.1"))
    ap.add_argument("--password", help="shared password (see --password-file)")
    ap.add_argument("--password-file", help="file whose contents are the password")
    ap.add_argument("--insecure", action="store_true",
                    help="allow a non-loopback bind with no password (don't)")
    args = ap.parse_args()

    password = read_password(args)
    exposed = args.host not in LOOPBACK

    # Refuse by default rather than warn. The old build printed a warning and
    # served the vault anyway, which is the wrong way round for something
    # holding somebody's work.
    if exposed and not password and not args.insecure:
        sys.exit(
            "refusing to bind %s with no password.\n"
            "  Anyone who can reach that address could read and rewrite the vault.\n"
            "  Either:\n"
            "    GTD_PASSWORD=... python3 serve.py --host %s      (set a password)\n"
            "    python3 serve.py                                  (localhost only, then\n"
            "      put tailscale serve / a reverse proxy in front for TLS)\n"
            "    python3 serve.py --host %s --insecure            (a network you fully trust)"
            % (args.host, args.host, args.host))

    if password and len(password) < 10:
        sys.exit("password too short: use at least 10 characters, it is reachable from a browser")

    Handler.vault = Vault(args.vault)
    Handler.password = password
    count = len(Handler.vault.list())
    print(f"vault : {Handler.vault.root}  ({count} markdown files)")
    print(f"open  : http://{args.host}:{args.port}/")
    print("auth  : " + ("password required" if password else "open (localhost only)"))
    if exposed and password:
        print("note  : HTTP Basic is only private over HTTPS -- terminate TLS in front of this")
    if exposed and not password:
        print("WARNING: --insecure, no password; anyone who can reach this port owns the vault")
    ThreadingHTTPServer((args.host, args.port), Handler).serve_forever()


if __name__ == "__main__":
    main()
