const Backends = {
  /* ---------- IndexedDB (always available) ---------- */
  idb(space = "") {
    const pre = space ? space + "|" : "";
    return {
      kind: "idb", label: space ? "browser storage" : "browser storage", writable: true,
      /* Names apart from the files, as a folder has, so a big area in browser
         storage opens on today's pages and reads the rest behind (#181, #230). */
      async names() {
        const keys = (await IDB.keys("files")).map(String);
        return pre ? keys.filter(k => k.startsWith(pre)).map(k => k.slice(pre.length))
                   : keys.filter(k => !k.includes("|"));
      },
      async readMany(paths, onEach = null) {
        const got = await IDB.getMany("files", paths.map(p => pre + p));
        const out = new Map();
        for (const p of paths) {
          if (got.has(pre + p)) out.set(p, got.get(pre + p));
          if (onEach) onEach(p);
        }
        return out;
      },
      async list() {
        const keys = await IDB.keys("files"), vals = await IDB.all("files");
        const out = new Map();
        keys.forEach((k, i) => {
          if (pre) { if (String(k).startsWith(pre)) out.set(String(k).slice(pre.length), vals[i]); }
          else if (!String(k).includes("|")) out.set(String(k), vals[i]);
        });
        return out;
      },
      async write(path, text) { await IDB.set("files", pre + path, text); },
      async remove(path)      { await IDB.del("files", pre + path); },
      /* One page as it is stored now. The installed app and a tab share this
         storage, so what is here may not be what this window read (#233). */
      async readText(path) {
        const t = await IDB.get("files", pre + path);
        return t == null ? null : String(t);
      },
      async putAsset(path, blob) { await IDB.set("assets", pre + path, blob); },
      async getAsset(path)       { return (await IDB.get("assets", pre + path)) || null; },
    };
  },

  /* ---------- localStorage fallback (IndexedDB blocked) ---------- */
  ls(space = "") {
    const pre = space ? space + "|" : "";
    return {
      kind: "ls", label: "browser storage", writable: true,
      async names() {
        return Array.from(LS.all().keys()).filter(k => pre ? k.startsWith(pre) : !k.includes("|"))
          .map(k => k.slice(pre.length));
      },
      async readMany(paths, onEach = null) {
        const out = new Map();
        for (const p of paths) {
          const t = localStorage.getItem(LS.k(pre + p));
          if (t != null) out.set(p, t);
          if (onEach) onEach(p);
        }
        return out;
      },
      async list() {
        const out = new Map();
        for (const [k, v] of LS.all()) {
          if (pre) { if (k.startsWith(pre)) out.set(k.slice(pre.length), v); }
          else if (!k.includes("|")) out.set(k, v);
        }
        return out;
      },
      async write(path, text) { LS.set(pre + path, text); },
      async remove(path) { LS.del(pre + path); },
      async readText(path) { return localStorage.getItem(LS.k(pre + path)); },
      /* No room in localStorage for a photograph, so a dropped file lives for
         this session only and the drop says so. Choose a folder and it becomes
         a real file like everything else. */
      async putAsset(path, blob) { ASSET_MEM.set(pre + path, blob); },
      async getAsset(path)       { return ASSET_MEM.get(pre + path) || null; },
    };
  },

  /* ---------- memory only (everything blocked) ----------
     Still fully usable for a session; the Vault dialog shouts about it and
     file sync is the only durable home. */
  memory(space = "") {
    const pre = space ? space + "|" : "";
    return {
      kind: "memory", label: "memory only", writable: true, ephemeral: true,
      async list() {
        const out = new Map();
        for (const [k, v] of MEM) if (k.startsWith(pre)) out.set(k.slice(pre.length), v);
        return out;
      },
      async write(path, text) { MEM.set(pre + path, text); },
      async remove(path) { MEM.delete(pre + path); },
      async putAsset(path, blob) { ASSET_MEM.set(pre + path, blob); },
      async getAsset(path)       { return ASSET_MEM.get(pre + path) || null; },
    };
  },

  /* ---------- File System Access API ---------- */
  fs(rootHandle) {
    const dirCache = new Map([["", rootHandle]]);
    async function dirFor(path, create=false) {
      if (dirCache.has(path)) return dirCache.get(path);
      const parts = path.split("/").filter(Boolean);
      let h = rootHandle, sofar = "";
      for (const p of parts) {
        sofar = sofar ? sofar + "/" + p : p;
        if (dirCache.has(sofar)) { h = dirCache.get(sofar); continue; }
        h = await h.getDirectoryHandle(p, {create});
        dirCache.set(sofar, h);
      }
      return h;
    }
    let fileCache = new Map();            // path -> file handle, from the last names()
    const unread = new Map();             // path -> why it could not be read, from the last readMany()
    return {
      kind: "fs", label: rootHandle.name, writable: true, handle: rootHandle, unread,
      /* Every file the app reads, by name only. Walking the folders is quick;
         opening the files is what takes the time, so it is done apart. The
         list is swapped in whole when the walk is done: emptied first, a
         readMany() still running found half its files gone and left them out
         without a word (#188).
         One folder is listed at a time, to the end, before any folder inside
         it. Listed all at once, a phone's folder came back short -- whole
         subfolders of people missing -- with no error to say so (#188). */
      async names() {
        const found = new Map();
        const walk = async (dir, prefix) => {
          const subs = [];
          for await (const [name, h] of dir.entries()) {
            if (name.startsWith(".")) continue;
            const p = prefix ? prefix + "/" + name : name;
            if (h.kind === "directory") { dirCache.set(p, h); subs.push([h, p]); }
            else if (/\.(md|org)$/i.test(name) || isVaultCssPath(p)) found.set(p, h);
          }
          for (const [h, p] of subs) await walk(h, p);
        };
        await walk(rootHandle, "");
        fileCache = found;
        return Array.from(found.keys());
      },
      /* Opened several at a time: one after another, a year of day pages on a
         phone took minutes. One file that will not open is skipped and kept in
         unread, rather than failing the read of every file after it (#188).
         They are opened in the order given, and onEach hears of each one. */
      async readMany(paths, onEach = null) {
        const out = new Map();
        const readOne = async p => {
          try {
            const h = fileCache.get(p) ||
              await (await dirFor(p.split("/").slice(0, -1).join("/"))).getFileHandle(p.split("/").pop());
            /* A file a sync app has not brought down can leave getFile()
               hanging for good, and the read of the whole folder with it. */
            out.set(p, await withTimeout((async () => (await h.getFile()).text())(), FILE_READ_MS, p));
            unread.delete(p);
          } catch (e) { unread.set(p, ((e && e.name) || "Error") + ": " + ((e && e.message) || e)); }
        };
        const queue = paths.slice();
        const worker = async () => {
          while (queue.length) { const p = queue.shift(); await readOne(p); if (onEach) onEach(p); }
        };
        await Promise.all(Array.from({length: Math.min(16, queue.length)}, worker));
        // What would not open in the crowd gets one more try on its own.
        for (const p of paths) if (!out.has(p) && unread.has(p)) await readOne(p);
        return out;
      },
      async list() { return this.readMany(await this.names()); },
      async write(path, text) {
        const dir = await dirFor(path.split("/").slice(0, -1).join("/"), true);
        const fh = await dir.getFileHandle(path.split("/").pop(), {create: true});
        const w = await fh.createWritable();
        await w.write(text); await w.close();
      },
      async remove(path) {
        const dir = await dirFor(path.split("/").slice(0, -1).join("/"));
        await dir.removeEntry(path.split("/").pop());
      },
      /* One file that list() leaves out because it is not markdown -- the
         Planner flow's answer, planner/state.json. Null when it is not there. */
      async readText(path) {
        try {
          const dir = await dirFor(path.split("/").slice(0, -1).join("/"));
          const fh = await dir.getFileHandle(path.split("/").pop());
          return await (await fh.getFile()).text();
        } catch (_) { return null; }
      },
      /* A picture is a file in the folder, next to the markdown that mentions
         it, so the folder you share carries the whole note and not just its
         words. */
      async putAsset(path, blob) {
        const dir = await dirFor(path.split("/").slice(0, -1).join("/"), true);
        const fh = await dir.getFileHandle(path.split("/").pop(), {create: true});
        const w = await fh.createWritable();
        await w.write(blob); await w.close();
      },
      async getAsset(path) {
        try {
          const dir = await dirFor(path.split("/").slice(0, -1).join("/"));
          const fh = await dir.getFileHandle(path.split("/").pop());
          return await fh.getFile();
        } catch (_) { return null; }
      },
    };
  },

  /* ---------- HTTP sync server (serve.py) ---------- */
  http(base) {
    const u = (p, q) => base.replace(/\/$/, "") + p + (q ? "?path=" + encodeURIComponent(q) : "");
    return {
      kind: "http", label: base.replace(/^https?:\/\//, "") || "server", writable: true,
      /* Is the server there? A few bytes, not the vault: this used to be a
         full list(), every file fetched, only to be fetched again (#229). */
      async ping() {
        const r = await fetchWithin(u("/api/ping"), {cache: "no-store"}, 4000);
        if (!r.ok) throw new Error("ping failed: " + r.status);
      },
      /* As the folder backend: names first, the files apart, so a big vault
         on a server opens on today's pages and reads the rest behind your
         back (#181, #229). */
      async names() {
        const r = await fetchWithin(u("/api/list"), {cache: "no-store"}, 15000);
        if (!r.ok) throw new Error("list failed: " + r.status);
        return await r.json();
      },
      /* A file the server no longer has is skipped, as before. A server that
         stops answering half way fails the read: a short vault taken for the
         whole one would look like pages deleted. */
      async readMany(paths, onEach = null) {
        const out = new Map(), queue = paths.slice();
        const worker = async () => {
          while (queue.length) {
            const p = queue.shift();
            const f = await fetchWithin(u("/api/file", p), {cache: "no-store"}, 20000);
            if (f.ok) out.set(p, await f.text());
            if (onEach) onEach(p);
          }
        };
        await Promise.all(Array.from({length: Math.min(8, queue.length)}, worker));
        return out;
      },
      async list() { return this.readMany(await this.names()); },
      async write(path, text) {
        const r = await fetch(u("/api/file", path), {
          method: "PUT", headers: {"Content-Type": "text/plain; charset=utf-8"}, body: text,
        });
        if (!r.ok) throw new Error("write failed: " + r.status);
      },
      async remove(path) {
        const r = await fetch(u("/api/file", path), {method: "DELETE"});
        if (!r.ok && r.status !== 404) throw new Error("remove failed: " + r.status + " " + (await r.text().catch(() => "")));
      },
      /* Ask the server to open the markdown in the editor on its own machine.
         Refused unless serve.py was started with --open-in-editor, and it says
         so in words meant to be shown to somebody. */
      async openFile(path) {
        const r = await fetch(u("/api/open", path),
          {method: "POST", headers: {"X-GroupTodo": "open"}});
        const body = await r.text().catch(() => "");
        if (!r.ok) throw new Error(body || ("The server would not open it (" + r.status + ")."));
        try { return JSON.parse(body); } catch (_) { return {ok: true}; }
      },
      async putAsset(path, blob) {
        const r = await fetch(u("/api/asset", path), {
          method: "PUT", headers: {"Content-Type": blob.type || "application/octet-stream"}, body: blob,
        });
        if (!r.ok) throw new Error("asset write failed: " + r.status);
      },
      async getAsset(path) {
        const r = await fetch(u("/api/asset", path));
        return r.ok ? await r.blob() : null;
      },
    };
  },
};

/* ============================================================
   20_VAULT -- in-memory model over the backend
   ============================================================ */
/* Every space keeps its own record. V points at the active one and shares the
   very same Map and Set objects, so all the single-space code below works
   untouched while saves stay routed to the right backend. */
const LOADED = new Map();   // space name -> {name, backend, pages, raw, dirty, removed}

const V = {
  backend : null,
  pages   : new Map(),   // path -> {props, blocks}
  raw     : new Map(),   // path -> original text (for .org files kept verbatim)
  dirty   : new Set(),
  removed : new Set(),
  loaded  : false,
  syncing : false,
  error   : null,
  space   : null,
};
