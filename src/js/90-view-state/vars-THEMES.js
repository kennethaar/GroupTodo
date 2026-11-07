/* ---------- styles ----------
   Two light looks and two dark, a font and a text size. All of it is this
   device's choice, like the theme button, and all of it sits under any .css
   in pages/8/, which is laid on top last and still wins (applyVaultCss). */
const THEMES = [
  {id: "paper", side: "light", name: "Paper", about: "Grey-white and blue. The default.",
   sw: ["#f6f6f3", "#ffffff", "#1d1d1b", "#2a64cc"]},
  {id: "linen", side: "light", name: "Linen", about: "Warm cream and terracotta, easy on the eyes.",
   sw: ["#f4efe6", "#fbf8f2", "#2b2620", "#a34e24"]},
  {id: "ink",   side: "dark",  name: "Ink",   about: "Soft charcoal. The default dark.",
   sw: ["#161615", "#1f1f1d", "#ecebe6", "#6c9cf0"]},
  {id: "night", side: "dark",  name: "Night", about: "Deep blue for late hours.",
   sw: ["#0f1420", "#161c2b", "#e3e8f2", "#7aa2ff"]},
];
const themeOf = side => PREF.get("theme." + side, side === "dark" ? "ink" : "paper");
const FONTS = [
  {id: "system",   name: "System",    css: null},
  {id: "humanist", name: "Humanist",  css: '"Segoe UI Variable Text","Segoe UI",Seravek,"Gill Sans Nova",Ubuntu,Calibri,sans-serif'},
  {id: "serif",    name: "Serif",     css: 'Charter,"Bitstream Charter","Sitka Text",Cambria,Georgia,serif'},
  {id: "mono",     name: "Monospace", css: "var(--mono)"},
];
const FONT_SIZES = [13, 14, 15, 16, 17, 18];
const WIDTHS = [["narrow", "Narrow"], ["wide", "Wide (default)"], ["full", "Full"]];
const styleCssPath = () => join(DIRS.lists, "style.css");
