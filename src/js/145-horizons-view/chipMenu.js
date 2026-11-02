/* ---------- the pills on a row ----------
   A pill is three things at once: somewhere to go, a value to change, and a
   value to take off. A plain click used to mean only the first, so correcting
   the wrong project or a context you no longer work in cost a trip through the
   action panel -- and worse, it moved you off the list you were working. The
   click opens the three instead, with the same a/b/c letters the pickers use,
   and going there is still the first row. */
function chipMenu(title, hint, rows) {
  const live = rows.filter(Boolean);
  const body = el("div", {});
  for (const [key, label, detail, run] of live)
    body.append(pickRow(key, label, detail, () => { closeModal(); run(); }));
  modal({
    title, hint, body, center: true,
    onKey: e => {
      const hit = live.find(r => r[0] === e.key.toLowerCase());
      if (!hit) return false;
      closeModal(); hit[3]();
      return true;
    },
  });
}
