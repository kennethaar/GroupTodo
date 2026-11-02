/* Asked once per person on People and in the sidebar count, so the open
   actions are sorted by person once per render rather than scanned per name. */
function openActionsByPerson() {
  return memo("openByPerson", () => {
    const m = new Map();
    for (const a of leafActions()) {
      if (!OPEN_STATES[a.state]) continue;
      const waits = waitsOn(a);
      for (const who of waits.length ? waits : [a.owner]) {
        if (!trim(who)) continue;
        const k = slugPerson(who);
        if (!m.has(k)) m.set(k, []);
        m.get(k).push(a);
      }
    }
    return m;
  });
}
