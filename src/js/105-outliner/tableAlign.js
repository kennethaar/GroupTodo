// How a column lines up, from its cell in the | --- | line: --- and :--- are left.
function tableAlign(c = "") {
  return /^:-+:$/.test(c) ? "center" : /-:$/.test(c) ? "right" : "left";
}
