function lineMeta(b, path = null, readonly = false) {
  const out = [];
  const due = dueDate(b);
  if (b.state && due && OPEN_STATES[b.state]) {
    const cls = due < todayISO() ? "late" : due === todayISO() ? "today" : "";
    const words = humanWhen(due, dueWhen(b)?.time) + (relDue(due) ? " · " + relDue(due) : "");
    // A page shown read-only, or a line with no page to write to, keeps the plain pill.
    out.push(path && !readonly ? duePill({path, block: b, space: V.space, due}, cls, words)
      : el("span", {class: "chip " + cls}, words));
  }
  if (repeatOf(b)) out.push(path && !readonly ? repeatPill(path, b) : el("span", {class: "chip"}, "\u21BB " + repeatOf(b)));
  const who = b.state ? assigneeOf(b) : "";
  if (who && !samePerson(who, whoAmI())) out.push(el("span", {class: "chip who"}, "\u2192 " + who));
  const said = messagesOf(b).length;
  if (said) out.push(el("span", {class: "chip msg" + (unreadCount(b) ? " unread" : "")}, "\u25CB " + said));
  // A meeting says when and with whom as chips of its own.
  const meet = isMeeting(b);
  if (meet) {
    // On its own day the time leads the line (meetLead), so it is not said again here.
    const when = [blockProp(b, "date") ? humanDate(dateIn(blockProp(b, "date"))) : "",
      meetLeads(b) ? "" : blockProp(b, "time") || ""].filter(Boolean).join(" ");
    if (when) out.push(el("span", {class: "chip"}, "🕒 " + when));
    const clash = meetLeads(b) && path ? meetClashes(b, getPage(path)) : [];
    if (clash.length) out.push(el("span", {class: "chip clash", title: "At the same time as " + clash.join(", ")},
      "⚠ Overlaps " + clash[0] + (clash.length > 1 ? " +" + (clash.length - 1) : "")));
    if (blockProp(b, "attendees")) out.push(el("span", {class: "chip who"}, "👥 " + linkWords(blockProp(b, "attendees"))));
  }
  // A visit says its clock and its hours as one chip, which opens it again.
  const visit = isTimeLog(b);
  if (visit) out.push(timeLogChip(b, path));
  if (b.state) { const ck = clockChip(b, path); if (ck) out.push(ck); }
  const rest = Object.entries(b.props || {}).filter(([k, v]) => !BOOKKEEPING.test(k) && trim(v) && !isMessage(b)
    && !(meet && /^(date|time|attendees)$/i.test(k)) && !(visit && /^(in|out|hours)$/i.test(k)));
  // On a day page each value says, faintly, what you wrote the last time.
  const day = path && dayOfPath(path);
  if (rest.length) out.push(el("span", {class: "pkv"}, ...rest.flatMap(([k, v], i) => [
    i ? "  \u00B7  " : null,
    el("span", {html: esc(k) + ":: " + renderInline(v)}),
    day && isDayValueKey(k) ? prevValueEl(path, k.toLowerCase()) : null])));
  return out.length ? el("div", {class: "props"}, ...out) : null;
}
