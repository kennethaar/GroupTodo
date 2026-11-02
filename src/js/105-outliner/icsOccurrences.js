/* Every time an event happens between two instants: its start and end. */
function icsOccurrences(ev, fromMs, toMs) {
  const st = ev.DTSTART && ev.DTSTART[0];
  const w = st && icsWall(st.value);
  if (!w) return [];
  const tz = st.params.TZID, allDay = w.date || st.params.VALUE === "DATE";
  const at = (y, m, d) => allDay ? new Date(y, m - 1, d).getTime() : icsInstant({...w, y, m, d}, tz, w.utc);
  const start = at(w.y, w.m, w.d);
  const end = ev.DTEND ? icsTimeOf(ev.DTEND[0], tz) : null;
  const dur = end != null ? end - start : icsDuration(ev.DURATION && ev.DURATION[0].value) ?? (allDay ? 864e5 : 0);
  const skip = new Set((ev.EXDATE || []).flatMap(p => p.value.split(",")
    .map(v => icsTimeOf({value: v, params: p.params}, tz, allDay))));
  const out = [];
  const push = ms => { if (!skip.has(ms) && ms + Math.max(dur, 1) > fromMs && ms < toMs) out.push({start: ms, end: ms + dur, allDay}); };
  const rr = ev.RRULE && ev.RRULE[0].value;
  if (!rr) { push(start); return out; }
  const rule = Object.fromEntries(rr.split(";").map(x => x.split("=")).map(([k, v]) => [String(k).toUpperCase(), v || ""]));
  const DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  const freq = rule.FREQ, every = Math.max(1, +rule.INTERVAL || 1), count = +rule.COUNT || Infinity;
  const uw = rule.UNTIL && icsWall(rule.UNTIL);
  const until = !uw ? Infinity : uw.date ? new Date(uw.y, uw.m - 1, uw.d).getTime() + 864e5 - 1 : icsInstant(uw, tz, uw.utc);
  const byday = (rule.BYDAY || "").split(",").map(x => /^([+-]?\d+)?(MO|TU|WE|TH|FR|SA|SU)$/.exec(x))
    .filter(Boolean).map(m => ({n: m[1] ? +m[1] : 0, wd: DAYS.indexOf(m[2])}));
  const bymd = (rule.BYMONTHDAY || "").split(",").filter(Boolean).map(Number);
  const bymonth = (rule.BYMONTH || "").split(",").filter(Boolean).map(Number);
  const DAY = 864e5, d0 = Date.UTC(w.y, w.m - 1, w.d) / DAY;
  const wd0 = new Date(d0 * DAY).getUTCDay();
  const monday = dn => dn - ((new Date(dn * DAY).getUTCDay() + 6) % 7);
  const inMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();
  const nth = (b, y, m, d, wd) => b.wd === wd && (!b.n || (b.n > 0 ? Math.ceil(d / 7) === b.n
    : Math.ceil((inMonth(y, m) - d + 1) / 7) === -b.n));
  const mdHit = (y, m, d) => bymd.some(x => x === d || (x < 0 && inMonth(y, m) + x + 1 === d));
  const dayHit = (y, m, d, wd) => bymd.length ? mdHit(y, m, d) : byday.length ? byday.some(b => nth(b, y, m, d, wd)) : d === w.d;
  /* BYSETPOS picks among the days of the month the rest of the rule lets
     through: Apple writes "the second Sunday" as BYDAY=SU;BYSETPOS=2, and
     "the last weekday" as BYDAY=MO,...,FR;BYSETPOS=-1. Without it, every
     Sunday would do. For YEARLY it is taken within each month of BYMONTH. */
  const setpos = (rule.BYSETPOS || "").split(",").filter(Boolean).map(Number).filter(x => x);
  const posOk = (y, m, d) => {
    if (!setpos.length || (freq !== "MONTHLY" && freq !== "YEARLY")) return true;
    const days = [];
    for (let k = 1; k <= inMonth(y, m); k++) if (dayHit(y, m, k, new Date(Date.UTC(y, m - 1, k)).getUTCDay())) days.push(k);
    return setpos.some(p => days[p > 0 ? p - 1 : days.length + p] === d);
  };
  let n = 0;
  for (let dn = d0; dn - d0 < 366 * 40; dn++) {
    const dt = new Date(dn * DAY), y = dt.getUTCFullYear(), m = dt.getUTCMonth() + 1, d = dt.getUTCDate(), wd = dt.getUTCDay();
    let ok;
    if (freq === "DAILY") ok = (dn - d0) % every === 0 && (!byday.length || byday.some(b => b.wd === wd));
    else if (freq === "WEEKLY") ok = ((monday(dn) - monday(d0)) / 7) % every === 0 && (byday.length ? byday.some(b => b.wd === wd) : wd === wd0);
    else if (freq === "MONTHLY") ok = ((y - w.y) * 12 + m - w.m) % every === 0 && dayHit(y, m, d, wd);
    else if (freq === "YEARLY") ok = (y - w.y) % every === 0 && (bymonth.length ? bymonth.includes(m) : m === w.m) && dayHit(y, m, d, wd);
    else { push(start); return out; }
    if (ok && bymonth.length && freq !== "YEARLY") ok = bymonth.includes(m);
    if (ok) ok = posOk(y, m, d);
    if (!ok) continue;
    const ms = at(y, m, d);
    if (ms < start) continue;
    if (ms > until || n >= count || ms >= toMs) break;
    n++;
    push(ms);
  }
  return out;
}
