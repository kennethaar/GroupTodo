/* ---------- a book, as a page (#240) ----------
   A book's page in 8/ makes the area a place to write a book in: one line per
   chapter, top to bottom, each a [[page]] (or just its name); target:: the
   words aimed at; stages:: the steps a chapter goes through, a task type like
   [[8/Chapter]] or names with commas between. Each chapter page says where it
   is with stage:: Draft. Without the page there is no Book view and nothing
   else changes. What the page leaves out is the built-in: no stages:: (or one
   with fewer than two) is BOOK_STAGES, a stage:: nobody listed is the first,
   no target:: is no goal. Task lines in a chapter are work on it, not the
   text, so they are neither counted nor exported. title:: is the book's name
   (title:: book is none yet), subtitle:: and synopsis:: say what it is, and a
   chapter page may say synopsis:: too.
   An area is the book's world, and may hold more than one book (#255): each
   is a page in 8/book/, with chapters and settings of its own, and they all
   share the area's characters, places and things. 8/book.md, the first way,
   is a book too. order:: 2 puts a book second in the series; a book without
   it comes before those with, and those go in the order they were made. One
   of them is the book shown. */
const BOOK_PATH = join(DIRS.lists, "book.md");
const BOOK_DIR = join(DIRS.lists, "book");
const BOOK_STAGES = ["Outline", "Draft", "Revise", "Done"];
const BOOK_GOALS = [50000, 80000, 100000, 120000];
const fmtWords = n => Math.round(n).toLocaleString();
const isBookPath = path => path === BOOK_PATH ||
  (String(path || "").startsWith(BOOK_DIR + "/") && /\.md$/i.test(path) && !path.slice(BOOK_DIR.length + 1).includes("/"));
/* The area's books, in series order. */
const bookPaths = () => memo("bookPaths\u0000" + V.space, () => allPages(isBookPath).filter(p => getPage(p)).sort((a, b) => {
  const pa = getPage(a).props || {}, pb = getPage(b).props || {}, oa = parseFloat(pa.order), ob = parseFloat(pb.order);
  return (isNaN(oa) ? 0 : oa) - (isNaN(ob) ? 0 : ob) || String(pa.created || "").localeCompare(String(pb.created || "")) || a.localeCompare(b);
}));
const hasBook = () => bookPaths().length > 0;
const curBookKey = () => "book.cur." + (V.space || "");
