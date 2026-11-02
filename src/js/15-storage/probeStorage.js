async function probeStorage() {
  try {
    localStorage.setItem("gtd.probe", "1");
    CAP.ls = localStorage.getItem("gtd.probe") === "1";
    localStorage.removeItem("gtd.probe");
  } catch (_) { CAP.ls = false; }
  try {
    await IDB.set("kv", "probe", Date.now());
    CAP.idb = (await IDB.get("kv", "probe")) != null;
  } catch (_) { CAP.idb = false; }
  CAP.persist = CAP.idb ? "idb" : CAP.ls ? "ls" : "memory";
  return CAP;
}
