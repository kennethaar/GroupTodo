/* The areas that live in one of serve.py's folders: one, as a rule, since a
   folder holds one area. base is that folder's address, SERVER_BASE unless
   given. */
function serverFolderUsers(base = SERVER_BASE) {
  const want = String(base || "").replace(/\/$/, "");
  if (!want) return [];
  return Spaces.list.filter(sp => sp.kind === "http" && String(sp.server || "").replace(/\/$/, "") === want);
}
