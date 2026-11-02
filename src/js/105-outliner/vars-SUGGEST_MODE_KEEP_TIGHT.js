const SUGGEST_MODE_KEEP_TIGHT = after => /^[.,;:!?)]/.test(after);

/* Which key takes a suggestion or runs a command: "enter", "tab" or "both".
   Settings > Writing, this device. Every list follows it, except a word
   completion: that is offered, not asked for, so it only ever takes Tab and
   Enter after a word is still the end of the line. */
const SUGGEST_KEYS = {
  enter: {label: "Enter", blurb: "Enter takes it. Tab indents. Shift+Enter ends the line instead."},
  tab:   {label: "Tab", blurb: "Tab takes it. Enter ends the line."},
  both:  {label: "Tab or Enter", blurb: "Either key takes it. Shift+Enter ends the line instead."},
};
const suggestKeys = () => { const k = PREF.get("suggest.accept", "enter"); return SUGGEST_KEYS[k] ? k : "enter"; };
const suggestTakes = (key, mode) => mode === "word" ? key === "Tab"
  : key === "Tab" ? suggestKeys() !== "enter" : suggestKeys() !== "tab";
