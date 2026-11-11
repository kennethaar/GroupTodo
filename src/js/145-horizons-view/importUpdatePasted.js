/* The reply usually arrives as the body of an email, not as a file: that is the
   whole point of the sheet sending it that way. Making somebody save the mail
   to disk first, so there is a file to import, would undo it. So the ordinary
   route is to select the message, copy it, and drop it in here.
   A Teams reply comes with your message above it (#352). When it is plain,
   one answer under the message, it is read with nothing to check. When it is
   not, several answers or a back and forth, its lines are listed under the
   task each belongs to, ticked, so you untick one that is not theirs. */
function importUpdatePasted() {
  const box = el("textarea", {rows: 12, placeholder:
    "Paste their reply here. The whole email is fine, extra lines and all. From Teams, copy your message with their reply.",
    style: "font-size:12.5px;font-family:var(--mono)"});
  const said = el("div", {style: "color:var(--fg3);font-size:12.5px;margin-top:6px"});
  const list = el("div", {style: "max-height:36vh;overflow:auto"});
  let data = null, shown = false;
  const titleOf = ref => {
    const hit = resolveReplyItem({ref});
    return hit ? inSpace(hit.space, () => plainTitle(hit.block.title)) : ref;
  };
  const tick = line => el("button", {class: "spacetoggle" + (line.on ? " on" : ""), "aria-pressed": String(line.on),
    "aria-label": "Theirs: " + line.text, style: "width:16px;height:16px;font-size:11px;flex:0 0 auto",
    onclick: () => { line.on = !line.on; drawList(); }}, line.on ? svgIcon(ICON_CHECK) : null);
  const drawList = () => {
    const t = data && data.teams;
    list.replaceChildren();
    if (!t || !shown) return;
    for (const ref of [...t.refs, null]) {
      const lines = t.lines.filter(l => l.ref === ref);
      if (!lines.length) continue;
      list.append(el("div", {style: "font-weight:600;font-size:13px;margin:10px 0 2px"},
        ref ? titleOf(ref) : "Not about one task: you pick which after Read it"),
        ...lines.map(l => el("div", {style: "display:flex;gap:8px;align-items:flex-start;margin:4px 0 0 4px"},
          tick(l),
          el("span", {style: "font-size:12.5px;min-width:0;flex:1;color:" + (l.on ? "var(--fg)" : "var(--fg3)")}, l.text),
          l.mine ? el("span", {style: "color:var(--fg3);font-size:12px"}, "you") : null)));
    }
  };
  const check = () => {
    data = parseUpdateReply(box.value);
    const t = data && data.teams;
    shown = !!(t && t.unclear);
    const n = data ? data.items.length + (data.loose ? 1 : 0) : 0;
    said.replaceChildren(!trim(box.value) ? ""
      : t && !t.lines.length ? "That is your own message. Copy their reply under it too."
      : data ? "Found " + n + " answer" + (n === 1 ? "" : "s") + "." + (shown ? " Untick a line that is not theirs." : "")
      : "No GroupToDo answers in that yet. Paste the whole message, including the " +
        "lines at the bottom that look like machine noise: that is the part that says " +
        "which task is which. From Teams, copy your own message with their reply.",
      t && t.lines.length && !shown ? el("button", {class: "textbtn", style: "margin-left:8px;font-size:12.5px",
        onclick: () => { shown = true; drawList(); said.lastChild.remove(); }}, "Check the lines") : "");
    said.style.color = data && n ? "var(--ok)" : "var(--fg3)";
    drawList();
  };
  box.addEventListener("input", check);

  modal({
    center: true, title: "Paste a reply",
    body: el("div", {}, el("div", {class: "field"}, box, said, list)),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn ghost", onclick: async () => {
        try { box.value = await navigator.clipboard.readText(); check(); }
        catch (_) { notify("This browser would not let the app read the clipboard. Paste into the box.", "warn"); }
      }}, "Paste from clipboard"),
      el("button", {class: "btn primary", onclick: () => {
        // The lines as you left them ticked, for a Teams reply.
        const got = data && data.teams ? teamsReplyData(data.teams) : parseUpdateReply(box.value);
        if (!got) { notify("No GroupToDo answers in that text.", "error"); return; }
        closeModal();
        openUpdateArrived(got);
      }}, "Read it"),
    ],
  });
  setTimeout(() => box.focus(), 50);
}
