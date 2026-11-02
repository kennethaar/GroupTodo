function trackerFacts(path) {
  const name = trackerOfPage(path), g = trackerGroup(name), code = g?.code || "";
  const props = getPage(path)?.props || {};
  const choice = (label, on, title, run) => {
    const pill = factPill(label, "ftrk " + (on ? "fon" : "fquiet"), title, () => { run(); render(); });
    pill.tabIndex = 0;
    pill.setAttribute("role", "button");
    pill.setAttribute("aria-pressed", String(!!on));
    pill.addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault(); e.stopPropagation(); pill.click();
    });
    return pill;
  };
  const note = text => el("span", {class: "fnote", contenteditable: "false"}, text);
  const fact = (k, pills, cls = "") => ({key: k, raw: k + ":: " + (props[k] || ""), own: true, cls, pills,
    save: text => {
      const m = /::\s*([\s\S]*)$/.exec(text), v = trim(m ? m[1] : text);
      if (k === "chart") setTrackerChart(name, v);
      else if (k === "style") setTrackerStyle(name, v.toLowerCase());
      else if (k === "colour") setTrackerColour(name, v.toLowerCase());
      else setTrackerProp(name, k, v);
    }});
  const facts = [];
  if (code === "i") {
    const now = tapIcon({name, raw: ""});
    facts.push(fact("icon", () => [
      ...[...new Set([now, ...TAP_ICONS])].map(ic => choice(ic, ic === now, ic === now ? "What a tap adds" : "A tap adds " + ic,
        () => setTrackerProp(name, "icon", ic))),
      choice("+", false, "Another icon", () => promptInput({title: "Icon", label: "What a tap adds", value: trim(props.icon || ""),
        cta: "Save", onSave: v => { setTrackerProp(name, "icon", trim(v)); render(); }}))]));
  }
  const mates = trackerChartMates(name), chart = trackerChartOf(g), shared = mates.length > 0;
  const own = trackerOwnColour(name), shown = own || (shared ? trackerColours([name, ...mates.map(x => x.name)].sort()).get(name) : "");
  facts.push(fact("colour", () => Object.keys(TRACKER_COLOURS).map(c => {
    const pill = choice(capitalise(c), c === shown, c === own ? "Its colour. Click to go back to the default" : "Its colour in every chart",
      () => setTrackerColour(name, c === own ? "" : c));
    pill.prepend(el("i", {class: "fswatch", style: "background:" + TRACKER_COLOURS[c]}));
    return pill;
  })));
  if (SHARED_MEASURE[code]) {
    const names = trackerChartNames(name);
    if (chart && !names.some(n => n.toLowerCase() === chart.toLowerCase())) names.push(chart);
    facts.push(fact("chart", () => [
      choice("On its own", !chart, "A chart of its own", () => setTrackerChart(name, "")),
      ...names.map(n => choice(n, n.toLowerCase() === chart.toLowerCase(), "Share the " + n + " chart", () => setTrackerChart(name, n))),
      choice("New chart…", false, "A name other " + trackerKindWords(code) + " trackers can join", () => newTrackerChartPrompt(name)),
      note((shared ? "Shared with " + mates.map(x => (x.code === "i" ? tapIcon({name: x.name, raw: ""}) + " " : "") + trackerTitle(x.name)).join(", ") + ". " : "") +
        "Only " + trackerKindWords(code) + " trackers can join.")]));
  }
  if (code !== "c") {
    const all = [name, ...mates.map(x => x.name)].sort(), now = trackerChartStyle(shared ? all : [name], shared);
    facts.push(fact("style", () => [
      ...trackerStyleChoices(shared).map(s => choice(trackerStyleWord(s, shared), s === now, "How the chart is drawn",
        () => setTrackerStyle(name, s))),
      shared ? note("Applies to the whole " + chart + " chart.") : null].filter(Boolean), chart ? "fsub" : ""));
  }
  return facts;
}
