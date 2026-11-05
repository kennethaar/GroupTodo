// Which cell of a row the caret at offset `at` is in, counting from 0.
function tableCol(text, at) {
  const pipes = [];
  for (let k = 0; k < text.length; k++) if (text[k] === "|" && text[k - 1] !== "\\") pipes.push(k);
  let j = 0;
  while (j + 1 < pipes.length && pipes[j + 1] < at) j++;
  return Math.min(j, Math.max(pipes.length - 2, 0));
}
