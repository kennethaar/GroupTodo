/* A note saying it is done (#402): I finished, and the day. A project adds its
   outcome and the steps ticked off, a task its project. Share hands it to the
   phone's or the computer's share sheet (Teams, chat, mail, messages); email
   and Teams take addresses. The day can be moved back here, which backdates
   it. Nothing goes until you press Send. */
function openDoneNote(e) {
  const t = doneTarget(e);
  if (!t) { notify("Could not find " + e.label + " any more.", "warn"); return; }
  const who = doneStakeholders(e), space = e.space;
  const title = e.kind === "project" ? inSpace(space, () => pageTitle(t.path)) : plainTitle(t.block.title);
  const extra = inSpace(space, () => {
    if (e.kind !== "project") {
      const proj = lineProject(t.path, t.block);
      return proj ? ["", "Project: " + proj.title] : [];
    }
    const outcome = trim(t.page.props.outcome || "");
    const steps = flattenBlocks(t.page.blocks).filter(b => b.state === "DONE").map(b => "- " + plainTitle(b.title));
    return [...(outcome ? ["", "Outcome: " + outcome] : []), ...(steps.length ? ["", "What was done:", ...steps] : [])];
  });
  // A day they can read later: "Sun 15 Nov", never "Today".
  const doneOn = day => "Done on " + doneNoteDay(day) + ".";
  const box = el("textarea", {rows: e.kind === "project" ? 12 : 7, style: "font-size:12.5px;line-height:1.5"});
  box.value = ["Done: " + title, "", "Hi,", "", "I finished: " + title, doneOn(e.day || todayISO()), ...extra].join("\n");
  const day = el("input", {type: "date", max: todayISO(), value: e.day || todayISO(), "aria-label": "Done on"});
  day.addEventListener("change", () => {
    const was = e.day || todayISO();
    if (!day.value || day.value === was) return;
    if (!backdateDone(e, day.value)) { day.value = was; return; }
    box.value = box.value.split(doneOn(was)).join(doneOn(day.value));
  });
  const rows = who.map(s => ({s, input: el("input", {type: "email", placeholder: "them@example.com", value: s.email || ""})}));
  const to = () => rows.map(r => trim(r.input.value)).filter(looksLikeEmail);
  const remember = () => rows.forEach(r => { if (!r.s.org) setEmailOf(r.s.name, space, r.input.value); });
  const lines = () => box.value.split("\n");
  const body = () => lines().slice(2).join("\n");
  const canShare = typeof navigator.share === "function";
  const share = async () => {
    try { await navigator.share({title: lines()[0], text: body()}); closeModal(); }
    catch (err) { if (err && err.name !== "AbortError") notify("The share sheet did not open. Use Copy instead.", "warn"); }
  };
  const email = () => {
    remember();
    const url = "mailto:" + to().map(encodeURIComponent).join(",") +
      "?subject=" + encodeURIComponent(lines()[0]) + "&body=" + encodeURIComponent(body());
    if (url.length > 1800) { notify("That note is too long for an email link. Use Copy and paste it instead.", "warn"); return; }
    location.href = url;
    closeModal();
    notify("Your email is opening with the note. Press Send.");
  };
  modal({
    center: true, title: "Tell them it is done",
    body: el("div", {},
      el("div", {class: "field"}, el("label", {}, "Done on"), day),
      el("div", {class: "field"},
        el("label", {}, "The note (first line is the subject). Edit it freely."),
        box),
      el("div", {class: "field"},
        el("label", {}, "Email and Teams need addresses. Leave one empty to leave them out."),
        ...rows.map(r => el("div", {style: "display:flex;gap:8px;align-items:center;margin-bottom:6px"},
          el("span", {style: "flex:0 0 40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"},
            (r.s.org ? "\u{1F3E2} " : "") + r.s.name),
          r.input)))),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Close"),
      el("button", {class: "btn ghost", onclick: () => copyText(box.value, "Note copied. Paste it wherever you like.")}, "Copy"),
      // Several addresses make it a group chat, with the message pre-typed.
      el("button", {class: "btn ghost", onclick: () => {
        if (!to().length) { notify("Put in at least one address first - Teams needs it to open the chat.", "warn"); return; }
        remember();
        openTeamsChat(to(), body());
        closeModal();
        notify("Teams opens with the message ready. If the box is empty, press Ctrl+V. Then press Send.");
      }}, "Send in Teams"),
      canShare ? el("button", {class: "btn ghost", onclick: email}, "Email") : null,
      el("button", {class: "btn primary", onclick: canShare ? share : email}, canShare ? "Share…" : "Open in email"),
    ],
  });
}
