/* A report is written to be pasted somewhere else -- an email, a status
   update, a stand-up note -- so it leaves as plain text rather than only
   living on this screen, grouped the way the screen is grouped. */
function copyReport(rows, window_, who, by) {
  const lines = ["Finished " + window_ + (who ? " by " + who : "") + " (" + rows.length + ")", ""];
  for (const [k, items] of reportGroups(rows, by || "customer")) {
    lines.push("## " + reportGroupLabel(k, by || "customer") + " (" + items.length + ")");
    for (const r of items)
      lines.push("- " + plainTitle(r.title) + "  - " + (r.approx ? "approx. " : "") + r.when + (r.who && !who ? ", " + r.who : ""));
    lines.push("");
  }
  copyText(lines.join("\n"), rows.length + " finished task(s) copied.");
}
