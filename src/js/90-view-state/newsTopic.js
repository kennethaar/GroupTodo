/* The help topic a new thing is about, found by its name. Nothing when the
   name is no clear match: a wrong door is worse than none. So every word must
   be in the topic, and one in its title or everyday words. */
function newsTopic(item) {
  if (!item.head) return null;
  const words = item.head.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(w => w.length > 2);
  if (!words.length) return null;
  return helpSearch(words.join(" ")).find(id => {
    const t = HELP[id], title = t.title.toLowerCase();
    return words.some(w => title.includes(w) || (t.words || []).includes(w));
  }) || null;
}
