/* ---------- beats and prose (#244) ----------
   %% in front of a line makes it a beat: a note on what happens, the outline
   the prose is written under. It is not counted or exported, and Prose mode
   can hide it. Obsidian reads %% as a comment too. */
const BEAT_RE = /^%%[ \t]*/;
const isBeat = (title, isTask) => !isTask && /^%%/.test(title || "");
const isChapterPage = path => hasBook() && !!bookOfChapter(path);
/* Words written today in a book: the total now, less the total the first
   time the book was looked at today. Kept per device. */
const bookTotal = (book = bookPath()) => chaptersOf(book).reduce((n, c) => n + (c.path ? chapterWords(c.path) : 0), 0);
