function trackerCard(g) {
  const openDay = e => openPageIn(e.space || V.space, e.path);
  const avail = Object.keys(TRACKER_MEASURES).filter(m => g.entries.some(e => trackerMeasures(e)[m] != null));
  // Weight with sets opens on its own picture: pillars of weight, dots of reps.
  const sessions = /^kr+$/.test(g.code || "") ? trackerSessions(g) : [];
  if (sessions.length) avail.unshift("sets");
  const pick = PREF.get("trk.measure." + g.name, "");
  const measure = avail.includes(pick) ? pick : avail[0];
  const card = el("div", {class: "card trkcard"});
  const last = g.entries[g.entries.length - 1];
  const colour = trackerOwnColour(g.name);
  if (colour) card.style.setProperty("--trkc", TRACKER_COLOURS[colour]);
  card.append(trackerCardHead(trackerTitle(g.name),
    trackerKindWords(g.code) + " · " + g.entries.length + " day" + (g.entries.length === 1 ? "" : "s") +
      " · " + describeWhen(trackerWhen(g.name).when),
    () => openTrackerPage(g.name)));
  if (!measure) {
    card.append(el("p", {class: "hint"}, "Nothing written in it yet. Fill in the line on a day and it shows up here."));
    return card;
  }
  if (avail.length > 1) card.append(el("div", {class: "fbar trkmeasures"},
    ...avail.map(m => fchip(m === "sets" ? "Weight & sets" : m === "number" && g.code === "i" ? "Count" : TRACKER_MEASURES[m].label, m === measure,
      () => { PREF.set("trk.measure." + g.name, m); render(); }))));
  if (measure === "sets") {
    const now = sessions[sessions.length - 1];
    const heaviest = sessions.reduce((a, d) => (d.kg || 0) > (a.kg || 0) ? d : a, sessions[0]);
    card.append(el("div", {class: "trkstats"},
      now.kg != null ? el("span", {}, el("b", {}, fmtNum(now.kg) + " kg"), " latest") : null,
      el("span", {}, el("b", {}, now.reps.map(r => r == null ? "–" : fmtNum(r)).join(" / ")), " reps latest"),
      heaviest.kg ? el("span", {title: humanDate(heaviest.date)}, el("b", {}, fmtNum(heaviest.kg) + " kg"), " heaviest") : null,
      el("span", {}, el("b", {}, String(sessions.length)), " session" + (sessions.length === 1 ? "" : "s"))));
    card.append(trackerSetsChart(sessions, openDay));
    return card;
  }
  const pts = trackerSeries(g, measure);
  const info = TRACKER_MEASURES[measure];
  // A count reads in its own icon: 3 ☕ latest.
  const unit = info.unit ? " " + info.unit : g.code === "i" && measure === "number" ? " " + tapIcon({name: g.name, raw: last.raw}) : "";
  if (measure === "done") {
    let streak = 0;
    for (let i = pts.length - 1; i >= 0 && pts[i].v; i--) streak++;
    const recent = pts.slice(-30), hit = recent.filter(p => p.v).length;
    card.append(el("div", {class: "trkstats"},
      el("span", {}, el("b", {}, String(streak)), " in a row"),
      el("span", {}, el("b", {}, hit + " of " + recent.length), " lately")));
    card.append(trackerDoneStrip(pts, openDay));
    return card;
  }
  if (!pts.length) return card;
  const best = pts.reduce((a, p) => p.v > a.v ? p : a, pts[0]);
  const first = pts[0], now = pts[pts.length - 1];
  const change = now.v - first.v;
  card.append(el("div", {class: "trkstats"},
    el("span", {}, el("b", {}, fmtNum(now.v) + unit), " latest"),
    el("span", {title: humanDate(best.date)}, el("b", {}, fmtNum(best.v) + unit), " best"),
    pts.length > 1 ? el("span", {}, el("b", {class: change > 0 ? "up" : change < 0 ? "down" : ""},
      (change > 0 ? "+" : "") + fmtNum(change) + unit), " since " + humanDate(first.date)) : null,
    info.why ? el("span", {class: "plain"}, info.why) : null));
  if (trackerChartStyle([g.name], false) === "bar") {
    const series = trackerSeriesOf([g], measure, new Map([[g.name, colour]]));
    card.append(trackerDaysChart(series, trackerWindow([g]), "bar", measure, openDay));
  } else card.append(trackerLineChart(pts, measure, openDay));
  return card;
}
