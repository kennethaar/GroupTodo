/* A pasted link as people paste it: in quotes or angle brackets, as http://,
   or with no scheme at all. Calendars are fetched over https only. */
function calNormalizeUrl(raw) {
  let u = trim(String(raw || "")).replace(/^[<"'\s]+|[>"'\s]+$/g, "");
  if (!u) return "";
  if (/^http:\/\//i.test(u)) u = "https://" + u.slice(7);
  else if (!/^(https|webcal):\/\//i.test(u) && /^[\w-]+(\.[\w-]+)+\//.test(u)) u = "https://" + u;
  try { const x = new URL(u.replace(/^webcal:/i, "https:")); return x.hostname.includes(".") ? u : ""; } catch (_) { return ""; }
}
