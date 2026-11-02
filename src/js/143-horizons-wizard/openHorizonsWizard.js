function openHorizonsWizard(step = 0) {
  setSetting("horizons_seen", todayISO());
  const steps = wizSteps();
  WIZ.step = Math.max(0, Math.min(step, steps.length));
  if (WIZ.step === steps.length) { closeModal(); applyWizard(); return; }
  const s = steps[WIZ.step];
  const last = WIZ.step === steps.length - 1;
  modal({
    center: true,
    title: s.title,
    hint: WIZ.step ? "step " + WIZ.step + " of " + (steps.length - 1)
                     + (s.inherited ? " · optional" : "") : "",
    body: s.render(),
    foot: [
      WIZ.step > 0 ? el("button", {class: "btn ghost", onclick: () => openHorizonsWizard(WIZ.step - 1)}, "Back") : null,
      el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", onclick: () => { closeModal(); setSetting("horizons_seen", todayISO()); }}, "Later"),
      s.key ? el("button", {class: "btn ghost", onclick: () => openHorizonsWizard(WIZ.step + 1)}, "Skip") : null,
      el("button", {class: "btn primary", onclick: () => openHorizonsWizard(WIZ.step + 1)},
        s.cta || (last ? "Finish" : "Next")),
    ],
  });
}
