const SUGGEST_MODE_KEEP_TIGHT = after => /^[.,;:!?)]/.test(after);

/* Which key takes a suggestion or runs a command: "enter", "tab" or "both".
   Settings > Writing, this device. Every list follows it, a name offered
   while typing too (#262). */
const SUGGEST_KEYS = {
  enter: {label: "Enter", blurb: "Enter takes it. Tab indents. Esc closes the list."},
  tab:   {label: "Tab", blurb: "Tab takes it. Enter ends the line."},
  both:  {label: "Tab or Enter", blurb: "Either key takes it. Esc closes the list."},
};
const suggestKeys = () => { const k = PREF.get("suggest.accept", "enter"); return SUGGEST_KEYS[k] ? k : "enter"; };
const suggestTakes = (key, mode) => key === "Tab" ? suggestKeys() !== "enter" : suggestKeys() !== "tab";
