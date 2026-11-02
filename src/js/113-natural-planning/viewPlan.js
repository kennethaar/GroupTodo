/* ---------- the screen ---------- */
function viewPlan() {
  const sp = state.planSpace || V.space;
  if (state.planPath && (!NPM || NPM.path !== state.planPath || NPM.space !== sp))
    NPM = inSpace(sp, () => V.pages.has(state.planPath)) ? npmLoad(sp, state.planPath) : null;
  if (NPM && !npmIn(() => V.pages.has(NPM.path))) NPM = null;   // moved or deleted meanwhile
  if (!state.planPath) NPM = null;
  NPM_PENDING = null;
  const c = el("div", {class: "wrap wide solwrap npmwrap"});
  const main = el("div", {class: "npmmain"});
  c.append(npmRail(), main);
  if (!NPM) { main.append(...npmPicker()); return c; }
  const q = npmQ(), k = NPM_STEPS[NPM.step].k;
  main.append(npmHead(q));
  if (npmLocked()) {
    main.append(el("div", {class: "npmlock"},
      el("span", {}, NPM.by + " is planning this project" + (NPM.at ? ", since " + humanDate(String(NPM.at).slice(0, 10)) : "") + "."),
      el("button", {class: "btn primary", onclick: () => { NPM.by = whoAmI(); npmSave(); render(); }}, "Take over")));
    return c;
  }
  if (["purpose", "onpurpose", "principles", "vision", "know"].includes(q.k)) main.append(...npmListQ(q.k));
  else if (q.k === "people") main.append(...npmPeopleQ());
  else if (q.k === "outcome") main.append(...npmOutcomeQ());
  else if (q.k === "ideas") main.append(...npmIdeasQ());
  else if (q.k === "sort") main.append(...npmSortQ());
  else if (q.k === "order") main.append(...npmOrderQ());
  else if (q.k === "item") main.append(...npmItemQ(q.it));
  else main.append(...npmFocusQ());
  if (k !== "focus") main.append(npmNav(q));
  // Typing carries on in the box after every redraw.
  requestAnimationFrame(() => {
    const a = document.activeElement, box = c.querySelector(".npmin");
    if (box && box.isConnected && (!a || a === document.body || !a.isConnected) && !$("#modalRoot").firstChild) box.focus({preventScroll: true});
  });
  return c;
}
