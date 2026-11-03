/* Names in order, the first to do and the last done, as a type reads lines without brackets. */
const byPlace = names => names.map((name, i) => ({name, core: i === 0 ? "TODO" : i === names.length - 1 ? "DONE" : "DOING"}));
