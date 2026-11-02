/* ---------- the space tabs ----------
   A space is a separate vault: its own folder, its own permissions, its own
   people. Which of them are on screen was only ever a dialog away, which is
   fine for a thing you set once but wrong for a board, where "show me only
   work" is a glance. The tabs are that choice, and they are the same choice
   the space switcher makes -- there is no second idea of what is on screen.

   They are also where a project goes to change vault: drop a card on a tab and
   the file is written into that space and removed from this one. That is a real
   move between folders, not a label, so it is said plainly and ctrl-z takes it
   back. */

/* Everything dropped on a tab goes through the same transfer as Alt-S: one
   question about what comes along, and one undo for all of it. */
function dropPagesOnSpace(list, target, opts = {}) {
  return transferLinkedPages(list, target, opts);
}
