/* One style per chart: the first its trackers name. Stacked needs more than
   one tracker, so on its own it is a bar. */
const TRACKER_STYLES = {"stacked-bar": "Stacked bar", bar: "Bar", line: "Line"};
const trackerStyleChoices = shared => shared ? ["stacked-bar", "bar", "line"] : ["line", "bar"];
const trackerStyleWord = (s, shared) => shared && s === "bar" ? "Side-by-side bar" : TRACKER_STYLES[s];
