/* Typing goes to the answer whose name starts with it, the way the typeahead
   pickers do: the first one starting with what was typed, the same letter
   again steps on to the next, and a pause starts afresh. A name that has no
   answer starting with it tries the start of any word ("e" finds "Linus
   Eberhart"). It only aims; Enter takes it. */
let SOL_TA = {s: "", at: 0};
const SOL_TA_MS = 900;
const solActName = a => trim(a.label).replace(/^[^\p{L}\p{N}]+/u, "").toLocaleLowerCase();
