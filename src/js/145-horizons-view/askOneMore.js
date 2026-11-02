/* The words for one and for more as one line with {one|more} in it, and
   %count% for the number: "I have {a quick question|%count% quick questions}
   for you." Whole words go in the braces. */
function askOneMore(f) {
  const one = f(1), more = f(2).replace(/(^|\D)2(?!\d)/g, "$1%count%");
  if (one === more) return one;
  const word = c => /[\p{L}\p{N}%]/u.test(c || "");
  let i = 0, j = 0;
  while (i < one.length && one[i] === more[i]) i++;
  while (j < one.length - i && j < more.length - i && one[one.length - 1 - j] === more[more.length - 1 - j]) j++;
  while (i > 0 && word(one[i - 1])) i--;
  while (j > 0 && word(one[one.length - j])) j--;
  return one.slice(0, i) + "{" + one.slice(i, one.length - j) + "|" + more.slice(i, more.length - j) + "}" + one.slice(one.length - j);
}
