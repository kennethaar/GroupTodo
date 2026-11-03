/* ---------- kill your darlings (#252) ----------
   What is cut from the book is kept, not lost: it goes to 8/darlings.md as a
   line saying where it came from (from::) and when (cut::), and Put back
   returns it. A paragraph goes with what is under it and comes back after
   the line it followed (after::) or under the one it was under (under::); a
   scene goes with its lines; a sentence comes back at the end of the line it
   was cut from (in::). A chapter leaves the book and is listed as a link, its
   page left as it is. Darlings are not words of the book. */
const DARLINGS_PATH = join(DIRS.lists, "darlings.md");
const darlings = () => getPage(DARLINGS_PATH)?.blocks || [];
const darlingWords = () => darlings().reduce((n, b) => n + (blockProp(b, "chapter") ? 0 : proseOf([b]).reduce((m, t) => m + countWords(t), 0)), 0);
