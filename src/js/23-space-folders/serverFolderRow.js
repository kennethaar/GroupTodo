/* serve.py's folders, at the foot of Your areas (#356, #357): each with the
   area living in it, Remove while none does, and Add server folder. A browser
   never learns a folder's path, so serve.py opens the folder picker on this
   computer, and offers to only when it runs here with no password and no
   --vault. redraw() draws the cards again once the folders are known, so Use
   server folder shows on them. */
function serverFolderRow(again, redraw) {
  const row = el("div", {class: "afserver"});
  if (!CAP.served) return row;
  (async () => {
    let j = null;
    try {
      const r = await fetchWithin("./api/ping", {cache: "no-store"}, 2500);
      j = r.ok ? await r.json().catch(() => null) : null;
    } catch (_) {}
    if (!j || j.calendarsOnly) return;
    SERVER_BASE = null;
    await detectServer();
    SERVER_INFO = j;
    const ask = async (method, query = "") => {
      const r = await fetch("./api/server-folder" + query, {method, headers: {"X-GroupTodo": "folder"}});
      if (!r.ok) throw new Error((await r.text()) || r.status);
      return r.json();
    };
    const add = async () => {
      notify("Pick the folder in the window that opens on this computer.");
      try {
        const res = await ask("POST");
        if (res.cancelled) return;
        notify("Server folder " + res.folder.name + " added: “" + res.folder.path + "”.");
      } catch (e) { notify("Could not add a folder: " + e.message, "error"); return; }
      closeModal(); again();
    };
    const remove = async o => {
      try {
        await ask("DELETE", "?name=" + encodeURIComponent(o.name));
        notify("Server folder " + o.name + " removed. Its files stay where they are.");
      } catch (e) { notify("Could not remove the server folder: " + e.message, "error"); return; }
      closeModal(); again();
    };
    const btn = (label, fn) => el("button", {class: "btn sm ghost", onclick: fn}, label);
    const options = serverFolderOptions();
    row.append(el("div", {class: "afslabel"}, "Server folders"));
    if (!options.length) row.append(el("div", {class: "afspath"}, "None"));
    for (const o of options) row.append(el("div", {class: "afsfolder"},
      el("div", {class: "afspath"}, el("b", {}, o.name), "  " + o.path + serverFilesNote(o)),
      el("div", {class: "afsnote"}, o.users.length ? "Used by " + o.users.map(sp => sp.name).join(", ") : "Not used"),
      j.folderChoosable && !o.locked && !o.users.length ? btn("Remove", () => remove(o)) : null));
    if (j.folderChoosable) row.append(el("div", {class: "afbtns"}, btn("Add server folder", add)));
    redraw();
  })();
  return row;
}
