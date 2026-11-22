/* Widgets (#474): one file per context in the vault's Widgets/ folder, for a
   home-screen widget app (such as Obsidian Widget) to show and tick. Written
   by GroupToDo itself, with nothing to set up, and never read as pages. */
const WIDGET_DIR = "Widgets";
const WIDGET_IDS = WIDGET_DIR + "/.ids.json";   // which widget line is which page line
const WIDGET_MAX = 20;
const isWidgetPath = p => String(p || "").startsWith(WIDGET_DIR + "/");
const WIDGET_SEEN = new WeakMap();   // backend -> Map(file -> its text as last read or written)
let WIDGET_TIMER = 0, WIDGET_READ = false;
