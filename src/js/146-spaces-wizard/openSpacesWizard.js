/* ============================================================
   146_SPACES_WIZARD -- run right after onboarding
   ============================================================ */
function openSpacesWizard() {
  /* The areas already set up are on the list from the start -- the one named
     a moment ago among them -- so naming more adds to them rather than
     making a second Personal beside the first. */
  const have = Spaces.list.map(sp => sp.name);
  const picked = new Set(have);
  const ta = el("textarea", {placeholder: "Personal\nWork\nFamily", style: "min-height:92px"});
  const sync = () => { ta.value = Array.from(picked).join("\n"); };
  sync();
  const chips = el("div", {class: "seg", style: "margin-top:8px"});
  const chipOf = new Map();
  ta.addEventListener("input", () => {
    picked.clear();
    ta.value.split("\n").map(trim).filter(Boolean).forEach(v => picked.add(v));
    for (const [o, b] of chipOf) b.classList.toggle("on", picked.has(o));
  });
  for (const o of SPACE_EXAMPLES) {
    const b = el("button", {class: picked.has(o) ? "on" : "", onclick: () => {
      if (picked.has(o)) picked.delete(o); else picked.add(o);
      b.classList.toggle("on", picked.has(o));
      sync();
    }}, o);
    chipOf.set(o, b);
    chips.append(b);
  }
  modal({
    center: true, title: "Keep your lives apart",
    body: el("div", {class: "field"},
      el("label", {}, "Which parts of your life should never see each other?"),
      el("div", {style: "color:var(--fg2);font-size:13px;margin-bottom:8px"},
        "One per line. Each is its own folder, with its own projects and contexts. " +
        "Share an area with the people it belongs to: colleagues get Work, never Personal."),
      ta, chips,
      el("div", {style: "color:var(--fg3);font-size:12px;margin-top:10px"},
        (have.length === 1
          ? "The first line is the area you just set up. Change it to rename it; it keeps its folder. "
          : "") +
        "Next, each area gets its folder. You can add, rename or remove areas later under Manage areas.")),
    foot: [
      el("button", {class: "btn ghost", onclick: () => { closeModal(); finishSpaceSetup([]); }}, "Just one area"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: () => {
        closeModal();
        finishSpaceSetup(ta.value.split("\n").map(trim).filter(Boolean));
      }}, "Create"),
    ],
  });
}
