function viewTrackerCharts(c, headed) {
  if (!headed) { c.append(vhead("Trackers", "What you write down on your days, over time")); topUpTrackerSeries(); }
  const list = trackerList();
  if (!list.length) {
    c.append(el("div", {class: "card", style: "padding:16px"},
      el("p", {}, "Nothing tracked yet. A tracker is a line on a day page, like ",
        el("code", {}, "tracker-pullups_krrr:: 100/8/4/2"), "."),
      el("p", {class: "hint"}, "Type “tracker-” on a line, or pick Insert tracker in the menu under a line. " +
        "Put it in a journal template, such as 2026-Monday in Settings, to get it on every one of those days."),
      el("button", {class: "btn primary", onclick: () => {
        const path = ensureJournal(todayISO());
        openTrackerWizard((title, when) => {
          const spare = newBlock({title: ""}, false);
          getPage(path).blocks.push(spare);
          insertTracker(path, spare, title, when);
          const page = getPage(path);
          if (!trim(spare.title)) page.blocks.splice(page.blocks.indexOf(spare), 1);
          touch(path); openPage(path);
        }, path);
      }}, "Set up a tracker on today's page")));
    return c;
  }
  const review = list.filter(g => g.name.startsWith(REVIEW_TRACKER_PREFIX));
  if (review.length) c.append(reviewTrackerCard(review));
  for (const chart of trackerCharts(list.filter(g => !review.includes(g))))
    c.append(chart.name ? trackerChartCard(chart) : trackerCard(chart.groups[0]));
  c.append(el("p", {class: "hint"}, "Only day pages count. Click a day to open it."));
  return c;
}
