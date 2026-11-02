/* Today's date for a file name, "2026-10-16", in your own time zone. */
const fileWhen = () => {
  try {
    return new Intl.DateTimeFormat("sv-SE", {dateStyle: "short", timeZone: userTZ()}).format(new Date());
  } catch (_) { return nowStamp().slice(0, 10); }
};
