const Spaces = {
  list: [],          // [{name, kind, label, server, color}]
  active: null,

  async load() {
    try { Spaces.list = (await IDB.get("kv", "spaces")) || []; }
    catch (_) { Spaces.list = []; }
    try { Spaces.list = JSON.parse(PREF.get("spaces") || "null") || Spaces.list; }
    catch (_) {}
    return Spaces.list;
  },
  async save() {
    try { await IDB.set("kv", "spaces", Spaces.list); } catch (_) {}
    PREF.set("spaces", JSON.stringify(Spaces.list));
  },
  get(name) { return Spaces.list.find(s => s.name === name) || null; },

  async add(sp) {
    if (Spaces.get(sp.name)) return Spaces.get(sp.name);
    sp.color = normHex(sp.color) || nextSpaceColor();
    Spaces.list.push(sp);
    await Spaces.save();
    return sp;
  },

  /* Repaint one space. Rejects anything that is not a colour rather than
     writing it, so a bad value cannot leave a space invisible. */
  async setColor(name, color) {
    const sp = Spaces.get(name);
    const hex = normHex(color);
    if (!sp || !hex) return false;
    sp.color = hex;
    await Spaces.save();
    return true;
  },

  /* A name is only what this browser calls the area: nothing inside the
     folder carries it, so the others in a shared folder never see it change.
     Everything this browser keeps under the old name moves with it. */
  async rename(from, to) {
    const sp = Spaces.get(from);
    const clean = trim(to).replace(/[^\w \-]/g, "").slice(0, 40);
    if (!sp || !clean || clean === from) return null;
    if (Spaces.get(clean)) { notify("An area called " + clean + " already exists.", "warn"); return null; }
    if (LOADED.has(from)) await flush();
    const move = async store => {
      const keys = await IDB.keys(store), vals = await IDB.all(store);
      for (let i = 0; i < keys.length; i++) {
        const k = String(keys[i]);
        if (!k.startsWith(from + "|")) continue;
        await IDB.set(store, clean + k.slice(from.length), vals[i]);
        await IDB.del(store, keys[i]);
      }
    };
    if (!sp.legacyFlat) {
      try { await move("files"); await move("assets"); } catch (_) {}
      try {
        for (const [k, v] of LS.all()) if (k.startsWith(from + "|")) { LS.set(clean + k.slice(from.length), v); LS.del(k); }
      } catch (_) {}
    }
    for (const key of ["dir", "bundle", "summary"]) {
      try {
        const v = await IDB.get("kv", key + ":" + from);
        if (v !== undefined && v !== null) { await IDB.set("kv", key + ":" + clean, v); await IDB.del("kv", key + ":" + from); }
      } catch (_) {}
    }
    for (const key of ["identity", "pagecount"]) {
      const v = PREF.get(key + ":" + from, "");
      if (v) PREF.set(key + ":" + clean, v);
    }
    sp.name = clean;
    delete sp.placeholder;               // named on purpose: no longer scaffolding
    if (PENDING_GRANT.has(from)) { PENDING_GRANT.set(clean, PENDING_GRANT.get(from)); PENDING_GRANT.delete(from); }
    if (LOST_FOLDER.delete(from)) LOST_FOLDER.add(clean);
    const rec = LOADED.get(from);
    if (rec) {
      LOADED.delete(from);
      rec.name = clean;
      LOADED.set(clean, rec);
      // A browser-held area's backend has the old name baked into its keys.
      if (rec.backend && (rec.backend.kind === "idb" || rec.backend.kind === "ls")) rec.backend = await spaceBackend(sp);
    }
    if (Spaces.active === from) { Spaces.active = clean; PREF.set("activeSpace", clean); }
    if (V.space === from) bindActive(clean);
    let shown = [];
    try { shown = JSON.parse(PREF.get("visibleSpaces") || "[]"); } catch (_) {}
    if (shown.includes(from)) setVisibleSpaces(shown.map(n => n === from ? clean : n));
    await Spaces.save();
    clearMemo();
    return sp;
  },

  /* The order of the list is the order areas sit in on screen, left to right,
     whichever of them happen to be ticked on. */
  async move(name, to) {
    const from = Spaces.list.findIndex(s => s.name === name);
    to = Math.max(0, Math.min(Spaces.list.length - 1, to));
    if (from < 0 || from === to) return false;
    const [sp] = Spaces.list.splice(from, 1);
    Spaces.list.splice(to, 0, sp);
    await Spaces.save();
    return true;
  },

  async remove(name) {
    Spaces.list = Spaces.list.filter(s => s.name !== name);
    await Spaces.save();
    try { await IDB.del("kv", "dir:" + name); } catch (_) {}
    try { await IDB.del("kv", "bundle:" + name); } catch (_) {}
    try { await IDB.del("kv", "summary:" + name); } catch (_) {}
  },

  /* A cheap per-space tally, cached so the switcher can show every space
     without loading them all. Refreshed whenever that space is saved. */
  async summary(name) {
    try { return (await IDB.get("kv", "summary:" + name)) || null; } catch (_) { return null; }
  },
  async writeSummary() {
    if (!Spaces.active) return;
    try {
      const acts = leafActions();
      await IDB.set("kv", "summary:" + Spaces.active, {
        open: openOf(acts).length,
        late: acts.filter(a => a.group === "LATE").length,
        at: nowStamp(),
      });
    } catch (_) {}
  },
};
