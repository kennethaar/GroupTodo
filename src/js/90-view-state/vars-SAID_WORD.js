/* ---------- script mode (#248) ----------
   Talk written fast, as a play: one row per line, the speaker in front.
   Enter starts the next row with the next speaker; Tab changes who speaks a
   row; Ctrl+Enter puts it all in the chapter as prose, set in the book's
   style, with "said Anna" only where a reader could not tell who speaks: on
   the first two lines, and after that whenever the talk does not simply go
   back and forth. said:: on the book's page is the word for it. */
const SAID_WORD = {english: "said", british: "said", german: "sagte", guillemets: "sa", dash: "sa"};
const saidWord = (style = dialogueStyle()) => oneLine(bookProps().said) || SAID_WORD[style] || "said";
// What the text calls a character: the short name, Anna for Anna Berg.
const shortName = e => { const n = castNamesOf(e.name, [], e.type); return n[n.length - 1]; };
