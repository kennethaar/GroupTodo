function trackerSeriesOf(groups, measure, colours) {
  return groups.map(g => ({name: g.name, label: trackerTitle(g.name),
    icon: g.code === "i" ? tapIcon({name: g.name, raw: ""}) : "", colour: colours.get(g.name) || "",
    by: new Map(trackerSeries(g, measure).map(p => [p.date, p]))}));
}
