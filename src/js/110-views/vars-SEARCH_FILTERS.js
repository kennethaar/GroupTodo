/* ---------- search ----------
   Two things were wrong with searching as you typed. It answered questions
   nobody had asked yet -- three letters in, the screen was full of matches for
   a word half typed -- and on a big vault every keystroke walked every block in
   every space, so the box itself went sticky. So the box is a box now: you type
   the whole thing and press Enter, and that is the search.

   And a search is almost never for "anything". Somebody on Todos is looking
   for a task; somebody on the project board is looking for a project. That is
   knowledge the app has the moment the search opens, so the filter arrives
   already set to it -- and it is three buttons, so being wrong about it costs
   one click. */
const SEARCH_FILTERS = [["all", "Everything"], ["projects", "Projects"], ["todos", "Todos"]];
