function wizSteps() {
  const profile = horizonProfile();
  const ladder = activeHorizons();
  const intro = {
    title: "Horizons",
    render: () => el("div", {class: "field"},
      el("label", {}, ladder.length + " altitudes"),
      el("div", {style: "color:var(--fg2);font-size:13.5px;line-height:1.75"},
        "Todo apps live on the runway. GTD says the runway only makes sense if you " +
        "can see what it serves. This takes a few minutes and you can skip any step."),
      el("div", {style: "font-family:var(--mono);font-size:12px;line-height:2;color:var(--fg3);margin-top:10px"},
        ladder.map(h => {
          const m = horizonMeta(h.key);
          return el("div", {},
            el("span", {style: "color:var(--accent)"}, m.alt.padEnd(11)),
            m.h + " · " + m.name);
        })),
      profile.key === "life" ? null
        : el("div", {style: "color:var(--fg3);font-size:12px;margin-top:10px"}, profile.blurb)),
    cta: "Start",
  };

  const steps = [intro];
  for (const key of WIZ_ORDER) {
    if (!horizonActive(key)) continue;
    const m = horizonMeta(key);
    steps.push({
      key,
      title: m.h + " · " + m.name,
      inherited: !!m.inherited,
      render: () => el("div", {class: "field"},
        el("label", {}, m.wiz.label),
        el("div", {style: "color:var(--fg2);font-size:13px;margin-bottom:8px"}, m.wiz.help),
        wizField(key, m.wiz.placeholder),
        key === "areas"
          ? el("div", {},
              el("div", {style: "color:var(--fg3);font-size:12px;margin-top:8px"}, "Tap any that fit:"),
              wizChips("areas", areaChips()))
          : null),
    });
  }
  return steps;
}
