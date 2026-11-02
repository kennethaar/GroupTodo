/* ============================================================
   15_STORAGE -- three interchangeable backends
     fs   : File System Access API, writes real .md files (desktop Chrome/Edge)
     http : tiny PUT/GET server (serve.py) -- for Termux / phone / any device
     idb  : IndexedDB, browser-local, with markdown bundle export/import
   Port of: init.lua read_file/write_file/append_file + autosave timer
   ============================================================ */
/* ---------- what can this device actually do? ----------
   iOS Safari, locked-down corporate browsers and pages opened straight from
   disk all differ in what they allow. Probe rather than assume, and tell the
   user plainly in the Vault dialog. */
/* Reading window.localStorage THROWS -- it does not return null -- when the
   page has an opaque origin. SharePoint and Teams render an uploaded .html
   inside <iframe sandbox srcdoc> with no allow-same-origin, which is exactly
   that: no localStorage, no IndexedDB, no folder access, nothing. Every
   access goes through here so a locked-down frame degrades to memory rather
   than killing the script on the way past. */
const safeLS = {
  get(k, d = null) {
    try { const v = window.localStorage.getItem(k); return v === null ? d : v; }
    catch (_) { return d; }
  },
  set(k, v) { try { window.localStorage.setItem(k, v); return true; } catch (_) { return false; } },
  del(k)    { try { window.localStorage.removeItem(k); return true; } catch (_) { return false; } },
};

const CAP = {
  served    : location.protocol === "http:" || location.protocol === "https:",
  /* A sandboxed frame with no allow-same-origin: storage ACCESS throws, not
     just storage reads. Tested by behaviour rather than by origin, because a
     plain file:// page also reports an origin of "null" and is perfectly
     usable -- checking the origin alone condemned every downloaded copy. Both
     halves are needed: in a frame, and storage unreachable. */
  sandboxed : (() => {
    const framed = (() => { try { return window.top !== window.self; } catch (_) { return true; } })();
    let blocked = false;
    try { void window.localStorage; } catch (_) { blocked = true; }
    return framed && blocked;
  })(),
  fromFile  : location.protocol === "file:",
  dirPicker : typeof window.showDirectoryPicker === "function",
  openPicker: typeof window.showOpenFilePicker === "function",
  savePicker: typeof window.showSaveFilePicker === "function",
  idb       : false,     // filled in by probeStorage()
  ls        : false,
  persist   : "memory",  // idb | ls | memory
};
