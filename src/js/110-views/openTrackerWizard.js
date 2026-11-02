function openTrackerWizard(onDone, path, line = null) {
  let kind = TRACKER_KINDS[0], sets = 3;
  /* When: just this line, or a schedule. The day it is set up on is where
     the picker starts. */
  const from = (path && dayOfPath(path)) || todayISO();
  const pick = whenPicker(from, null);
  const whenBox = pick.node;
  const name = el("input", {placeholder: "Pull-ups, water, sleep, mood…"});
  const setsIn = el("input", {type: "number", min: "1", max: "12", value: "3", style: "width:5em"});
  const preview = el("code", {class: "trkpreview"});
  const kinds = el("div", {class: "trkkinds"});
  const setsRow = el("div", {class: "field"}, el("label", {}, "How many sets?"), setsIn);
  // Tap to count: any emoji typed or pasted, or one of the usual ones.
  const iconIn = el("input", {value: TAP_ICONS[0], maxlength: "8", style: "width:4.5em;text-align:center;font-size:18px",
    "aria-label": "Icon"});
  const iconRow = el("div", {class: "field"}, el("label", {}, "Which icon? One per tap"),
    el("div", {class: "tapicons"}, iconIn, ...TAP_ICONS.map(ic => el("button", {class: "tapicon", type: "button",
      onclick: () => { iconIn.value = ic; sync(); }}, ic))));
  const iconOf = () => tapIcons(iconIn.value)[0] || TAP_ICONS[0];
  const keyOf = () => { const s = trackerSlug(name.value); return s ? "tracker-" + s + "_" + kind.code(sets) : ""; };
  const sync = () => {
    sets = Math.max(1, Math.min(12, parseInt(setsIn.value, 10) || 1));
    setsRow.hidden = !kind.sets;
    iconRow.hidden = !kind.icon;
    const k = keyOf();
    preview.textContent = (k ? k + "::" : "tracker-<name>_" + kind.code(sets) + "::") +
      (kind.icon ? " " + iconOf().repeat(3) + "   \u2190 after three taps" : "");
    const same = trackerList().find(g => g.name === trackerSlug(name.value));
    hintLine.textContent = same ? "Already tracked, as " + trackerKindWords(same.code) + ". It stays one history either way." : "";
  };
  const hintLine = el("div", {class: "hint"});
  const drawKinds = () => {
    kinds.textContent = "";
    for (const k of TRACKER_KINDS) kinds.append(el("button", {class: "trkkind" + (k === kind ? " on" : ""), type: "button",
      onclick: () => { kind = k; drawKinds(); sync(); }},
      el("b", {}, k.label), el("span", {}, k.hint)));
    /* Not a tracker: somebody's hours on site are a visit, so this hands over
       to Check in with the name typed so far, rather than counting as flex. */
    kinds.append(el("button", {class: "trkkind", type: "button",
      onclick: () => { closeModal(); openTimeForm(null, null, {from: line || {path, block: null}, person: trim(name.value)}); }},
      el("b", {}, "Someone on site"), el("span", {}, "a craftsman or helper: when they came and left -- opens Check in")));
  };
  const save = () => {
    const k = keyOf();
    if (!k) { notify("Give it a name first.", "warn"); name.focus(); return; }
    const when = pick.value();
    if (when && when.invalid) { notify(when.invalid, "warn"); return; }
    closeModal();
    if (kind.icon) setSetting(tapIconKey(trackerSlug(name.value)), iconOf());
    onDone(k + "::", when);
  };
  name.addEventListener("input", sync);
  setsIn.addEventListener("input", sync);
  iconIn.addEventListener("input", sync);
  name.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); save(); } });
  drawKinds(); sync();
  modal({
    center: true, title: "New tracker", hint: "a line you fill in on a day",
    body: el("div", {},
      el("div", {class: "field"}, el("label", {}, "1. What are you tracking?"), name, hintLine),
      el("div", {class: "field"}, el("label", {}, "2. What do you write down?"), kinds),
      setsRow, iconRow,
      el("div", {class: "field"}, el("label", {}, "3. When do you do it?"), whenBox),
      el("div", {class: "field"}, el("label", {}, "The line it writes"), preview,
        el("div", {class: "hint"}, "Type this yourself next time: “tracker-” on any line."))),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: save}, "Add tracker")],
  });
  setTimeout(() => name.focus(), 30);
}
