async function getUpdate(version) {
  if (UPDATE_HOSTED) { location.reload(); return; }
  const job = startJob("Downloading GroupToDo v" + version);
  try {
    const r = await fetch(REPO_RAW + "grouptodo.html", {cache: "no-store"});
    if (!r.ok) throw new Error(r.status);
    downloadText("grouptodo.html", await r.text(), "text/html");
    job.finish();
  } catch (_) {
    job.finish("The download did not go through. Opening GitHub instead.", "warn");
    window.open(REPO_URL, "_blank", "noopener");
    return;
  }
  PREF.set("update.fetched", version);
  modal({center: true, title: "Almost there!",
    body: el("div", {class: "field"},
      el("p", {}, "GroupToDo v" + version + " is in your Downloads folder."),
      el("ol", {class: "helpsteps"},
        el("li", {}, "Put it where this one is, in its place."),
        el("li", {}, "Close this tab."),
        el("li", {}, "Open the new grouptodo.html.")),
      el("p", {class: "quiet"}, "Your lists stay as they are. They live in your folder, not in the app.")),
    foot: [el("button", {class: "btn primary", onclick: closeModal}, "Got it")]});
}
