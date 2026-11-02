function trackerWhen(name) {
  const today = todayISO();
  const tpls = trackerTemplatesWith(name).filter(x => !isPastWhenName(baseName(x.p), today));
  const names = tpls.map(x => baseName(x.p));
  let key = null;
  const see = t => { if (!key && t && t.name === name) key = t.key; };
  for (const {sp, p} of tpls) inSpace(sp, () => {
    const page = getPage(p);
    walkBlocks(page.blocks, b => see(parseTracker(b.title)));
    for (const k of Object.keys(page.props || {})) see(parseTracker(k + "::"));
  });
  const kinds = [
    ["daily", names.filter(n => n === "journals" || /^\d{4}$/.test(n))],
    ["weekly", names.filter(n => weekdayOfName(n) >= 0)],
    ["monthdays", names.filter(n => /^\d{2}-\d{2}$/.test(n))],
    ["months", names.filter(n => /^\d{4}-\d{2}$/.test(n))],
    ["series", names.filter(isDateName).sort()],
  ].filter(([, list]) => list.length);
  let when = null;
  if (kinds.length) {
    const [kind, list] = kinds[0];
    when = kind === "daily" ? {mode: "daily"}
      : kind === "weekly" ? {mode: "weekly", days: [...new Set(list.map(weekdayOfName))]}
      : kind === "monthdays" ? {mode: "monthdays", mdays: [...new Set(list.map(n => +n.slice(3)))]}
      : kind === "months" ? {mode: "months", months: [...new Set(list.map(n => +n.slice(5)))]}
      : inferSeries(list);
  }
  const series = kinds.find(([k]) => k === "series");
  return {when, key, also: kinds.slice(1).flatMap(([, l]) => l), other: names.filter(n => !isWhenName(n)),
    last: series ? series[1][series[1].length - 1] : null, space: tpls[0]?.sp || V.space};
}
