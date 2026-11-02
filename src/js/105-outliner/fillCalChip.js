function fillCalChip(wrap) {
  const [open, now] = wrap.children;
  const feeds = calFeeds(), last = calLast();
  const failed = !!(last && last.failed && last.failed.length);
  let sub, bad = false;
  if (!feeds.length) sub = "add a link";
  else if (CAL_SYNCING) sub = "fetching…";
  else if (!last) sub = "not fetched yet";
  else if (failed) { sub = "not fetched"; bad = true; }
  else sub = "updated " + calAgo(last.at);
  wrap.classList.toggle("busy", CAL_SYNCING);
  open.textContent = "";
  open.append("\u{1F4C5} Calendars ", el("span", {class: "calsub" + (bad ? " bad" : "")}, "· " + sub));
  open.title = !feeds.length ? "Bring meetings from your calendars into your day pages"
    : (last ? "Last fetched " + new Date(last.at).toLocaleString() + ". " : "") +
      "Fetched again every " + CAL_EVERY_MIN + " minutes while the app is open, and when you come back to it. " + CAL_LAG_NOTE;
  now.hidden = !feeds.length;
  now.disabled = CAL_SYNCING;
  now.title = CAL_SYNCING ? "Fetching…" : "Fetch calendars now";
}
