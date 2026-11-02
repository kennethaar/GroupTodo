/* Shown on a wide screen only; on a phone it lives behind the ⋯ in the heading. */
const wideOnly = (node, hide = true) => { if (node && hide) node.classList.add("wideonly"); return node; };
/* Said in words: an icon on its own makes you tap to find out what it is. */
const todayIcon = (word, label, onclick, on) => el("button", {class: "btn ghost todayicon" + (on ? " on" : ""),
  title: label, "aria-pressed": on == null ? null : String(!!on), onclick}, word);
let JOURNAL_MORE_OPEN = false;
