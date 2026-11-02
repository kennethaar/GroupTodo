/* ============================================================
   80_NUDGE_ENGINE
   Every GTD nudge the Neovim config fired, as a always-visible strip.
   ============================================================ */
/* GTD's own vocabulary is the steepest thing here. In simple mode the nudges
   say what they mean, and the method-purist ones stay quiet until there is
   enough on the list for them to be about something. */
/* One rule, used by the nudge bar, the row chips and the context prompt: a
   newcomer with a handful of tasks is not told off about method. */
/* Several of the whole-vault questions -- what is open, who is here, where the
   conversations are -- get asked many times in one render: navVisible alone
   asks three of them per item. Each is cheap on a small vault and 20ms on a
   big one, which is how a sidebar ends up costing 150ms to draw. They are
   answered once per render instead, and the memo is dropped whenever anything
   is touched so nothing can read a stale answer. */
const MEMO = new Map();
const memo = (key, fn) => {
  if (!MEMO.has(key)) MEMO.set(key, fn());
  return MEMO.get(key);
};
const clearMemo = () => MEMO.clear();

let QUIET_CACHE = null;
