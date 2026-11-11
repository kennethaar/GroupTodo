/* Every folder serve.py offers an area (#357): the one named with --vault, at
   its root, then each chosen in the app, at its own address. Each with the
   areas living in it. */
function serverFolderOptions() {
  const out = [];
  const info = SERVER_INFO || {};
  if (SERVER_BASE) {
    const path = info.vault || "";
    out.push({name: path.split(/[\\/]/).filter(Boolean).pop() || "Server folder", path,
              files: info.files, base: SERVER_BASE, locked: true});
  }
  for (const f of info.folders || [])
    out.push({name: f.name, path: f.path, files: f.files, base: servedAt() + "/" + f.base});
  for (const o of out) o.users = serverFolderUsers(o.base);
  return out;
}
