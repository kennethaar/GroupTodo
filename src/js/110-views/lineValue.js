/* What the value of a whole-line tracker comes to on its day: minutes for
   start and end (out before in is past midnight; a stretch still open counts
   up to now today and as nothing on an earlier day), the sum for an amount,
   and for stock the change, or the count when it says =. */
function lineValue(code, raw, date) {
  if (code === "t") {
    let value = 0, open = false, stale = false;
    const today = date === todayISO();
    for (const s of clockSpans(raw)) {
      if (s.z != null) value += (s.z - s.a + 1440) % 1440;
      else if (today) { open = true; value += Math.max(0, clockMin(nowClock()) - s.a); }
      else stale = true;
    }
    return {value, open, stale};
  }
  let value = 0, set = false;
  for (const m of String(raw || "").matchAll(/([+\-−=]?)\s*(\d+(?:[.,]\d+)?)/g)) {
    const x = numIn(m[2]);
    if (m[1] === "=" && code === "q") { value = x; set = true; }
    else value += m[1] === "-" || m[1] === "−" ? -x : x;
  }
  return {value, set};
}
