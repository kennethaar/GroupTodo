async function detectServer() {
  if (SERVER_BASE !== null) return SERVER_BASE;
  SERVER_BASE = "";
  if (CAP.served) {
    try {
      const r = await fetchWithin("./api/ping", {cache: "no-store"}, 2500);
      const j = r.ok ? await r.json().catch(() => ({})) : null;
      if (j && !j.calendarsOnly) SERVER_INFO = j;
      /* A helper started with --calendars-only fetches calendars and keeps no
         files, and one started with no --vault has only a made-up default
         that nobody chose: neither is offered as a home for an area. */
      if (r.ok && j && !j.calendarsOnly && j.vaultChosen) SERVER_BASE = servedAt();
    } catch (_) {}
  }
  return SERVER_BASE;
}
