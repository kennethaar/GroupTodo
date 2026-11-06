/* The first start of a new version: what has come since the one run last on
   this device. A first start ever has the tour instead, and a device that ran
   an older app before this was written down hears about this version only. */
function maybeShowWhatsNew() {
  const last = PREF.get("ran.version");
  PREF.set("ran.version", APP_VERSION);
  if (!PREF.get("onboarded") || (last && verCmp(APP_VERSION, last) <= 0)) return;
  const entries = newsEntries(HELP_NEWS).filter(e => verCmp(e.version, APP_VERSION) <= 0 &&
    (last ? verCmp(e.version, last) > 0 : e.version === APP_VERSION));
  if (!entries.length) return;
  nudgeToast({stay: true, kind: "whatsnew",
    title: [svgIcon(ICON_CONFETTI), " Welcome to v" + APP_VERSION + "!"],
    hint: thingsCount(entries) + (last ? " since v" + last : "") + ". Take a look:",
    body: newsList(entries),
    foot: [el("button", {class: "btn primary sm", onclick: () => whatsNewDialog(entries, {since: last})}, "See what's new")]});
}
