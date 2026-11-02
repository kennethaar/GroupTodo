function dateFromWords(phrase) {
  const p = whenEnglish(trim(String(phrase || "")).toLowerCase()).replace(/^(on|by|due|until|before)\s+/, "");
  const T = todayISO();
  if (!p) return null;
  if (/^(today|tonight|now)$/.test(p)) return T;
  if (/^(tomorrow|tmrw|tmr)$/.test(p)) return shiftISO(T, 1);
  if (p === "day after tomorrow") return shiftISO(T, 2);
  if (/^(next week)$/.test(p)) return nextWeekday(1);
  if (/^(end of (the )?week|eow)$/.test(p)) return nextWeekday(5, false);
  if (/^(this )?weekend$/.test(p)) return nextWeekday(6, false);
  if (/^(next month)$/.test(p)) return addMonths(T.slice(0, 8) + "01", 1);
  if (/^(end of (the )?month|eom)$/.test(p)) return shiftISO(addMonths(T.slice(0, 8) + "01", 1), -1);
  let m = /^(next |this )?(sun|mon|tue|tues|wed|thu|thur|thurs|fri|sat)[a-z]*$/.exec(p);
  if (m) {
    const dow = WEEKDAY_WORDS.findIndex(w => w.startsWith(m[2].slice(0, 3)));
    // "next friday" is the Friday of next week; "friday" is the next one coming.
    return m[1] === "next " ? shiftISO(nextWeekday(1), (dow + 6) % 7) : nextWeekday(dow, true);
  }
  m = /^in (\d{1,3}|a|an|one|two|three) (day|days|week|weeks|month|months)$/.exec(p);
  if (m) {
    const n = {a: 1, an: 1, one: 1, two: 2, three: 3}[m[1]] || +m[1];
    return m[2].startsWith("day") ? shiftISO(T, n) : m[2].startsWith("week") ? shiftISO(T, 7 * n) : addMonths(T, n);
  }
  m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(p);
  if (m) return p;
  const year = Number(T.slice(0, 4));
  const ymd = (d, mo) => {
    // 14.30 is half past two, not the 14th of a thirtieth month two years on.
    if (mo < 1 || mo > 12) return null;
    let iso = year + "-" + pad2(mo) + "-" + pad2(d);
    if (!parseISO(iso) || new Date(year, mo - 1, d).getDate() !== d) return null;
    if (iso < T) iso = (year + 1) + iso.slice(4);    // a date already past is next year's
    return iso;
  };
  m = /^(\d{1,2})\.?\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?$/.exec(p);
  if (m) return ymd(+m[1], MONTH_WORDS.indexOf(m[2]) + 1);
  m = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*(\d{1,2})$/.exec(p);
  if (m) return ymd(+m[2], MONTH_WORDS.indexOf(m[1]) + 1);
  m = /^(\d{1,2})[./](\d{1,2})$/.exec(p);
  if (m) return ymd(+m[1], +m[2]);
  return null;
}
