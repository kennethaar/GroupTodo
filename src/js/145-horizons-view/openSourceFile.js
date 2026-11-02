/* ---------- the file itself, in the editor on the machine holding it ----------
   The vault is markdown, and a page is one file, so "open the file" is a thing
   somebody genuinely wants: to fix something quickly in Notepad, to see what
   the app is actually writing, to run it past a tool the app has never heard
   of. A browser cannot launch a program -- but when the vault is served by
   serve.py, that process can, on its own machine, and only when it was started
   with --open-in-editor. */
async function openSourceFile(path) {
  const b = V.backend;
  if (!b || !b.openFile) {
    notify("Opening the file needs the vault served by serve.py - that is the only " +
           "part of this that sits on a machine with an editor on it.", "warn");
    return false;
  }
  try {
    const r = await b.openFile(path);
    notify(r && r.with
      ? "Opened " + path + " in " + r.with + " on the machine running the server."
      : "Opened " + path + " on the machine running the server.");
    return true;
  } catch (e) {
    notify(String((e && e.message) || e), "warn");
    return false;
  }
}
