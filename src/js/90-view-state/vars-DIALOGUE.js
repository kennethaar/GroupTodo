document.addEventListener("keydown", e => {
  if (e.key !== "Escape" || !document.body.classList.contains("bookfocus")) return;
  // Esc in a line only leaves the line. The line blurs itself first, so ask where the key was pressed.
  if (e.target && e.target.isContentEditable) return;
  setWritingFocus(false);
});
/* ---------- how dialogue is written (#245) ----------
   dialogue:: on the book's page picks the marks the book's speech is set in, and
   with one picked the chapters set their own type as you write: a straight
   " becomes the opening or closing mark, ' an apostrophe or a single quote,
   -- a dash and ... an ellipsis. dash is the Nordic and French way: a line of
   speech starts with a dash, "- " at its start becomes "– ". Without
   dialogue:: nothing is changed. Tidy does the same to what is written. */
const DIALOGUE = {
  english:    {label: "“English”",    open: "“", close: "”", open1: "‘", close1: "’", dash: "—"},
  british:    {label: "‘British’",    open: "‘", close: "’", open1: "“", close1: "”", dash: "–"},
  guillemets: {label: "«Guillemets»", open: "«", close: "»", open1: "‘", close1: "’", dash: "–"},
  german:     {label: "„German“",     open: "„", close: "“", open1: "‚", close1: "‘", dash: "–"},
  dash:       {label: "– Dash",       open: "«", close: "»", open1: "‘", close1: "’", dash: "–", line: true},
};
const dialogueStyle = (book = bookPath()) => DIALOGUE[trim(String(bookProps(book).dialogue || "")).toLowerCase()] ? trim(bookProps(book).dialogue).toLowerCase() : null;
