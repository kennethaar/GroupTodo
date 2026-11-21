// A table that Present reveals column by column (#469); rows are the default.
function slideTableCols(t) {
  return /^columns?$/i.test(trim(blockProp(t, "reveal") || ""));
}
