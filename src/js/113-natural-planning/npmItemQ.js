/* ---------- next actions: who, where, then the verb ---------- */
function npmItemQ(it) {
  const a = it.act, kept = it.kind === "comp" ? npmKept(it.c) : null;
  const out = [];
  if (it.kind === "comp") {
    const ideas = NPM.ideas.filter(i => i.to === "c:" + it.c.id);
    if (ideas.length) out.push(el("div", {class: "npmnotes"}, el("span", {class: "npmh"}, "Ideas inside"),
      ...ideas.map(i => el("button", {class: "fchip", title: "Start the action from this", onclick: () => { a.text = i.t; npmSave(); render(); }}, i.t))));
  }
  if (kept) out.push(el("div", {class: "npmsay ok"}, svgIcon(ICON_CHECK), " Already has a next action: " + plainTitle(kept.replace(/^- (TODO|DOING|WAIT)\s+/, "").split("\n")[0])));
  const people = [...NPM.people, ...npmIn(() => members().map(m => m.name)).filter(n => !samePerson(n, whoAmI()) && !NPM.people.some(x => samePerson(x, n)))].slice(0, 8);
  const set = (k, v) => { a[k] = v; npmSave(); render(); };
  out.push(el("div", {class: "npmh"}, "1 · Who does it?"),
    el("div", {class: "npmchips"}, fchip("Me", !a.who, () => set("who", "")),
      ...people.map(n => fchip(n + " (waiting for)", a.who === n, () => set("who", n)))));
  const ctxs = npmIn(() => contextList());
  const newCtx = el("input", {class: "newopt", placeholder: "+ new context", "aria-label": "New context"});
  newCtx.addEventListener("keydown", e => {
    if (e.key !== "Enter" || !trim(newCtx.value)) return;
    e.preventDefault(); e.stopPropagation();
    set("ctx", npmIn(() => makeContext(newCtx.value)));
  });
  out.push(el("div", {class: "npmh"}, "2 · Where? The context"),
    el("div", {class: "npmchips"}, ...ctxs.map(x => fchip("@" + x, a.ctx === x, () => set("ctx", a.ctx === x ? "" : x))), newCtx));
  const input = el("input", {class: "npmin", value: a.text || "", "aria-label": "The next action",
    placeholder: a.who ? "What are you waiting for them to do?" : "Ask Sofia which CRM field holds consent"});
  attachSuggest(input);
  const say = el("div", {class: "npmsay"});
  const tell = () => {
    const t = trim(input.value);
    if (!t) { say.className = "npmsay"; say.replaceChildren(a.who ? "It goes to Waiting for." : "Start with a verb you can do: call, draft, buy."); return; }
    const v = a.who || startsWithVerb(t);
    say.className = "npmsay " + (v ? "ok" : "warn");
    say.replaceChildren(...(a.who ? [svgIcon(ICON_CHECK), " Waiting for " + a.who]
      : v ? [svgIcon(ICON_CHECK), " Starts with a verb"] : ["Start with a verb you can do: call, draft, buy."]));
  };
  input.addEventListener("input", () => { a.text = input.value; npmSave(); tell(); });
  input.addEventListener("keydown", e => {
    if (suggestKey(e)) return;
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); npmNext(); }
  });
  tell();
  out.push(el("div", {class: "npmh"}, "3 · The physical action"),
    el("div", {class: "npmact"}, a.ctx ? el("span", {class: "chip ctx"}, "@" + a.ctx) : null, input), say,
    // Not clear enough to act on yet? Planning it further is a next action too.
    it.kind === "comp" ? el("div", {}, el("button", {class: "textbtn", onclick: () => set("text", "Plan the rest of " + it.c.name)},
      "Or: plan the rest of this")) : null);
  return out.filter(Boolean);
}
