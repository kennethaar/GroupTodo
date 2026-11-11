#!/usr/bin/env python3
"""
GroupToDo sync server.

grouptodo.html is standalone, but browsers outside desktop Chrome/Edge cannot
write to a folder on their own. This serves it and exposes a tiny REST API over
a markdown vault so the app reads and writes the very same .md files that Neovim,
Logseq or Obsidian open.

    python3 serve.py [--vault DIR] [--port 8777] [--host 127.0.0.1]
                     [--password-file FILE] [--insecure]
                     [--open-in-editor [--open-with CMD]] [--allow-host NAME]
                     [--log-file FILE] [--verbose]
    python3 serve.py --calendars-only      (only fetches calendar links)

The terminal shows a start box and errors only. Request lines go to
grouptodo.log in Downloads (--log-file or GTD_LOG to move it), which keeps
500 lines and one older file, grouptodo.log.1. A link in either shows only
its first 15 and last 5 characters: a calendar link is a password to that
calendar. --verbose shows every request line in the terminal as well.

The server folder is --vault if given. Otherwise the app chooses it, under
Your areas: serve.py opens this computer's folder picker and remembers the
choice in %APPDATA%\\GroupToDo\\serve.json (~/.config/grouptodo/serve.json
elsewhere). There is no built-in folder: none is served until one is named.

API
    GET    /api/ping            -> {"ok": true, ...}
    GET    /api/asset?path=assets/x.png  -> the bytes of a dropped file
    PUT    /api/asset?path=assets/x.png  -> write one (body is the bytes)
    GET    /api/list            -> ["journals/2026-09-17.md", "pages/1/Foo.md", ...]
    GET    /api/file?path=REL   -> raw file contents
    PUT    /api/file?path=REL   -> writes the body (creates parent dirs)
    DELETE /api/file?path=REL   -> deletes the file
    POST   /api/server-folder   -> opens the folder picker ON THIS MACHINE and
                                   makes the pick the server folder
    DELETE /api/server-folder   -> no server folder (both: localhost, no
                                   password, no --vault; 403 otherwise)
    POST   /api/open?path=REL   -> opens that file in an editor ON THIS MACHINE,
                                   and only with --open-in-editor; 403 otherwise
    GET    /api/calendar?url=U  -> the iCalendar file at U, fetched by the server

The app's CSP only lets it talk to itself and to localhost, so a calendar
link (Outlook, Google, iCloud) is fetched here on its behalf. Only https
links to public addresses are fetched, and only a reply that is an
iCalendar file is passed back, so this is not a general way out to the
network for any page that can reach the port.

--calendars-only runs just that: no vault, no files, only /api/ping and
/api/calendar. It is for an app opened from a folder, which keeps its files
itself and only needs something on this computer to fetch calendar links.

Every path is confined to the vault; traversal outside it is refused.

--open-in-editor lets the app ask for a page to be opened in an editor -- the
"open file" button beside "copy path". The editor runs here, on the machine with
the vault on it, so it is off by default and the flag is the whole consent: with
a password and a tunnel in front, anybody holding that password can make this
process launch an editor on your desktop. Harmless as such things go (it is one
of your own .md files, in a text editor) but it is yours to choose. --open-with
names the command when the system default is not what you want.

Binds to localhost by default and serves openly there. Reaching it from
anywhere else needs a password, set through GTD_PASSWORD or --password-file:
binding a non-loopback address without one is refused outright rather than
warned about. The password is checked with HTTP Basic, so the browser prompts
for it once and then attaches it to everything -- the page, the service worker
and the API alike.

Without a password the API answers only the app: requests from another
site's pages (a foreign Origin) are refused, and so is any Host name but
localhost, the --host address and those given with --allow-host -- otherwise a
site that points its own name at 127.0.0.1 could read the vault. A tunnel with
no password in front therefore needs --allow-host <its name>.

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
import email.utils
import gzip
import hmac
import ipaddress
import json
import os
import posixpath
import re
import shlex
import socket
import subprocess
import sys
import threading
import time
import urllib.request
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs, quote, unquote

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ALLOWED_EXT = (".md", ".org")
# Your own stylesheets, laid over the app's look. Only from pages/8/, the
# folder for the app's own files, so a .css anywhere else stays off limits.
CSS_DIR = "pages/8/"
# Files dragged onto a line: pictures and documents, kept beside the markdown
# that mentions them, in one folder of their own so a vault walk never meets
# them. Anything outside it stays off limits whatever its name.
ASSET_DIR = "assets"
SKIP_DIRS = {".git", ".obsidian", ".trash", "node_modules", "logseq"}
MAX_BODY = 8 * 1024 * 1024
MAX_CALENDAR = 8 * 1024 * 1024
LOG_LINES = 500

# A calendar link is a password to that calendar, so no log shows one in full.
LINK_RE = re.compile(r"(?:https?|webcal)://[^\s\"'<>]+", re.I)
ENCODED_LINK_RE = re.compile(r"(?:https?|webcal)%3A%2F%2F[^\s\"&]*", re.I)


def redact(text):
    """Keep the first 15 and last 5 characters of every link in text."""
    text = ENCODED_LINK_RE.sub(lambda m: unquote(m.group(0)), text)
    return LINK_RE.sub(lambda m: m.group(0) if len(m.group(0)) <= 20
                       else m.group(0)[:15] + "…" + m.group(0)[-5:], text)


def default_log_path():
    downloads = os.path.expanduser("~/Downloads")
    return os.path.join(downloads if os.path.isdir(downloads) else os.path.expanduser("~"),
                        "grouptodo.log")


def config_file():
    """Where serve.py keeps the folder chosen in the app: %APPDATA% on Windows,
    ~/.config elsewhere. GTD_CONFIG names another file."""
    if os.environ.get("GTD_CONFIG"):
        return os.path.abspath(os.path.expanduser(os.environ["GTD_CONFIG"]))
    if os.name == "nt" and os.environ.get("APPDATA"):
        return os.path.join(os.environ["APPDATA"], "GroupToDo", "serve.json")
    return os.path.expanduser("~/.config/grouptodo/serve.json")


def load_config(path):
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
        return data if isinstance(data, dict) else {}
    except (OSError, ValueError):
        return {}


def save_config(path, changes, replace=False):
    data = changes if replace else {**load_config(path), **changes}
    try:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(data, fh, indent=2)
    except OSError:
        pass                        # the choice still holds until serve.py stops


# Which run of serve.py this is: the app says what serve.py offers once per run.
STARTED_AT = time.strftime("%Y-%m-%dT%H:%M:%S") + "-%d" % os.getpid()


def load_folders(config):
    """The server folders chosen in the app, in the order they were added. A
    single folder chosen before there could be several comes along as one.
    None is built in: no folder is served that nobody named."""
    entries = config.get("folders")
    if entries is None and config.get("vault"):
        entries = [{"path": config["vault"]}]
    folders = {}
    for entry in entries or []:
        path = entry.get("path") if isinstance(entry, dict) else None
        if path and os.path.isdir(path):
            add_folder(folders, path, entry.get("name"))
    return folders


def add_folder(folders, path, name=None):
    """Add a folder under its own name, made unique; the same folder twice is
    one entry. Returns the name it has."""
    root = os.path.abspath(os.path.expanduser(path))
    for have, vault in folders.items():
        if os.path.normcase(vault.root) == os.path.normcase(root):
            return have
    base = re.sub(r"[^\w \-]", "", name or os.path.basename(root.rstrip("\\/"))).strip() or "Folder"
    name, n = base, 2
    while name in folders:
        name, n = "%s %d" % (base, n), n + 1
    folders[name] = Vault(root, create=False)
    return name


def folder_info(name, vault):
    return {"name": name, "path": vault.root, "files": len(vault.list()),
            "base": "f/" + quote(name)}


def save_folders(path, folders):
    data = load_config(path)
    data.pop("vault", None)                # the single folder of old is in the list now
    data["folders"] = [{"name": n, "path": v.root} for n, v in folders.items()]
    save_config(path, data, replace=True)


WHY_FOLDER = (
    "No server folder yet.\n"
    "A server folder keeps an area's files on this PC. Every phone, tablet and\n"
    "browser that opens GroupToDo from serve.py then finds that area by itself,\n"
    "with no folder to pick on each one. Firefox and Safari can use it too.")


def ask_for_folders(folders, config_path):
    """At start-up, in a terminal, with no folder yet: say why one helps and
    offer to choose. y picks (and offers another), Enter is not now, x stops
    the asking for good -- the app can still add folders later."""
    print(WHY_FOLDER, flush=True)
    prompt = "Choose a server folder now? [y = choose · Enter = not now · x = don't ask again] "
    while True:
        try:
            answer = input(prompt).strip().lower()
        except EOFError:
            answer = ""
        if answer == "x":
            save_config(config_path, {"ask": False})
            print("Not asked again. Add server folders in the app, under Your areas.", flush=True)
            return
        if answer != "y":
            return
        try:
            path = pick_folder()
        except Exception:                  # no folder window here (Termux): type it
            try:
                path = input("Type the folder's path (Enter to skip): ").strip().strip('"') or None
            except EOFError:
                path = None
        if path and os.path.isdir(path):
            name = add_folder(folders, path)
            save_folders(config_path, folders)
            print("Added %s: %s" % (name, folders[name].root), flush=True)
        elif path:
            print("There is no folder at %s." % path, flush=True)
        prompt = "Another one? [y/N] "


# Run apart, in a Python of its own: a Tk window wants its own main thread,
# and the server's threads should not hold one open.
PICK_SCRIPT = (
    "import sys, tkinter, tkinter.filedialog as fd\n"
    "root = tkinter.Tk(); root.withdraw(); root.attributes('-topmost', True)\n"
    "path = fd.askdirectory(parent=root, title='Server folder for GroupToDo',"
    " initialdir=sys.argv[1] or None, mustexist=True)\n"
    "sys.stdout.write(path or '')\n")


_PICKS = [0]


def pick_folder(start=None):
    """The folder picker of this computer, opened for whoever sits at it.
    A browser never tells a page the path of a folder, so this is the only way
    the app can name one. GTD_PICK_FOLDER answers without a window (tests):
    several paths split by | answer one pick each, the last one after that."""
    if os.environ.get("GTD_PICK_FOLDER"):
        answers = os.environ["GTD_PICK_FOLDER"].split("|")
        answer = answers[min(_PICKS[0], len(answers) - 1)]
        _PICKS[0] += 1
        return os.path.abspath(answer)
    done = subprocess.run([sys.executable, "-c", PICK_SCRIPT, start or ""],
                          capture_output=True, text=True, encoding="utf-8")
    if done.returncode != 0:
        raise RuntimeError((done.stderr.strip().splitlines() or ["no tkinter"])[-1])
    return os.path.abspath(done.stdout.strip()) if done.stdout.strip() else None


class Log:
    """The request lines the terminal no longer shows. At LOG_LINES lines the
    file becomes <name>.1, replacing the older one, and starts again. A line
    marked show also goes to the terminal: that is how errors still surface."""

    def __init__(self, path, echo=False):
        self.path, self.echo = path, echo
        self.lock = threading.Lock()
        try:
            with open(path, encoding="utf-8", errors="replace") as fh:
                self.lines = sum(1 for _ in fh)
        except (OSError, TypeError):    # no file yet, or no path at all
            self.lines = 0

    def write(self, text, show=False):
        text = redact(text)
        with self.lock:
            if show:
                print("! %s  %s" % (time.strftime("%H:%M"), text), flush=True)
            elif self.echo:
                print(text, flush=True)
            if not self.path:
                return
            try:
                if self.lines >= LOG_LINES:
                    os.replace(self.path, self.path + ".1")
                    self.lines = 0
                with open(self.path, "a", encoding="utf-8") as fh:
                    fh.write("%s  %s\n" % (time.strftime("%Y-%m-%d %H:%M:%S"), text))
                self.lines += 1
            except OSError:
                pass                     # a log that cannot be written must not stop the app


def start_box(rows, foot):
    """The terminal's whole start-up message, in a box."""
    pad = max(len(row[0]) for row in rows if row) + 2
    body = [row[0].ljust(pad) + row[1] if row else "" for row in rows]
    width = max(len(line) for line in body + [foot, "GroupToDo started"]) + 2
    out = ["┌─ GroupToDo started " + "─" * (width - 19) + "┐"]
    out += ["│ " + line.ljust(width - 2) + " │" for line in body]
    out.append("├" + "─" * width + "┤")
    out.append("│ " + foot.ljust(width - 2) + " │")
    out.append("└" + "─" * width + "┘")
    return "\n".join(out)


