/* localStorage and in-memory stand-ins, so a browser that blocks IndexedDB
   (iOS Safari on a file:// page, some managed profiles) still runs. */
const LS = {
  k: p => "gtd.file:" + p,
  all() {
    const out = new Map();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("gtd.file:")) out.set(key.slice(9), localStorage.getItem(key));
    }
    return out;
  },
  set(p, t) { localStorage.setItem(LS.k(p), t); },
  del(p)    { localStorage.removeItem(LS.k(p)); },
};
const MEM = new Map();
/* Dropped files for backends with nowhere to put them (localStorage is far
   too small, memory has no disk at all). Session-long, like MEM. */
const ASSET_MEM = new Map();

const IDB = (() => {
  let dbp = null;
  const open = () => dbp || (dbp = new Promise((res, rej) => {
    const r = indexedDB.open("grouptodo", 2);
    r.onupgradeneeded = () => {
      const db = r.result;
      if (!db.objectStoreNames.contains("files")) db.createObjectStore("files");
      if (!db.objectStoreNames.contains("kv"))    db.createObjectStore("kv");
      /* Dropped-in pictures and documents. A store of their own, so a walk
         over the pages never has to step over a blob that is not markdown. */
      if (!db.objectStoreNames.contains("assets")) db.createObjectStore("assets");
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  }));
  const tx = async (store, mode, fn) => {
    const db = await open();
    return new Promise((res, rej) => {
      const t = db.transaction(store, mode);
      const rq = fn(t.objectStore(store));
      t.oncomplete = () => res(rq && rq.result);
      t.onerror = () => rej(t.error);
    });
  };
  return {
    /* Deleting the database blocks for as long as any connection to it is
       open, and this module holds one for the life of the page. Start afresh
       lets go of it first. */
    close: () => {
      const p = dbp;
      dbp = null;
      if (p) p.then(db => { try { db.close(); } catch (_) {} }, () => {});
    },
    get : (s, k)    => tx(s, "readonly",  st => st.get(k)),
    set : (s, k, v) => tx(s, "readwrite", st => st.put(v, k)),
    del : (s, k)    => tx(s, "readwrite", st => st.delete(k)),
    keys: (s)       => tx(s, "readonly",  st => st.getAllKeys()),
    all : (s)       => tx(s, "readonly",  st => st.getAll()),
    /* Many keys in one transaction, as a Map of the ones that are there. */
    getMany: async (s, ks) => {
      const out = new Map();
      if (!ks.length) return out;
      await tx(s, "readonly", st => {
        for (const k of ks) { const rq = st.get(k); rq.onsuccess = () => { if (rq.result != null) out.set(k, rq.result); }; }
        return null;
      });
      return out;
    },
  };
})();
