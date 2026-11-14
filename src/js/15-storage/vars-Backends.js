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
      async delAsset(path)       { await IDB.del("assets", pre + path); },
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
      async delAsset(path)       { ASSET_MEM.delete(pre + path); },
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
      async delAsset(path)       { ASSET_MEM.delete(pre + path); },
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
    let unlisted = [];                    // [handle, path] of folders names() left for laterNames()
    const unread = new Map();             // path -> why it could not be read, from the last readMany()
    /* How long the last read took, for Check the folder (#342): the listing,
       then every file read since, opening and reading its text apart. Which
       of those takes the time on a phone says what would make it quicker. */
    let timing = null;
    /* The slowest folders to list, the day's read in parts, and each file's
       date and size: what a start in seconds would have to avoid (#181). */
    const newTiming = () => ({at: Date.now(), dirs: 0, listMs: 0, files: 0, kb: 0, readMs: 0, openMs: 0, textMs: 0,
                              slowest: [], atOnce: 16, folders: [], sigs: new Map(), day: null, unchanged: null});
    const slowFolders = (list, p, ms, n) => { list.push([p || "(top)", ms, n]); list.sort((a, b) => b[1] - a[1]); list.length = Math.min(list.length, 5); };
    let collect = null;                   // [path, open ms, text ms] of each file while readDays() reads
    let dayRead = false;                  // readDays() ran since the last names(): its reads count with the listing's
    return {
      kind: "fs", label: rootHandle.name, writable: true, handle: rootHandle, unread,
      get timing() { return timing; },
      /* Every file the app reads, by name only. Walking the folders is quick;
         opening the files is what takes the time, so it is done apart. The
         list is swapped in whole when the walk is done: emptied first, a
         readMany() still running found half its files gone and left them out
         without a word (#188).
         One folder is listed at a time, to the end, before any folder inside
         it. Listed all at once, a phone's folder came back short -- whole
         subfolders of people missing -- with no error to say so (#188). */
      /* With a day (#181), a person's folder of day pages is not listed, nor
         the folders named in late: years of them made the first draw wait.
         Today's page is opened by its name, and laterNames() lists the rest
         once the day is drawn. */
      async names({quiet = false, today = null, late = []} = {}) {
        const found = new Map(), later = [], began = performance.now(), folders = [];
        let dirs = 0;
        const walk = async (dir, prefix) => {
          const subs = [], t = performance.now();
          let n = 0;
          dirs++;
          for await (const [name, h] of dir.entries()) {
            n++;
            if (name.startsWith(".")) continue;
            const p = prefix ? prefix + "/" + name : name;
            if (h.kind === "directory") { dirCache.set(p, h); subs.push([h, p]); }
            else if (/\.(md|org)$/i.test(name) || isVaultCssPath(p)) found.set(p, h);
          }
          slowFolders(folders, prefix, performance.now() - t, n);
          for (const [h, p] of subs) {
            if (today && (prefix === JOURNALS || late.includes(p))) { later.push([h, p]); continue; }
            await walk(h, p);
          }
        };
        await walk(rootHandle, "");
        for (const [h, p] of later) {
          if (!p.startsWith(JOURNALS + "/")) continue;
          try { found.set(p + "/" + today + ".md", await h.getFileHandle(today + ".md")); }
          catch (e) { if (!/NotFound|TypeMismatch/i.test((e && e.name) || "")) throw e; }
        }
        fileCache = new Map([...(dayRead ? fileCache : []), ...found]);
        const listMs = performance.now() - began;
        // The day pages read before this listing (readDays) count in the same read.
        if (!quiet) {
          if (!dayRead || !timing) timing = newTiming();
          timing.dirs += dirs; timing.listMs += listMs;
          for (const f of folders) slowFolders(timing.folders, ...f);
        }
        dayRead = false;
        if (today) unlisted = later;      // a full listing (Check the folder) leaves a staged read's folders to it
        return Array.from(found.keys());
      },
      /* The given days' pages, by name, with nothing else listed but the
         folder of day pages itself (one level: whose folders are in it). Then
         the files named in files, and the pages straight in each folder of
         dirs, where they are there. Read before the folder is listed, so the
         day is on screen in seconds (#181). */
      async readDays(days, {files = [], dirs = []} = {}) {
        if (!dayRead) timing = newTiming();
        dayRead = true;
        const day = timing.day || (timing.day = {listMs: 0, entries: 0, findMs: 0, readMs: 0, files: []});
        let t = performance.now();
        const want = new Set(days.map(d => d + ".md")), paths = [];
        const gone = e => /NotFound|TypeMismatch/i.test((e && e.name) || "");
        const probe = async (dir, prefix, name) => {
          try { const h = await dir.getFileHandle(name); const p = prefix ? prefix + "/" + name : name; fileCache.set(p, h); paths.push(p); }
          catch (e) { if (!gone(e)) throw e; }
        };
        const shallow = async (path, each) => {
          let dir;
          try { dir = await dirFor(path); } catch (e) { if (gone(e)) return; throw e; }
          for await (const [name, h] of dir.entries()) if (!name.startsWith(".")) await each(name, h, dir);
        };
        // The day folder's own entries first (whose folders, and old day pages straight in it), then today's file in each.
        const people = [];
        if (want.size) await shallow(JOURNALS, (name, h) => {
          day.entries++;
          const p = JOURNALS + "/" + name;
          if (h.kind === "directory") { dirCache.set(p, h); people.push([h, p]); }
          else if (want.has(name)) { fileCache.set(p, h); paths.push(p); }
        });
        day.listMs += performance.now() - t;
        t = performance.now();
        for (const [h, p] of people) for (const d of want) await probe(h, p, d);
        for (const f of files) {
          const cut = f.lastIndexOf("/");
          let dir;
          try { dir = await dirFor(f.slice(0, cut)); } catch (e) { if (gone(e)) continue; throw e; }
          await probe(dir, f.slice(0, cut), f.slice(cut + 1));
        }
        for (const d of dirs) await shallow(d, (name, h) => {
          if (h.kind === "file" && /\.md$/i.test(name)) { fileCache.set(d + "/" + name, h); paths.push(d + "/" + name); }
        });
        day.findMs += performance.now() - t;
        t = performance.now();
        collect = day.files;
        try { return await this.readMany(paths); }
        finally { collect = null; day.readMs += performance.now() - t; }
      },
      hasLater: () => unlisted.length > 0,
      /* The folders names() left out, those pick() takes: every file in them.
         Added to what is known, never swapped in emptied (#188). */
      async laterNames(pick = () => true) {
        const dirs = unlisted.filter(([, p]) => pick(p)), found = new Map(), began = performance.now();
        unlisted = unlisted.filter(([, p]) => !pick(p));
        const walk = async (dir, prefix) => {
          const subs = [], t = performance.now();
          let n = 0;
          if (timing) timing.dirs++;
          for await (const [name, h] of dir.entries()) {
            n++;
            if (name.startsWith(".")) continue;
            const p = prefix + "/" + name;
            if (h.kind === "directory") { dirCache.set(p, h); subs.push([h, p]); }
            else if (/\.(md|org)$/i.test(name)) found.set(p, h);
          }
          if (timing) slowFolders(timing.folders, prefix, performance.now() - t, n);
          for (const [h, p] of subs) await walk(h, p);
        };
        for (const [h, p] of dirs) await walk(h, p);
        fileCache = new Map([...fileCache, ...found]);
        if (timing) timing.listMs += performance.now() - began;
        return Array.from(found.keys());
      },
      /* Opened several at a time: one after another, a year of day pages on a
         phone took minutes. One file that will not open is skipped and kept in
         unread, rather than failing the read of every file after it (#188).
         They are opened in the order given, and onEach hears of each one. */
      async readMany(paths, onEach = null) {
        const out = new Map();
        const began = performance.now();
        const readOne = async p => {
          try {
            const t0 = performance.now();
            const h = fileCache.get(p) ||
              await (await dirFor(p.split("/").slice(0, -1).join("/"))).getFileHandle(p.split("/").pop());
            /* A file a sync app has not brought down can leave getFile()
               hanging for good, and the read of the whole folder with it. */
            let t1 = t0;
            const text = await withTimeout((async () => {
              const file = await h.getFile();
              t1 = performance.now();
              if (timing) timing.sigs.set(p, file.size + ":" + file.lastModified);
              return file.text();
            })(), FILE_READ_MS, p);
            out.set(p, text);
            unread.delete(p);
            if (timing) {
              const t2 = performance.now();
              timing.files++; timing.kb += text.length / 1024;
              timing.openMs += t1 - t0; timing.textMs += t2 - t1;
              timing.slowest.push([p, t2 - t0]);
              timing.slowest = timing.slowest.sort((a, b) => b[1] - a[1]).slice(0, 5);
              if (collect) collect.push([p, t1 - t0, t2 - t1]);
            }
          } catch (e) { unread.set(p, ((e && e.name) || "Error") + ": " + ((e && e.message) || e)); }
        };
        const queue = paths.slice();
        const worker = async () => {
          while (queue.length) { const p = queue.shift(); await readOne(p); if (onEach) onEach(p); }
        };
        await Promise.all(Array.from({length: Math.min(16, queue.length)}, worker));
        // What would not open in the crowd gets one more try on its own.
        for (const p of paths) if (!out.has(p) && unread.has(p)) await readOne(p);
        if (timing) timing.readMs += performance.now() - began;
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
      async delAsset(path) {
        const dir = await dirFor(path.split("/").slice(0, -1).join("/"));
        await dir.removeEntry(path.split("/").pop());
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
      async delAsset(path) {
        const r = await fetch(u("/api/asset", path), {method: "DELETE"});
        if (!r.ok && r.status !== 404) throw new Error("delete failed: " + r.status);
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
