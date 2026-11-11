/* Once per serve.py start (#357): the app came from serve.py, here are its
   folders and the area in each, and what else it does for you. serve.py
   says which start this is; a reload in the same run stays quiet. Returns
   true when shown. */
function maybeServeNotice(info) {
  if (!info || !info.startedAt || PREF.get("serveSeen") === info.startedAt) return false;
  PREF.set("serveSeen", info.startedAt);
  SERVER_INFO = info;
  const options = serverFolderOptions();
  const line = (text, muted) => el("div", {style: "font-size:13px;line-height:1.5;" + (muted ? "color:var(--fg2)" : "")}, text);
  const folders = el("div", {style: "display:flex;flex-direction:column;gap:6px;margin:6px 0 12px"},
    ...options.map(o => el("div", {},
      line([el("b", {}, o.name), "  " + o.path + serverFilesNote(o)]),
      line(o.users.length ? "Area: " + o.users.map(sp => sp.name).join(", ") : "Not used", true))));
  modal({
    center: true, title: "Started from serve.py",
    body: el("div", {},
      line(options.length
        ? options.length + (options.length === 1 ? " server folder" : " server folders") + " on this computer:"
        : "No server folders yet. Add one under Manage areas, and every device that opens GroupToDo from serve.py finds that area by itself."),
      options.length ? folders : el("div", {style: "height:10px"}),
      line("serve.py also fetches your calendar links." +
           (info.open_in_editor ? " It opens pages in your editor on this computer." : ""), true),
      info.logFile ? line("Log: " + info.logFile, true) : null),
    foot: [
      el("button", {class: "btn ghost", onclick: () => { closeModal(); openSpaceStorageSetup(); }}, "Manage areas"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: closeModal}, "OK"),
    ],
  });
  return true;
}
