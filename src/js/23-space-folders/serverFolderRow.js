/* serve.py's own folder, at the foot of Your areas (#356): where it is, which
   area lives there, and Choose, Change or Remove. A browser never learns a
   folder's path, so serve.py opens the folder picker on this computer, and
   offers to only when it runs here with no password and no --vault.
   redraw() draws the cards again once the folder is known, so Use server
   folder shows on them. */
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
    const users = serverFolderUsers();
    const ask = async (method, what) => {
      // Pages still on their way to the old folder must land there first.
      if (users.length) await flush();
      const r = await fetch("./api/server-folder", {method, headers: {"X-GroupTodo": "folder"}});
      if (!r.ok) throw new Error((await r.text()) || r.status);
      return r.json();
    };
    const choose = async () => {
      notify("Pick the folder in the window that opens on this computer.");
      try {
        const res = await ask("POST");
        if (res.cancelled) return;
        // An area living there now reads another folder: start it afresh.
        if (users.length) { location.reload(); return; }
        notify("The server folder is now “" + res.vault + "”.");
      } catch (e) { notify("Could not choose a folder: " + e.message, "error"); return; }
      closeModal(); again();
    };
    const remove = async () => {
      try { await ask("DELETE"); notify("The server folder is removed. Your files stay where they are."); }
      catch (e) { notify("Could not remove the server folder: " + e.message, "error"); return; }
      closeModal(); again();
    };
    const btn = (label, fn) => el("button", {class: "btn sm ghost", onclick: fn}, label);
    row.append(
      el("div", {class: "afslabel"}, "Server folder"),
      el("div", {class: "afspath"}, j.vault ? j.vault + "  (" + j.files + " files)" : "None"),
      users.length ? el("div", {class: "afnote"}, "Used by " + users.map(sp => sp.name).join(", ")) : null,
      j.folderChoosable ? el("div", {class: "afbtns"},
        j.vault ? btn("Change folder", choose) : btn("Choose folder", choose),
        j.vault && !users.length ? btn("Remove", remove) : null) : null);
    redraw();
  })();
  return row;
}
