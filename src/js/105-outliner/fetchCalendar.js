async function fetchCalendar(url) {
  url = trim(url).replace(/^webcal:/i, "https:");
  let why = "";
  for (const base of calProxyBases()) {
    try {
      const r = await fetch(base + "/api/calendar?url=" + encodeURIComponent(url));
      const text = await r.text();
      if (r.ok && /BEGIN:VCALENDAR/.test(text)) return text;
      if (r.status !== 404) why = trim(text).slice(0, 200);
    } catch (_) {}
  }
  throw new Error(why || CAL_NO_SERVER);
}
