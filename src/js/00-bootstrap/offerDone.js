function offerDone(e) {
  const h = doneHistory();
  h.unshift(e);
  PREF.set("done.history", JSON.stringify(h.slice(0, DONE_HIST_MAX)));
  const T = DONE_TOAST;
  if (!T.el || !T.el.isConnected) {
    T.n = 0;
    T.count = el("strong", {style: "flex:1"});
    T.list = el("div", {style: "display:flex;flex-direction:column;gap:10px;margin-top:6px"});
    // One thing done: its Backdate, Undo and the rest sit up here, beside History.
    T.slot = el("span", {style: "display:contents"});
    T.el = el("div", {class: "toast reminder done", role: "status"},
      el("div", {class: "donehead", style: "display:flex;flex-wrap:wrap;gap:6px 8px;align-items:center"}, T.count, T.slot,
        el("button", {class: "btn sm ghost", onclick: () => { closeDoneToast(); openDoneHistory(); }}, "History"),
        el("button", {class: "x", "aria-label": "Close", onclick: closeDoneToast}, "✕")),
      T.list);
    T.el.addEventListener("focusin", () => clearTimeout(T.timer));
    T.el.addEventListener("focusout", () => setTimeout(armDoneToast, 0));
    T.el.addEventListener("keydown", ev => {
      if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); closeDoneToast(); }
    });
    $("#toasts").append(T.el);
  }
  T.n++;
  T.count.textContent = T.n === 1 ? "Done" : T.n + " done";
  const said = el("div", {});
  // Undone or changed: it was not finished after all, so it leaves the toast and the history.
  const drop = () => {
    PREF.set("done.history", JSON.stringify(doneHistory().filter(x => x.at !== e.at)));
    item.remove();
    T.n--;
    if (!T.n) closeDoneToast(); else { T.count.textContent = T.n === 1 ? "Done" : T.n + " done"; placeDoneActs(); }
  };
  const name = el("span", {style: "flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"}, "✓ " + e.label);
  const acts = el("span", {style: "display:contents"},
      ...backdateButton(e, day => { name.textContent = "✓ " + e.label + " · " + humanDate(day); }),
      e.kind === "project" && stakeholdersOf(e.space, e.path).length
        ? el("button", {class: "btn sm ghost", title: "Email the people and organisations on it that it is done",
            onclick: () => { closeDoneToast(); openDoneNote(e.space, e.path); }}, "Notify") : null,
      e.credit ? choreCreditPick(e) : null,
      e.change ? doneChangePick(e, code => { e.change(code); drop(); }) : null,
      e.undo ? el("button", {class: "btn sm ghost", onclick: () => { e.undo(); drop(); }}, "Undo") : null);
  const row = el("div", {style: "display:flex;gap:8px;align-items:center;margin-bottom:4px"}, name);
  const item = el("div", {}, row,
    said,
    doneCommentRow(e, text => said.append(el("div", {style: "color:var(--fg3);font-size:12px;margin:0 0 4px 16px"},
      todayISO() + " " + text))));
  item._acts = acts;
  item._row = row;
  T.list.append(item);
  placeDoneActs();
  armDoneToast();
}
