/* One field for how long: type 5m, 90m, 1h30m, or take 15m, 30m, 45m, 1h. */
const choreSizePick = () => {
  const list = el("datalist", {id: "chore-size-list"}, ...["15m", "30m", "45m", "1h"].map(v => el("option", {value: v})));
  const input = el("input", {placeholder: "20m", "aria-label": "Duration", list: "chore-size-list", autocomplete: "off"});
  const box = el("span", {}, input, list);
  Object.defineProperty(box, "value", {get: () => { const v = trim(input.value).toLowerCase(); return estParse(v) ? v : ""; },
    set: v => { input.value = Number(v) ? EST_TAGS[Number(v)] : (v && v !== "0" ? v : ""); }});
  return box;
};
