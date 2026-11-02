/* The answers to one question, best first, at most eight: one to a box. A
   list longer than that shows its best and an "All" box for the rest. */
function solDeal(r, f) {
  const out = [];
  // Gone back to an answered question: leaving it as it is is an answer too.
  if (SOL.step === f.k && f.type !== "multi" && f.filled(r))
    out.push({label: "Keep it", sub: projectFieldText(r, f) || "", word: "✓ Keep it",
      take: () => solAfter(r, f.k)});
  if (f.type === "text") {
    const input = el("input", {placeholder: f.ph, "aria-label": f.label});
    if (f.k === "outcome") input.value = f.val(r);
    attachSuggest(input);
    const write = {label: f.k === "next" ? "Write the next action" : "Write it yourself", input, word: "✎ Write", stay: true,
      take: () => input.focus()};
    write.send = () => { const v = trim(input.value); if (!v) return; SOL.took = write.k; f.submit(r, v); solAfter(r, f.k); };
    input.addEventListener("keydown", e => { if (suggestKey(e)) return; if (e.key === "Enter") { e.preventDefault(); write.send(); } });
    out.push(write);
    if (f.k === "outcome") {
      /* A project's name is often already its outcome ("Website relaunched"):
         take it as it is, or start from it in the box. */
      const name = inS(r, () => pageTitle(r.path));
      if (trim(input.value) !== name) {
        out.push({label: "“" + name + "”", sub: "The project's name, as it is", word: "✓ Use the name",
          take: () => { f.submit(r, name); solAfter(r, f.k); }});
        out.push({label: "Start from the name", sub: "Put it in the box to change it", word: "✎ Edit the name", stay: true,
          take: () => { input.value = name; input.focus(); input.select(); }});
      }
    }
    if (f.k === "next") {
      // No next action is an answer as well: it waits on somebody, it can wait, or it is done.
      const st = solFields().find(x => x.k === "status");
      const end = v => () => {
        st.pick(r, v);
        if (v === "3") solAskWaiting(r, () => solOp(r, "done")); else solOp(r, "done");
      };
      out.push({label: "Waiting on someone", sub: "Move it to Waiting for", word: "→ Waiting for", take: end("3")});
      out.push({label: "Not now", sub: "Move it to Someday/Maybe", word: "→ Someday/Maybe", take: end("2")});
      out.push({label: "It is done", sub: "Move it to Completed", word: "→ Completed", take: end("0")});
      // Stuck for a next action usually means the project itself is fuzzy: plan it once the review is done.
      out.push({label: "✦ Re-plan it", sub: "Needs clarity. Plan it after the review", word: "✦ Re-plan it",
        take: () => { npmQueue(r.space, r.path); solOp(r, "done"); }});
    }
    return out;
  }
  const pick = v => () => solApply(r, f, v);
  const cur = f.cur(r), now = f.now ? f.now(r) : null;
  const isOn = v => f.type === "multi" ? cur.includes(v) : cur === v;
  const list = f.opts(r);
  const first = [], last = [];
  if (f.type === "multi") {
    if (cur.length) first.push({label: "That's all", sub: cur.join(", "), word: "✓ Done", take: () => solAfter(r, f.k)});
    else first.push({label: f.none, word: "→ " + f.none, on: !!solAns(r)[f.k], take: pick("none")});
  }
  for (const [v, label] of list.filter(([v]) => v === "none"))
    (f.k === "deadline" ? last : first).push({label, word: "→ " + label, on: isOn(v), take: pick(v)});
  // Answers with a place of their own near the end, whatever the ranking says.
  if (f.tail) for (const [v, label] of f.tail(r))
    last.push({v, label, word: "→ " + label, sub: f.sub ? f.sub(r, v) : "", take: pick(v)});
  if (f.type === "date") {
    const input = el("input", {type: "date", min: todayISO(), "aria-label": "Pick a date",
      onchange: e => { if (e.target.value) { SOL.took = date.k; f.pick(r, e.target.value); solAfter(r, f.k); } }});
    const date = {label: f.dateLabel || "Pick a date", sub: f.dateSub || "Any day you like", word: "📅 " + (f.dateLabel || "Pick a date"), date: input, stay: true,
      take: () => { try { input.showPicker(); } catch (_) { input.focus(); } }};
    last.push(date);
  }
  // A missing area or organisation can be made right here, as a page in the card's own space.
  if (f.add) {
    const input = el("input", {class: "newopt", placeholder: f.add, "aria-label": f.add + " in " + r.space});
    if (f.addVal) input.value = f.addVal(r);
    const make = {label: "＋ " + f.add, word: "＋ " + f.add, input, stay: true, take: () => input.focus()};
    input.addEventListener("keydown", e => {
      if (e.key !== "Enter" || !trim(input.value)) return;
      e.preventDefault(); SOL.took = make.k; f.make(r, trim(input.value));
      if (/^New /.test(f.add)) notify(f.add.replace(/^New /, "") + " “" + trim(input.value) + "” made in " + r.space + ".");
      solAfter(r, f.k);
    });
    last.push(make);
  }
  // A list with an order of its own (the deadlines) keeps it; one ranked by use puts what is picked first.
  const ranked = solRanked(r, f, list.filter(([v]) => v !== "none"), f.rank ? isOn : () => false, v => v === now);
  let room = SOL_SPOTS.length - out.length - first.length - last.length;
  const more = ranked.length > room;
  if (more) room--;
  const shown = ranked.slice(0, room).map(([v, label]) => ({v, label, word: (f.type === "multi" ? (isOn(v) ? "− " : "+ ") : "→ ") + label,
    on: isOn(v), now: !solAns(r).status && now === v,
    sub: !solAns(r).status && now === v ? "As it is now" : f.sub ? f.sub(r, v) : "", take: pick(v)}));
  out.push(...first, ...shown, ...last);
  if (more) out.push({label: "All " + ranked.length + " ›", sub: "Search the whole list", word: "Show all", more: true, stay: true,
    take: () => solMoreOf(r, f)});
  return out;
}
