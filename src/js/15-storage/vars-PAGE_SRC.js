/* The file text each page in memory was read from, or last written as. A
   read that finds the same text keeps the page it has: a line on screen is
   bound to its page, and a line typed while the area was still loading went
   into a page the read had swapped for a fresh copy of the file, so it was
   lost when you left the line (#232). */
const PAGE_SRC = new WeakMap();
