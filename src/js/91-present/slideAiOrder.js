/* The pictures in the order the prompt lists them (#483): shuffled anew each
   time, so the same text gets other pictures, and those already used on
   other pages last. The AI takes the first good match. */
function slideAiOrder(names, used = new Set()) {
  const list = names.slice();
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return [...list.filter(n => !used.has(n)), ...list.filter(n => used.has(n))];
}