def check_calendar_url(url):
    """Refuse anything but https to a public address."""
    u = urlparse(url)
    if u.scheme != "https" or not u.hostname:
        raise ValueError("only https:// (or webcal://) calendar links are fetched")
    try:
        infos = socket.getaddrinfo(u.hostname, u.port or 443, proto=socket.IPPROTO_TCP)
    except socket.gaierror:
        raise ValueError("cannot find %s" % u.hostname)
    for info in infos:
        if not ipaddress.ip_address(info[4][0].split("%")[0]).is_global:
            raise ValueError("%s is not on the public internet" % u.hostname)


class _CheckedRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        check_calendar_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def fetch_calendar(url):
    url = re.sub(r"^webcal://", "https://", (url or "").strip(), flags=re.I)
    check_calendar_url(url)
    opener = urllib.request.build_opener(_CheckedRedirect)
    req = urllib.request.Request(url, headers={"User-Agent": "GroupToDo calendar import",
                                               "Accept": "text/calendar, */*;q=0.5"})
    with opener.open(req, timeout=20) as r:
        body = r.read(MAX_CALENDAR + 1)
    if len(body) > MAX_CALENDAR:
        raise ValueError("that calendar is too large")
    text = body.decode("utf-8", "replace")
    if "BEGIN:VCALENDAR" not in text[:4096]:
        raise ValueError("that link did not return a calendar")
    return text


