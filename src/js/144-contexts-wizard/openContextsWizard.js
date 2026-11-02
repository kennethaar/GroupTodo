function openContextsWizard(onDone) {
  CTXWIZ.picked = "";
  const ta = el("textarea", {placeholder: "phone\ncomputer\nerrand", style: "min-height:110px"});
  ta.addEventListener("input", () => { CTXWIZ.picked = ta.value; });
  const chips = el("div", {class: "seg", style: "margin-top:8px"});
  for (const o of CONTEXT_EXAMPLES) {
    chips.append(el("button", {
      onclick: e => {
        const lines = CTXWIZ.picked.split("\n").map(trim).filter(Boolean);
        const i = lines.indexOf(o);
        if (i >= 0) lines.splice(i, 1); else lines.push(o);
        CTXWIZ.picked = lines.join("\n");
        ta.value = CTXWIZ.picked;
        e.target.classList.toggle("on");
      },
    }, "@" + o));
  }
  modal({
    center: true, title: "Set up your contexts",
    body: el("div", {class: "field"},
      el("label", {}, "Where, or with what, can work actually happen?"),
      el("div", {style: "color:var(--fg2);font-size:13px;margin-bottom:8px"},
        "A context is the thing an action needs: a phone in your hand, a shop you are " +
        "standing in, two uninterrupted hours. Picking one is what lets GroupToDo show " +
        "the three oldest things you could do right now. Yours should match your real life - " +
        "these are only suggestions."),
      ta, chips),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Later"),
      el("button", {class: "btn primary", onclick: () => {
        const names = CTXWIZ.picked.split("\n").map(trim).filter(Boolean);
        closeModal();
        const made = names.map(n => makeContext(n));
        setSetting("contexts_done", todayISO());
        notify(names.length ? "Created " + names.length + " contexts." : "No contexts created.");
        render();
        if (onDone && made.length) onDone(made[0]);
      }}, "Create"),
    ],
  });
}
