/* The first time a new thing is used (#516 follow-up): a toast says it is
   new, and See how it works plays its What's new animation. Once only, and
   easy to pass by: it goes by itself, or with ✕. Nothing when the thing has
   no animation (any more). */
function newsFirstUse(key, text) {
  const pref = "news.firstuse:" + key;
  if (!NEWS_ANIM[key] || PREF.get(pref, "")) return;
  PREF.set(pref, "1");
  notify(text, "info", {label: "See how it works", run: () => newsShowOne(key)});
}
