/* What a sheet adds up, as a dialog rather than keys to remember the
   spelling of. */
function openSheetSettings(S) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const per = sheetTarget(S) || Array(7).fill(0);
  const shown = v => v ? String(+(S.time ? v / 60 : v).toFixed(2)) : "";
  const dayIns = order.map(d => el("input", {inputmode: "decimal", value: shown(per[d]), placeholder: "0",
    style: "width:52px", "aria-label": WEEKDAY_KEYS[d]}));
  const names = S.source ? [] : trackerList().filter(g => g.code === S.letter).map(g => g.name);
  const chosen = new Set(sheetTrackers(S));
  const ticks = names.map(n => el("input", {type: "checkbox", checked: chosen.has(n) ? "" : null, value: n}));
  const split = el("input", {value: sheetSetting(S, "split"), placeholder: "Home 50, Work 50", style: "width:100%"});
  const extra = el("input", {inputmode: "decimal", value: sheetSetting(S, "extra"), placeholder: "0", style: "width:70px"});
  const unit = el("input", {value: sheetSetting(S, "unit"), placeholder: S.letter === "a" ? "kr" : "pcs", style: "width:90px"});
  const fmt = fselect("Format", sheetSetting(S, "format") || S.formats[0][0], S.formats, () => {});
  const field = (label, hint, ...kids) => el("div", {class: "field"}, el("label", {}, label), ...kids,
    hint ? el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"}, hint) : null);
  const save = () => {
    if (S.diff) {
      const vals = Array(7).fill(0);
      order.forEach((d, i) => { vals[d] = sheetNum(S, dayIns[i].value); });
      setMySetting(S.id + "_target", vals.some(Boolean) ? sheetTargetText(S, vals) : "");
    }
    const on = ticks.filter(t => t.checked).map(t => t.value);
    setMySetting(S.id + "_trackers", on.length && on.length < names.length ? on.join(", ") : "");
    if (S.split) setMySetting(S.id + "_split", trim(split.value));
    if (S.extra) setMySetting(S.id + "_extra", sheetNum(S, extra.value) ? trim(extra.value) : "");
    if (S.unit) setMySetting(S.id + "_unit", trim(unit.value));
    setMySetting(S.id + "_format", fmt.value === S.formats[0][0] ? "" : fmt.value);
    closeModal();
    render();
    notify(whoAmI() ? "Saved on your own page, so your phone has it too." : "Saved on this device. Set your name to keep it in the vault.");
  };
  modal({
    center: true, title: S.title, hint: "how the sheet adds up, kept on your own page",
    body: el("div", {},
      names.length > 1 ? field("Trackers in it", "Each is a column of its own.",
        el("div", {style: "display:flex;gap:12px;flex-wrap:wrap"}, ...names.map((n, i) =>
          el("label", {style: "display:flex;gap:4px;align-items:center"}, ticks[i], trackerTitle(n))))) : null,
      S.diff ? field(S.diff.target, S.diff.hint,
        el("div", {style: "display:flex;gap:6px;flex-wrap:wrap"}, ...order.map((d, i) => el("label",
          {style: "display:flex;flex-direction:column;font-size:11px;color:var(--fg3)"},
          parseISO(shiftISO("2026-10-04", d)).toLocaleDateString(undefined, {weekday: "short"}), dayIns[i])))) : null,
      !S.split ? null : field("Split between", "Names and percent, each a column of its own.", split),
      S.extra ? field("Added to each day", S.extra, extra) : null,
      S.unit ? field("Unit", "Shown with the totals.", unit) : null,
      field("Numbers as", null, fmt)),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
           el("button", {class: "btn primary", onclick: save}, "Save")],
    onKey: e => { if (e.key !== "Enter" || e.target.tagName === "SELECT") return false; save(); return true; },
  });
}
