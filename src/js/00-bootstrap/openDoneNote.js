/* A mailto: note saying the project is done, with its outcome and the steps
   that were ticked off. Nothing goes until you press Send in your mail. */
function openDoneNote(space, path) {
  const t = doneTarget({kind: "project", space, path});
  if (!t) { notify("Could not find that project any more.", "warn"); return; }
  const who = stakeholdersOf(space, t.path);
  const title = inSpace(space, () => pageTitle(t.path));
  const outcome = trim(t.page.props.outcome || "");
  const steps = flattenBlocks(t.page.blocks).filter(b => b.state === "DONE").map(b => "- " + plainTitle(b.title));
  const box = el("textarea", {rows: 14, style: "font-size:12.5px;line-height:1.5"});
  box.value = ["Done: " + title, "", "Hi,", "", title + " is done.",
    ...(outcome ? ["", "Outcome: " + outcome] : []),
    ...(steps.length ? ["", "What was done:", ...steps] : []),
    "", whoAmI() || ""].join("\n").replace(/\n+$/, "");
  const rows = who.map(s => ({s, input: el("input", {type: "email", placeholder: "them@example.com", value: s.email})}));
  const to = () => rows.map(r => trim(r.input.value)).filter(looksLikeEmail);
  const remember = () => rows.forEach(r => { if (!r.s.org) setEmailOf(r.s.name, space, r.input.value); });

  modal({
    center: true, title: "Tell them " + title + " is done",
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, "Who gets it. Leave an address empty to leave them out."),
        ...rows.map(r => el("div", {style: "display:flex;gap:8px;align-items:center;margin-bottom:6px"},
          el("span", {style: "flex:0 0 40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"},
            (r.s.org ? "\u{1F3E2} " : "") + r.s.name),
          r.input)),
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          "From email:: on their pages. An address you type for a person is saved there when you send.")),
      el("div", {class: "field"},
        el("label", {}, "The note (first line is the subject). Edit it freely."),
        box)),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Close"),
      el("button", {class: "btn ghost", onclick: () => copyText(box.value, "Note copied. Paste it wherever you like.")}, "Copy"),
      // Several addresses make it a group chat, with the message pre-typed.
      el("button", {class: "btn ghost", onclick: () => {
        if (!to().length) { notify("Put in at least one address first - Teams needs it to open the chat.", "warn"); return; }
        remember();
        window.open("https://teams.microsoft.com/l/chat/0/0?users=" + to().map(encodeURIComponent).join(",") +
          "&message=" + encodeURIComponent(box.value.split("\n").slice(2).join("\n")), "_blank", "noopener");
        closeModal();
        notify("Teams opens with the message ready. Press Send.");
      }}, "Send in Teams"),
      el("button", {class: "btn primary", onclick: () => {
        if (!to().length) { notify("Put in at least one address first.", "warn"); return; }
        remember();
        const lines = box.value.split("\n");
        const url = "mailto:" + to().map(encodeURIComponent).join(",") +
          "?subject=" + encodeURIComponent(lines[0]) +
          "&body=" + encodeURIComponent(lines.slice(2).join("\n"));
        if (url.length > 1800) {
          notify("That note is too long for an email link. Use Copy and paste it instead.", "warn");
          return;
        }
        location.href = url;
        closeModal();
        notify("Your email is opening with the note. Press Send.");
      }}, "Open in email"),
    ],
  });
}
