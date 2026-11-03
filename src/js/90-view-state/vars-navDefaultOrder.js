/* The built-in order: ids, with --- where NAV_ITEMS has a line or the gap. */
const navDefaultOrder = () => NAV_ITEMS.filter(it => it !== "pins")
  .map(it => it === "sep" || it === "grow" ? NAV_SEP : it.id);
