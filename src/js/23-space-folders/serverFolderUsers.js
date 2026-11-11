/* The areas that live in serve.py's folder. One, as a rule: a folder holds one area. */
function serverFolderUsers() {
  const base = String(SERVER_BASE || "").replace(/\/$/, "");
  if (!base) return [];
  return Spaces.list.filter(sp => sp.kind === "http" && String(sp.server || "").replace(/\/$/, "") === base);
}
