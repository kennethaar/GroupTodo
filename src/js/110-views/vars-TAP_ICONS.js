/* ---------- TAP TO COUNT ----------
   Cups of coffee, glasses of water, breaks: counted one at a time, as they
   happen, often on a phone. A tap on +1 adds an icon to the line, so the day
   reads ☕☕☕ and counts 3:

     tracker-coffee_i:: ☕☕☕

   A number typed by hand (tracker-coffee_i:: 3) counts the same and is drawn
   as icons; so is ☕ × 14. A tap on an icon takes one off, ↺ goes back to 0
   with an undo. The icon is the line's own; on a day with none yet, the one
   picked in the wizard (tracker_icon_coffee:: in Settings), else the latest
   day's. More than ten draw as ☕ × 14, so the line does not wrap. */
const TAP_ICONS = ["\u2615", "\u{1F4A7}", "\u{1F37A}", "\u{1F6AC}", "\u{1F34E}", "\u{1F48A}", "\u{1F3C3}", "\u2705"];
const TAP_TIMES_RE = /^(\S+?)\s*[\u00d7xX*]\s*(\d+)$/u;
const graphemes = s => {
  try { return [...new Intl.Segmenter(undefined, {granularity: "grapheme"}).segment(s)].map(x => x.segment); }
  catch (_) { return [...s]; }
};
const tapIcons = raw => graphemes(String(raw || "").replace(TAP_TIMES_RE, "$1").replace(/[\s,;\u00b7]+/g, ""))
  .filter(g => !/^[\d\u00d7xX*]$/.test(g));