def is_vault_css(rel):
    return rel.startswith(CSS_DIR) and rel.lower().endswith(".css")


class Vault:
    def __init__(self, root, create=True):
        self.root = os.path.abspath(os.path.expanduser(root))
        if create:
            os.makedirs(self.root, exist_ok=True)

    def resolve(self, rel):
        """Map a client-supplied relative path to an absolute path inside the vault."""
        if not rel:
            raise ValueError("empty path")
        rel = posixpath.normpath(rel.replace("\\", "/")).lstrip("/")
        if rel.startswith("..") or os.path.isabs(rel):
            raise ValueError("path escapes the vault")
        if not (rel.endswith(ALLOWED_EXT) or is_vault_css(rel)):
            raise ValueError("only .md and .org files are served, and .css from %s" % CSS_DIR)
        full = os.path.abspath(os.path.join(self.root, rel))
        if full != self.root and not full.startswith(self.root + os.sep):
            raise ValueError("path escapes the vault")
        return full

    def resolve_asset(self, rel):
        """Map a client path to a file inside the vault's assets/ folder."""
        if not rel:
            raise ValueError("empty path")
        rel = posixpath.normpath(rel.replace("\\", "/")).lstrip("/")
        if rel.startswith("..") or os.path.isabs(rel):
            raise ValueError("path escapes the vault")
        parts = rel.split("/")
        if parts[0] != ASSET_DIR or len(parts) < 2 or any(p in ("", ".", "..") for p in parts):
            raise ValueError("only files under %s/ are served" % ASSET_DIR)
        if parts[-1].endswith(ALLOWED_EXT):
            raise ValueError("pages are served from /api/file")
        full = os.path.abspath(os.path.join(self.root, rel))
        if not full.startswith(os.path.join(self.root, ASSET_DIR) + os.sep):
            raise ValueError("path escapes the vault")
        return full

    def read_asset(self, rel):
        with open(self.resolve_asset(rel), "rb") as fh:
            return fh.read()

    def write_asset(self, rel, data):
        full = self.resolve_asset(rel)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        tmp = full + ".tmp"
        with open(tmp, "wb") as fh:
            fh.write(data)
        os.replace(tmp, full)

    def list(self):
        out = []
        for dirpath, dirnames, filenames in os.walk(self.root):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
            for name in filenames:
                if name.startswith("."):
                    continue
                full = os.path.join(dirpath, name)
                rel = os.path.relpath(full, self.root).replace(os.sep, "/")
                if name.endswith(ALLOWED_EXT) or is_vault_css(rel):
                    out.append(rel)
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


