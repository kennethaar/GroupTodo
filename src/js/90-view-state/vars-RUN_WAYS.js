/* ---------- ways to run (#290) ----------
   The four ways GroupToDo runs and what each can do, for the chooser under
   "Ways to run GroupToDo". can: the needs a way meets. py: it needs Python,
   run: a window left running, web: the github.io address. The order is the
   tie-break, simplest first, so serve.py with a folder of its own comes
   before serve.py with a folder picked in the browser: it does all that does. */
const RUN_NEEDS = [
  ["cal", "Calendar links (Outlook, Google, iCloud)", "Calendars"],
  ["noask", "No folder question at each start", "No asking"],
  ["phone", "Use it on a phone too", "Phone"],
  ["any", "Use Firefox, Safari or any browser", "Any browser"],
  ["updates", "New versions come by themselves", "Updates"],
];
const RUN_LIMITS = [
  ["nopy", "I cannot install Python"],
  ["norun", "I cannot leave a program running"],
  ["noweb", "github.io is blocked where I am"],
];
const RUN_WAYS = {
  pages: {title: "The web address", web: true, can: ["noask", "phone", "updates"],
    start: "Open kennethaar.github.io/GroupTodo in Chrome or Edge, and pick your folder.",
    good: "Nothing to install. A reload is the update.",
    bad: "No calendar links. Firefox and Safari keep the list in the browser."},
  file: {title: "The downloaded file", can: [],
    start: "Save grouptodo.html, open it in Chrome or Edge, and pick your folder.",
    good: "No install and no internet needed.",
    bad: "It asks for the folder at each start. No calendar links. A new version is a new download."},
  vault: {title: "serve.py with your folder", py: true, run: true, can: ["cal", "noask", "phone", "any"],
    start: "In the GroupToDo folder, run python serve.py --vault and the path to your folder. Open localhost:8777.",
    good: "No folder to pick. Calendar links. Any browser. A phone reaches it through Tailscale.",
    bad: "Python must run while you work. A new version is a new download."},
  serve: {title: "serve.py, folder picked in the browser", py: true, run: true, can: ["cal", "noask"],
    start: "In the GroupToDo folder, run python serve.py. Open localhost:8777 and pick your folder.",
    good: "Calendar links. No path to type.",
    bad: "Python must run while you work. Chrome or Edge only."},
};
