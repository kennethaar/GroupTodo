// The one of two copies (table or side column) that is on screen.
const solShown = sel => [...document.querySelectorAll(sel)].find(e => e.offsetParent) || null;
