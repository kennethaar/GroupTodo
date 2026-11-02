function parseWhen(text) {
  const today = todayISO();
  const out = {source: text, title: text, SCHEDULED: null, DEADLINE: null, until: null,
               time: null, repeat: null, remind: null, priority: null, hold: null, taken: []};
  let s = trim(text);
  // Links at the end are kept aside: "Call Bob tomorrow [[c/phone]]" is still tomorrow.
  const lm = /((?:\s*\[\[[^\]]*\]\])+)\s*$/.exec(s);
  const tail = lm ? trim(lm[1]) : "";
  if (lm) s = trim(s.slice(0, lm.index));

  // Taskwarrior's words, anywhere in the line: due:fri until:eom remind:30m
  s = s.replace(/(^|\s)(due|sched|scheduled|until|hold|wait|remind|pri|priority):(\S+)/gi, (all, pre, key, val) => {
    key = key.toLowerCase();
    const v = val.toLowerCase();
    if (key === "remind") { out.remind = v; out.taken.push(all.trim()); return pre; }
    if (key === "pri" || key === "priority") {
      if (!/^[hml]$/.test(v)) return all;
      out.priority = v.toUpperCase(); out.taken.push(all.trim()); return pre;
    }
    if ((key === "hold" || key === "wait") && v === HOLD_OPEN) { out.hold = HOLD_OPEN; out.taken.push(all.trim()); return pre; }
    const [dayPart, timePart] = v.split(/[@t,](?=\d)/);
    const day = whenDay(dayPart, today, 2);
    if (!day) return all;
    const prop = key === "due" ? "DEADLINE" : key === "until" ? "until"
               : key === "hold" || key === "wait" ? "hold" : "SCHEDULED";
    out[prop] = day;
    if (timePart && prop !== "until" && prop !== "hold") out.time = whenClock(timePart.includes(":") ? timePart : "at " + timePart);
    out.taken.push(all.trim());
    return pre;
  });
  s = trim(s.replace(/\s+/g, " "));

  for (let guard = 0; guard < 4; guard++) {
    const words = s.split(/\s+/);
    let hit = null;
    // Longest phrase first, and never the whole line: a task called "Tomorrow" stays one.
    for (let n = Math.min(5, words.length - 1); n >= 1 && !hit; n--) {
      const raw = words.slice(-n).join(" ");
      const p = whenEnglish(raw.toLowerCase().replace(/[,;!?]+$/, ""));
      const every = /^(?:every|each)\s+(.+)$/.exec(p);
      if (!out.repeat && every && (parseRepeat(every[1]) || parseRule("every " + every[1]))) { out.repeat = "every " + every[1]; hit = raw; break; }
      if (!out.repeat && REPEAT_WORD_RE.test(p) && (parseRepeat(p) || parseRule(p))) { out.repeat = p; hit = raw; break; }
      if (!out.time && !out.SCHEDULED && !out.DEADLINE) {
        const rel = whenFromNow(p);
        if (rel) { out.time = rel.time; out.SCHEDULED = rel.day; out.remind = out.remind || "0"; hit = raw; break; }
      }
      if (!out.time) {
        const c = whenClock(p) || whenClock(p.replace(/\.$/, ""));
        if (c) { out.time = c; hit = raw; break; }
      }
      if (!out.SCHEDULED && !out.DEADLINE) {
        const km = /^(\S+)\s+(.+)$/.exec(p);
        const kind = km && WHEN_KIND[km[1]];
        const day = kind ? (whenDay(km[2], today, 1) || whenDay(km[2].replace(/\.$/, ""), today, 1))
                         : (whenDay(p, today) || whenDay(p.replace(/\.$/, ""), today));
        // "every monday" is a repeat even when the repeat word is not part of this phrase.
        const before = whenEnglish((words[words.length - n - 1] || "").toLowerCase());
        if (day && !/^(every|each|hver)$/.test(before)) {
          if (kind === "until") { if (!out.until) { out.until = day; hit = raw; } }
          else { out[kind || "SCHEDULED"] = day; hit = raw; }
        }
      }
    }
    if (!hit) break;
    out.taken.unshift(hit);
    s = trim(s.slice(0, s.length - hit.length)).replace(/[,;]$/, "");
  }

  // A time with no day is the next time the clock says it.
  if (out.time && !out.SCHEDULED && !out.DEADLINE)
    out.SCHEDULED = out.time > nowHM() ? today : shiftISO(today, 1);
  if (out.repeat && !out.SCHEDULED && !out.DEADLINE && parseRepeat(out.repeat)?.unit === "weekday")
    out.SCHEDULED = nextRepeatDate(out.repeat, shiftISO(today, -1));
  if (!out.taken.length) return null;
  out.title = trim(s + (tail ? " " + tail : ""));
  return out;
}
