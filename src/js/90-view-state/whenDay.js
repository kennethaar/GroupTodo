/* One phrase -> a day, or null. `loose` says how sure we are that a date was
   meant: 0 for the bare end of a line, 1 after "by" or "on", 2 for the value
   of due: or until:, where nothing else could have been meant and 3d is safe. */
function whenDay(p, today, loose = 0) {
  let m;
  // Short forms that are also words -- Tom, the sun, sat down -- count only
  // where nothing else could have been meant.
  if (loose < 1 && WHEN_LOOSE_ONLY.has(p)) return null;
  if (/^(today|tod|i ?dag|eod)$/.test(p)) return today;
  if (/^(tomorrow|tmrw|tom|i ?morgen)$/.test(p)) return shiftISO(today, 1);
  if (/^((the )?day after tomorrow|(i )?overmorgen)$/.test(p)) return shiftISO(today, 2);
  if (p in WHEN_WEEKDAYS) return nextWeekdayISO(WHEN_WEEKDAYS[p], today);
  if ((m = /^(?:next|neste)\s+(\S+)$/.exec(p)) && m[1] in WHEN_WEEKDAYS)
    return shiftISO(mondayAfterISO(today), (WHEN_WEEKDAYS[m[1]] + 6) % 7);
  if (/^(next week|neste uke)$/.test(p)) return mondayAfterISO(today);
  if (/^(next month|neste måned)$/.test(p)) return addMonths(today.slice(0, 8) + "01", 1);
  if (/^eow$/.test(p)) return shiftISO(today, (7 - weekdayOf(today)) % 7);
  if (/^eom$/.test(p)) return shiftISO(addMonths(today.slice(0, 8) + "01", 1), -1);
  if (/^eoy$/.test(p)) return today.slice(0, 4) + "-12-31";
  if ((m = /^(?:in|om)\s+(an?|one|en|ett|\d{1,3})\s+(days?|dager?|weeks?|uker?|uke|months?|måneder?|måned|years?|år)$/.exec(p))) {
    const n = /^\d/.test(m[1]) ? Number(m[1]) : 1;
    const u = m[2][0];
    return u === "d" ? shiftISO(today, n) : (u === "w" || u === "u") ? shiftISO(today, 7 * n)
         : (u === "y" || u === "å") ? addMonths(today, 12 * n) : addMonths(today, n);
  }
  if ((m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(p))) return whenDayMonth(+m[3], +m[2], +m[1], today);
  if ((m = /^(\d{1,2})(?:st|nd|rd|th|\.)?\s+([a-zæøå]+)\.?(?:\s+(\d{4}))?$/.exec(p)) && m[2] in WHEN_MONTHS)
    return whenDayMonth(+m[1], WHEN_MONTHS[m[2]], m[3] ? +m[3] : 0, today);
  if ((m = /^([a-zæøå]+)\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?$/.exec(p)) && m[1] in WHEN_MONTHS)
    return whenDayMonth(+m[2], WHEN_MONTHS[m[1]], m[3] ? +m[3] : 0, today);
  // Day first, the way it is written everywhere this app is used.
  if ((m = /^(\d{1,2})[./](\d{1,2})(?:[./](\d{4}|\d{2}))?(\.)?$/.exec(p)) && (loose >= 1 || m[3] || m[4]))
    return whenDayMonth(+m[1], +m[2], m[3] ? +m[3] : 0, today);
  if (loose >= 2 && (m = /^\+?(\d{1,3})([dwmy])$/.exec(p))) {
    const n = Number(m[1]);
    return m[2] === "d" ? shiftISO(today, n) : m[2] === "w" ? shiftISO(today, 7 * n)
         : m[2] === "m" ? addMonths(today, n) : addMonths(today, 12 * n);
  }
  return null;
}
