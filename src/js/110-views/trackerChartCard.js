/* Two or more trackers of one letter that name the same chart::, on one card. */
function trackerChartCard(chart) {
  const {name, code, groups} = chart;
  const measure = SHARED_MEASURE[code], info = TRACKER_MEASURES[measure];
  const openDay = e => openPageIn(e.space || V.space, e.path);
  const names = groups.map(g => g.name);
  const series = trackerSeriesOf(groups, measure, trackerColours(names));
  const days = trackerWindow(groups), today = todayISO();
  const card = el("div", {class: "card trkcard trkshared"});
  card.append(trackerCardHead(name, groups.length + " trackers · " + trackerKindWords(code) + " · " + TRACKER_DAYS + " days",
    () => chipMenu(name, "each tracker in it has its own page", lettered(groups.map(g =>
      [(g.code === "i" ? tapIcon({name: g.name, raw: ""}) + " " : "") + trackerTitle(g.name), "its page", () => openTrackerPage(g.name)])))));
  const unit = info.unit ? " " + info.unit : "";
  const on = d => series.reduce((n, s) => n + (s.by.get(d)?.v || 0), 0);
  const filled = days.filter(d => d <= today && series.some(s => s.by.has(d)));
  const avg = filled.length ? filled.reduce((n, d) => n + on(d), 0) / filled.length : null;
  card.append(el("div", {class: "trkstats"},
    el("span", {}, el("b", {}, fmtNum(on(today)) + unit), " together today"),
    ...series.map(s => el("span", {title: s.label + " today"},
      el("b", {}, fmtNum(s.by.get(today)?.v || 0) + (s.icon ? " " + s.icon : unit)), s.icon ? null : " " + s.label)),
    avg != null ? el("span", {}, el("b", {}, fmtNum(avg) + unit), " a day on average") : null));
  card.append(filled.length ? trackerDaysChart(series, days, trackerChartStyle(names, true), measure, openDay)
    : el("p", {class: "hint"}, "Nothing in the last " + TRACKER_DAYS + " days."));
  return card;
}