def open_in_editor(full, command=None):
    """Open one file in an editor on THIS machine. Returns what was used.

    A browser cannot launch a program, which is right, so the only process in a
    position to do this is the one already holding the vault. An explicit
    command wins; otherwise the system's own idea of who owns a .md file, which
    on Windows is Notepad on a stock install, and the Notepad fallback is there
    for the machine where nothing is registered for the extension at all."""
    if command:
        argv = shlex.split(command) + [full]
        subprocess.Popen(argv)
        return os.path.basename(argv[0])
    if sys.platform.startswith("win"):
        try:
            os.startfile(full)             # noqa: S606 - the default handler
            return "the default editor"
        except OSError:
            subprocess.Popen(["notepad.exe", full])
            return "Notepad"
    if sys.platform == "darwin":
        subprocess.Popen(["open", "-t", full])
        return "the default editor"
    subprocess.Popen(["xdg-open", full])
    return "the default editor"


class Handler(BaseHTTPRequestHandler):
    server_version = "GroupToDo/1.0"
    vault = None           # the folder at the root, /api/...: --vault, or none
    folders = {}           # name -> Vault, each at /f/<name>/api/...: chosen in the app
    calendars_only = False
    folder_locked = False  # --vault given: the command line decides, not the app
    local_only = True      # bound to this computer, so a folder picker opens for its user
    config_path = None     # where the app's choice of folder is remembered
    password = None       # None = open; anything else = HTTP Basic required
    realm = "GroupToDo"
    log = Log(None, echo=True)  # main() points this at the log file
    allow_open = False     # --open-in-editor: may launch an editor on this box
    open_with = None       # --open-with: the command to launch, if not the default
    allow_hosts = ()       # --allow-host: names besides localhost this answers to

    # ---------- who may ask ----------
    # With no password the API is open to anything that can reach the port,
    # and every web page in the browser can. Two checks keep it to the app:
    #
    # Origin: a page on another site always sends one with a cross-origin
    # request, so anything but this server's own origin, another localhost
    # port, or "null" (the app opened from a file) is refused outright.
    #
    # Host: a site can point its own name at 127.0.0.1 (DNS rebinding) and its
    # page is then same-origin with this server, so it sends no Origin at all.
    # Its Host header still carries its own name, so without a password only
    # localhost and the names given with --allow-host are answered. With a
    # password the rebound page has no credentials, so any name will do.
    def _origin_allowed(self, origin):
        if not origin or origin == "null":
            return True
        u = urlparse(origin)
        if u.hostname in LOOPBACK or u.hostname == LOCAL_NAME:
            return True
        return u.netloc.lower() == (self.headers.get("Host") or "").lower()

    def _host_allowed(self):
        if self.password:
            return True
        host = urlparse("//" + (self.headers.get("Host") or "")).hostname or ""
        return host in LOOPBACK or host == LOCAL_NAME or host in self.allow_hosts

    def refused(self):
        """Send a 403 and return True when this request is not from the app."""
        if not urlparse(self.path).path.startswith("/api/"):
            return False
        if not self._host_allowed():
            self._send(403, "This server does not answer to %s. If that is your own name for it, "
                            "start it with --allow-host %s." % (self.headers.get("Host"),
                            urlparse("//" + (self.headers.get("Host") or "")).hostname))
            return True
        if not self._origin_allowed(self.headers.get("Origin")):
            self._send(403, "This endpoint is for the app itself.")
            return True
        return False

    # ---------- helpers ----------
    def _send(self, code, body=b"", ctype="text/plain; charset=utf-8"):
        if isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        origin = self.headers.get("Origin")
        if not self.password and origin and self._origin_allowed(origin):
            # Only an unprotected local server invites other origins in, and
            # only the app's own: opened from a file, or from another localhost
            # port. Once a password is set the app is served from this origin.
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Vary", "Origin")
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
    # request -- the page, sw.js and the API alike. A token in a header would
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
        body = b"GroupToDo: password required.\n"
        self.send_response(401)
        self.send_header("WWW-Authenticate", 'Basic realm="%s", charset="UTF-8"' % self.realm)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def log_request(self, code="-", size="-"):
        if isinstance(code, HTTPStatus):
            code = code.value
        if self.path.startswith("/api/file") and self.command == "GET":
            return                      # loading a vault is hundreds of reads; stay quiet
        # A failed calendar says so itself; any other server error shows here.
        show = str(code).startswith("5") and not self.path.startswith("/api/calendar")
        self.log.write('%s "%s" %s %s' % (self.address_string(), self.requestline, code, size), show)

    def log_error(self, fmt, *args):
        self.log.write(fmt % args, show=True)

    def log_message(self, fmt, *args):
        self.log.write("%s %s" % (self.address_string(), fmt % args))

    # ---------- verbs ----------
    def do_OPTIONS(self):
        if not self._scope() or self.refused():
            return
        self._send(204)

    def do_GET(self):
        if not self.authorised():
            return self.demand_password()
        if self.refused():
            return
        if not self._scope():
            return
        route = urlparse(self.path).path
        if route == "/api/ping":
            if self.calendars_only:
                return self._json(200, {"ok": True, "calendarsOnly": True})
            vault = self.vault
            return self._json(200, {"ok": True, "vault": vault.root if vault else None,
                                    "vaultChosen": vault is not None,
                                    "files": len(vault.list()) if vault else 0,
                                    "folders": [folder_info(n, v) for n, v in self.folders.items()],
                                    "folderChoosable": self.folder_choosable(),
                                    "startedAt": STARTED_AT,
                                    "logFile": self.log.path,
                                    "open_in_editor": bool(self.allow_open)})
        if self.vault is None and route.startswith("/api/") and route != "/api/calendar":
            return self._send(404, "this helper only fetches calendars" if self.calendars_only
                              else "no server folder: choose one in the app, under Your areas")
        if route == "/api/list":
            return self._json(200, self.vault.list())
        if route == "/api/calendar":
            url = (parse_qs(urlparse(self.path).query).get("url") or [""])[0]
            try:
                return self._send(200, fetch_calendar(url), "text/calendar; charset=utf-8")
            except ValueError as exc:
                self.log.write("Calendar %s failed: %s" % (url, exc), show=True)
                return self._send(400, str(exc))
            except Exception as exc:
                self.log.write("Calendar %s failed: %s" % (url, exc), show=True)
                return self._send(502, "could not fetch the calendar: %s" % exc)
        if route == "/api/file":
            try:
                return self._send(200, self.vault.read(self._rel()), "text/markdown; charset=utf-8")
            except (ValueError, KeyError) as exc:
                return self._send(400, str(exc))
            except FileNotFoundError:
                return self._send(404, "not found")
        if route == "/api/asset":
            rel = self._rel()
            try:
                body = self.vault.read_asset(rel)
            except (ValueError, KeyError) as exc:
                return self._send(400, str(exc))
            except (FileNotFoundError, IsADirectoryError):
                return self._send(404, "not found")
            ext = os.path.splitext(rel)[1].lower()
            return self._send(200, body, self.CTYPES.get(ext, "application/octet-stream"))
        return self._static(route)

    # The static and API handlers already suppress bodies for HEAD.
    do_HEAD = do_GET

    # ---------- server folders, chosen in the app ----------
    # Several folders, one per area, each answering at /f/<name>/ exactly as a
    # server with that one folder would. Changed only for a server on this
    # computer with no password and no --vault: the folder picker opens on
    # this desktop, so it must be the person at it who asked, and nobody
    # across a network may point the server somewhere else.
    def _scope(self):
        """Answer a request to /f/<name>/... from that folder. False when there
        is no such folder; the 404 is sent."""
        m = re.match(r"^/f/([^/?]+)(/.*)$", self.path)
        if not m:
            return True
        folder = self.folders.get(unquote(m.group(1)))
        if folder is None:
            self._send(404, "no server folder called %s" % unquote(m.group(1)))
            return False
        self.vault = folder              # this request only: the class keeps the root's
        self.path = m.group(2)
        return True

    def folder_choosable(self):
        return (not self.calendars_only and not self.folder_locked
                and not self.password and self.local_only)

    def server_folder(self, remove):
        if not self.folder_choosable():
            return self._send(403, "Server folders are set where serve.py starts (--vault), "
                                   "or serve.py does not run on this computer.")
        # As /api/open: a header only the app's own fetch sends forces a
        # preflight that another site's page cannot pass.
        if (self.headers.get("X-GroupTodo") or "") != "folder":
            return self._send(403, "This endpoint is for the app itself.")
        if remove:
            name = (parse_qs(urlparse(self.path).query).get("name") or [""])[0]
            if self.folders.pop(name, None) is None:
                return self._send(404, "no server folder called %s" % name)
            save_folders(self.config_path, self.folders)
            self.log.write("Server folder %s removed" % name, show=True)
            return self._json(200, {"ok": True})
        try:
            path = pick_folder()
        except Exception as exc:
            self.log.write("Folder picker failed: %s" % exc, show=True)
            return self._send(500, "Could not open a folder picker here: %s" % exc)
        if not path:
            return self._json(200, {"ok": True, "cancelled": True})
        name = add_folder(self.folders, path)
        save_folders(self.config_path, self.folders)
        self.log.write("Server folder %s added: %s" % (name, self.folders[name].root), show=True)
        return self._json(200, {"ok": True, "folder": folder_info(name, self.folders[name])})

    def do_POST(self):
        if not self.authorised():
            return self.demand_password()
        if not self._scope() or self.refused():
            return
        if urlparse(self.path).path == "/api/server-folder":
            return self.server_folder(remove=False)
        if self.vault is None or urlparse(self.path).path != "/api/open":
            return self._send(404, "not found")
        if not self.allow_open:
            return self._send(403, "This server was not started with --open-in-editor, "
                                   "so it will not launch anything.")
        # A plain cross-origin POST needs no preflight, so any page in the
        # browser could otherwise poke an open server into launching an editor.
        # Demanding a header that is not on the Allow-Headers list forces a
        # preflight the browser then refuses -- the app's own fetch, same
        # origin, is unaffected.
        if (self.headers.get("X-GroupTodo") or "") != "open":
            return self._send(403, "This endpoint is for the app itself.")
        try:
            full = self.vault.resolve(self._rel())
        except ValueError as exc:
            return self._send(400, str(exc))
        if not os.path.isfile(full):
            return self._send(404, "There is no such file in the vault yet.")
        try:
            used = open_in_editor(full, self.open_with)
        except Exception as exc:          # no editor, no display, a bad --open-with
            return self._send(500, "Could not open an editor here: %s" % exc)
        return self._json(200, {"ok": True, "with": used})

    def do_PUT(self):
        if not self.authorised():
            return self.demand_password()
        if not self._scope() or self.refused():
            return
        route = urlparse(self.path).path
        if self.vault is None or route not in ("/api/file", "/api/asset"):
            return self._send(404, "not found")
        length = int(self.headers.get("Content-Length") or 0)
        if length > MAX_BODY:
            return self._send(413, "too large")
        raw = self.rfile.read(length)
        try:
            if route == "/api/asset":
                self.vault.write_asset(self._rel(), raw)
            else:
                self.vault.write(self._rel(), raw.decode("utf-8"))
        except ValueError as exc:
            return self._send(400, str(exc))
        return self._json(200, {"ok": True})

    def do_DELETE(self):
        if not self.authorised():
            return self.demand_password()
        if not self._scope() or self.refused():
            return
        if urlparse(self.path).path == "/api/server-folder":
            return self.server_folder(remove=True)
        if self.vault is None or urlparse(self.path).path != "/api/file":
            return self._send(404, "not found")
        try:
            self.vault.delete(self._rel())
        except ValueError as exc:
            return self._send(400, str(exc))
        except OSError as exc:
            # A file a sync client has open (OneDrive does this) will not go.
            # Say so, so the app keeps the delete and tries again, instead of
            # the old file of a moved project turning up again at the next load.
            return self._send(500, "could not delete: " + str(exc))
        return self._json(200, {"ok": True})

    # ---------- the app itself ----------
    # Served from the script's own folder. grouptodo.html alone is enough to run
    # the app; sw.js, manifest.webmanifest and icon.svg are what turn it into
    # something a phone will keep on its home screen and open with no server.
    # When sw.js is missing -- someone copied out grouptodo.html and serve.py only
    # -- a built-in copy is served instead, so offline still works.
    FALLBACK_SW = """
const SHELL = "grouptodo-shell-v3";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL)
    .then(c => Promise.all(["./", "./grouptodo.html"].map(f => c.add(f).catch(() => {}))))
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
      url.pathname !== "/" && !/grouptodo\\.html$/.test(url.pathname)) return;
  // As sw.js: the network gets 2.5 s for the whole file, then the copy opens.
  const net = fetch(e.request).then(async r => {
    if (r && r.ok) {
      const copy = r.clone();
      await r.clone().arrayBuffer();
      await caches.open(SHELL).then(c => c.put(e.request, copy)).catch(() => {});
    }
    return r;
  });
  e.waitUntil(net.then(() => {}, () => {}));
  const kept = () => caches.match(e.request, {ignoreSearch: true})
    .then(m => m || caches.match("./grouptodo.html", {ignoreSearch: true}));
  e.respondWith(Promise.race([net.catch(() => "down"), new Promise(r => setTimeout(r, 2500, "slow"))])
    .then(f => (f !== "slow" && f !== "down") ? f
      : kept().then(m => m || (f === "slow" ? net : Response.error()))));
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
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".avif": "image/avif",
        ".bmp": "image/bmp",
        ".ico": "image/x-icon",
        ".pdf": "application/pdf",
        ".txt": "text/plain; charset=utf-8",
        ".csv": "text/csv; charset=utf-8",
        ".zip": "application/zip",
    }

    # The app is one 3 MB file, fetched again on every start (the service
    # worker asks the network first). Sent whole each time, a start over a weak
    # link waited for all of it. Now an unchanged file is a 304 of a few bytes,
    # and a changed one goes compressed to anyone who takes gzip.
    _GZ = {}                                  # full path -> (mtime_ns, gzipped bytes)
    _GZ_TYPES = ("text/", "application/javascript", "application/json",
                 "application/manifest+json", "image/svg+xml")

    def _file(self, full, ctype, extra=()):
        st = os.stat(full)
        etag = '"%x-%x"' % (st.st_size, st.st_mtime_ns)
        modified = email.utils.formatdate(st.st_mtime, usegmt=True)

        def head(code):
            self.send_response(code)
            self.send_header("Content-Type", ctype)
            for k, v in extra:
                self.send_header(k, v)
            self.send_header("ETag", etag)
            self.send_header("Last-Modified", modified)
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Vary", "Accept-Encoding")

        if self._unchanged(etag, st.st_mtime):
            head(304)
            self.end_headers()
            return
        with open(full, "rb") as fh:
            body = fh.read()
        zipped = False
        if (len(body) > 1024 and ctype.startswith(self._GZ_TYPES)
                and "gzip" in (self.headers.get("Accept-Encoding") or "")):
            hit = self._GZ.get(full)
            if not hit or hit[0] != st.st_mtime_ns:
                hit = (st.st_mtime_ns, gzip.compress(body, 6))
                self._GZ[full] = hit
            body, zipped = hit[1], True
        head(200)
        if zipped:
            self.send_header("Content-Encoding", "gzip")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def _unchanged(self, etag, mtime):
        tags = self.headers.get("If-None-Match")
        if tags:
            return etag in [t.strip() for t in tags.split(",")] or tags.strip() == "*"
        since = self.headers.get("If-Modified-Since")
        if not since:
            return False
        try:
            return int(mtime) <= email.utils.parsedate_to_datetime(since).timestamp()
        except (TypeError, ValueError, OverflowError):
            return False

    def _static(self, route):
        # "/" is the app itself, not the redirect stub that exists for static hosts.
        name = "grouptodo.html" if route in ("/", "") else os.path.basename(route)
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
# The address the start box gives. Browsers send every *.localhost name to this
# computer themselves (RFC 6761), so it needs no setup and no site on the
# internet can point it anywhere else: as safe to answer as 127.0.0.1.
LOCAL_NAME = "grouptodo.localhost"


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
    ap = argparse.ArgumentParser(description="Serve GroupToDo over a markdown vault.")
    ap.add_argument("--vault", default=os.environ.get("GTD_VAULT"))
    ap.add_argument("--port", type=int, default=int(os.environ.get("GTD_PORT", 8777)))
    ap.add_argument("--host", default=os.environ.get("GTD_HOST", "127.0.0.1"))
    ap.add_argument("--password", help="shared password (see --password-file)")
    ap.add_argument("--password-file", help="file whose contents are the password")
    ap.add_argument("--allow-host", action="append",
                    default=[h for h in os.environ.get("GTD_ALLOW_HOST", "").split(",") if h],
                    help="another name this answers to with no password, e.g. a tailscale name")
    ap.add_argument("--insecure", action="store_true",
                    help="allow a non-loopback bind with no password (don't)")
    ap.add_argument("--calendars-only", action="store_true",
                    help="no vault: only fetch calendar links for an app opened from a folder")
    ap.add_argument("--open-in-editor", action="store_true",
                    default=bool(os.environ.get("GTD_OPEN_IN_EDITOR")),
                    help="let the app open a page in an editor on THIS machine")
    ap.add_argument("--open-with", default=os.environ.get("GTD_OPEN_WITH"),
                    help="the command --open-in-editor runs (default: the system's own)")
    ap.add_argument("--log-file", default=os.environ.get("GTD_LOG") or default_log_path(),
                    help="where request lines go (default: grouptodo.log in Downloads)")
    ap.add_argument("--verbose", action="store_true",
                    help="also show every request line here in the terminal")
    args = ap.parse_args()
    # A box drawn on a console or pipe that cannot spell it must not crash.
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass

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

    if args.open_with and not args.open_in_editor:
        sys.exit("--open-with does nothing without --open-in-editor")

    Handler.password = password
    Handler.allow_open = args.open_in_editor
    Handler.open_with = args.open_with
    # The address it was told to bind is a name it answers to, of course.
    Handler.allow_hosts = tuple(h.strip().lower() for h in args.allow_host + [args.host])
    log_file = os.path.abspath(os.path.expanduser(args.log_file))
    Handler.log = Log(log_file, echo=args.verbose)
    Handler.config_path = config_file()
    Handler.calendars_only = args.calendars_only
    Handler.folder_locked = bool(args.vault)
    Handler.local_only = not exposed
    rows = [("Go to", f"http://{LOCAL_NAME if args.host in LOOPBACK else args.host}:{args.port}/"), None]
    if args.calendars_only:
        Handler.vault = None
        rows.append(("Mode", "calendars only - fetches calendar links, keeps no files"))
    elif args.vault:
        # Named on the command line: served at the root, as it always was.
        Handler.vault = Vault(args.vault, create=True)
        rows.append(("Server folder", f"{Handler.vault.root}  ({len(Handler.vault.list())} files)"))
    else:
        config = load_config(Handler.config_path)
        Handler.folders = load_folders(config)
        interactive = sys.stdin.isatty() or bool(os.environ.get("GTD_INTERACTIVE"))
        if not Handler.folders and not exposed and interactive and config.get("ask", True):
            ask_for_folders(Handler.folders, Handler.config_path)
        # Folders, not the app's areas: those are folders the browser opens
        # itself, out of sight of this server. Say where they are managed.
        first = "Server folders" if len(Handler.folders) > 1 else "Server folder"
        for i, (name, vault) in enumerate(Handler.folders.items()):
            rows.append((first if i == 0 else "", f"{name}: {vault.root}  ({len(vault.list())} files)"))
        if not Handler.folders:
            rows.append((first, "none"))
    if not args.calendars_only and not exposed:
        rows.append(("Use it", "in the app, Your areas › Use server folder"))
    rows.append(("Access", "password required" if password else "open (localhost only)"))
    if args.open_in_editor:
        rows.append(("Editor", (args.open_with or "the system default") + ", on this machine"))
    rows.append(("Logs", log_file))
    if exposed and password:
        rows.append(("Note", "HTTP Basic is only private over HTTPS: put TLS in front"))
    if exposed and not password:
        rows.append(("WARNING", "--insecure, no password: anyone who can reach this port owns the vault"))
    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(start_box(rows, "Keep this window open. Press Ctrl+C to stop."), flush=True)
    Handler.log.write("GroupToDo started on %s port %s" % (args.host, args.port))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        Handler.log.write("GroupToDo stopped")
        print("GroupToDo stopped.")


if __name__ == "__main__":
    main()
