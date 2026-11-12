/* Text that holds its shape by its spaces (#374): aligned columns, indented
   lines, box drawing. Plain sentences pasted as several lines are not. */
function looksPreformatted(lines) {
  return lines.some(l => /^\s+\S|\S {3,}\S|\t|[+|][-=]{3,}|[─│┌┐└┘├┤═║╔╗╚╝]/.test(l));
}
