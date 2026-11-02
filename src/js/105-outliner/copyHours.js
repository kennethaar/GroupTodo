function copyHours(weeks, by) {
  const lines = [];
  for (const [monday, items] of weeks) {
    lines.push("## " + weekLabel(monday) + " · " + fmtMinutes(items.reduce((s, e) => s + timeLogMin(e), 0)));
    const tot = new Map();
    for (const e of items) tot.set(hoursKey(e, by), (tot.get(hoursKey(e, by)) || 0) + timeLogMin(e));
    for (const [k, m] of [...tot.entries()].sort((a, b) => b[1] - a[1])) lines.push(k + ": " + fmtMinutes(m));
    lines.push("");
    for (const e of items) {
      const a = trim(blockProp(e.block, "in") || ""), z = trim(blockProp(e.block, "out") || "");
      const open = timeLogOpen(e.block);
      lines.push("- " + e.date + "  " + [e.who, e.project, a ? a + "-" + (z || "?") : "",
        open && e.date < todayISO() ? "no time out" : (open ? "still there, " : "") + fmtMinutes(timeLogMin(e)),
        timeLogNote(e.block)].filter(Boolean).join("  "));
    }
    lines.push("");
  }
  copyText(lines.join("\n"), "Hours copied.");
}
