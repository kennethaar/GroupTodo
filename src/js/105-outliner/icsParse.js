/* RFC 5545, as much of it as calendars send: folded lines, quoted
   parameters, time zones, and the common repeat rules. */
function icsParse(text) {
  const lines = String(text).replace(/\r\n?/g, "\n").replace(/\n[ \t]/g, "").split("\n");
  const events = [];
  let cur = null, depth = 0;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { cur = {}; depth = 0; continue; }
    if (line === "END:VEVENT") { if (cur) events.push(cur); cur = null; continue; }
    if (!cur) continue;
    if (/^BEGIN:/.test(line)) { depth++; continue; }      // an alarm inside the event
    if (/^END:/.test(line)) { depth--; continue; }
    if (depth) continue;
    let q = false, at = -1;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') q = !q;
      else if (line[i] === ":" && !q) { at = i; break; }
    }
    if (at < 0) continue;
    const [name, ...ps] = line.slice(0, at).split(/;(?=(?:[^"]*"[^"]*")*[^"]*$)/);
    const params = {};
    for (const p of ps) { const e = p.indexOf("="); if (e > 0) params[p.slice(0, e).toUpperCase()] = p.slice(e + 1).replace(/^"|"$/g, ""); }
    const value = line.slice(at + 1).replace(/\\([\\;,nN])/g, (_, c) => c === "n" || c === "N" ? "\n" : c);
    const key = name.toUpperCase();
    (cur[key] = cur[key] || []).push({params, value});
  }
  return events;
}
