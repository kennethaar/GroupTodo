/* ---------- updates ----------
   Once a day the app asks GitHub for CHANGELOG.md, the one file that says both
   which version is newest and what it brings. Nothing is sent but the request
   itself, and the vault is never part of it. The demo and a locked preview
   frame never ask. A newer version is offered in the corner: on the hosted
   copy a reload is the update (the service worker fetches network first), and
   anywhere else, a file on disk or serve.py, it is a fresh grouptodo.html. */
const REPO = "kennethaar/GroupTodo";
const REPO_URL = "https://github.com/" + REPO;
const REPO_RAW = "https://raw.githubusercontent.com/" + REPO + "/main/";
const UPDATE_HOSTED = location.hostname === "kennethaar.github.io";
let UPDATE = null;                 // {version, entries} once a newer one is found

const verCmp = (a, b) => {
  const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number);
  for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0);
  return 0;
};
const updatesOn = () => PREF.get("update.check", "on") !== "off";
const updatesPossible = () => !window.GTD_DEMO && !CAP.sandboxed;
