/* The browser's own Print shows the whole view: the folds closed on screen
   are opened for the paper, and closed again after. */
let PRINT_OPENED = [];
window.addEventListener("beforeprint", () => {
  PRINT_OPENED = [...document.querySelectorAll("#content details:not([open])")];
  for (const d of PRINT_OPENED) d.open = true;
});
window.addEventListener("afterprint", () => {
  for (const d of PRINT_OPENED) d.open = false;
  PRINT_OPENED = [];
});

/* ============================================================
   PUTTING A DATED TASK IN A CALENDAR
   Two routes, and the difference matters.

   A .ics file is made here and downloaded. Nothing is sent anywhere, it works
   with every calendar there is, and it is the only route that works offline.

   A deeplink opens the calendar's own "new event" screen with the fields
   filled in. One click instead of download-then-import -- but the title and
   the date travel to Microsoft or Google in the URL, because that is how the
   link works. That is a per-click disclosure you can see happening, which is
   a different thing from subscribing a feed, and it is why there is no feed
   here: a subscription would hand over the whole list, forever, to a URL whose
   only protection is that nobody has guessed it.

   Navigation is not connect-src, so the CSP does not block these and does not
   need widening.
   ============================================================ */
const CAL_PREF_KEY = "calendar";
const calendarChoice = () => PREF.get(CAL_PREF_KEY, "");

const icsDate = iso => String(iso).replace(/-/g, "");
const icsEsc = t => String(t || "")
  .replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
/* RFC 5545 wants lines folded at 75 octets; a long task title otherwise makes
   a file some calendars quietly refuse. */
const icsFold = line => {
  const out = [];
  let rest = line;
  while (rest.length > 73) { out.push((out.length ? " " : "") + rest.slice(0, 73)); rest = rest.slice(73); }
  out.push((out.length ? " " : "") + rest);
  return out.join("\r\n");
};
