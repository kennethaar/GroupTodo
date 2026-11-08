/* ---------- word lists: the words a kind of line is written in ----------
   A list marked kind:: words is not steps but a vocabulary, as an outline:
   a broad word, and under it the more precise ones. lines:: says which line
   start it belongs to, and on those lines alone the suggestion box offers its
   words, then the ring under the word you took (#214):

       kind:: words
       lines:: =
       - Angry
         - Let down
           - Betrayed

   Feelings is built in, for = lines: the Feelings Wheel by Geoffrey Roberts
   (feelingswheel.app), core feeling > second ring: outer ring. Every word is
   there once, so a word has one path. Edit words writes it to 8/Feelings,
   which then is the list. */
const FEELINGS_WHEEL = [
  ["Fearful", [["Scared", ["Helpless", "Frightened"]], ["Anxious", ["Concerned", "Worried"]],
    ["Insecure", ["Inadequate", "Inferior"]], ["Weak", ["Worthless", "Insignificant"]],
    ["Rejected", ["Excluded", "Persecuted"]], ["Threatened", ["Nervous", "Exposed"]]]],
  ["Angry", [["Let down", ["Betrayed", "Resentful"]], ["Humiliated", ["Disrespected", "Ridiculed"]],
    ["Bitter", ["Indignant", "Violated"]], ["Mad", ["Furious", "Jealous"]],
    ["Aggressive", ["Provoked", "Hostile"]], ["Frustrated", ["Infuriated", "Annoyed"]],
    ["Distant", ["Withdrawn", "Numb"]], ["Critical", ["Sceptical", "Dismissive"]]]],
  ["Disgusted", [["Disapproving", ["Judgmental", "Condemned"]], ["Uncomfortable", ["Appalled", "Revolted"]],
    ["Awful", ["Nauseated", "Detestable"]], ["Repelled", ["Horrified", "Hesitant"]]]],
  ["Sad", [["Hurt", ["Embarrassed", "Disappointed"]], ["Depressed", ["Unseen", "Empty"]],
    ["Guilty", ["Remorseful", "Ashamed"]], ["Despair", ["Grief", "Powerless"]],
    ["Vulnerable", ["Victimised", "Fragile"]], ["Lonely", ["Isolated", "Abandoned"]]]],
  ["Happy", [["Optimistic", ["Inspired", "Hopeful"]], ["Trusting", ["Intimate", "Sensitive"]],
    ["Peaceful", ["Thankful", "Loving"]], ["Powerful", ["Creative", "Courageous"]],
    ["Accepted", ["Valued", "Respected"]], ["Proud", ["Confident", "Successful"]],
    ["Interested", ["Inquisitive", "Curious"]], ["Content", ["Joyful", "Free"]],
    ["Playful", ["Cheeky", "Aroused"]]]],
  ["Surprised", [["Excited", ["Energetic", "Eager"]], ["Amazed", ["Awe", "Astonished"]],
    ["Confused", ["Perplexed", "Disillusioned"]], ["Startled", ["Dismayed", "Shocked"]]]],
  ["Bad", [["Tired", ["Unfocused", "Sleepy"]], ["Stressed", ["Out of control", "Overwhelmed"]],
    ["Busy", ["Rushed", "Pressured"]], ["Bored", ["Apathetic", "Indifferent"]]]],
];
const FEELINGS_PATH = join(DIRS.lists, "Feelings.md");
const isWordList = path => pageKind(path) === "checklist" && trim(getPage(path)?.props?.kind || "").toLowerCase() === "words";
/* The built-in wheel as a tree, in the language the app is shown in, so the
   word in the box is the word written on the line. */
const builtinFeelings = () => {
  const say = w => trim((LANG.dict && langLookup(w)) || w);
  const grow = ([w, kids]) => ({name: say(w), kids: (kids || []).map(k => grow(Array.isArray(k) ? k : [k]))});
  return FEELINGS_WHEEL.map(grow);
};
const wordTreeOf = path => {
  const grow = bs => (bs || []).filter(b => trim(b.title)).map(b => ({name: trim(b.title), kids: grow(b.children)}));
  return grow(getPage(path)?.blocks);
};
const wordListMarks = () => {
  const marks = new Set(["="]);
  for (const p of allPages(isWordList)) { const m = trim(getPage(p).props.lines || ""); if (m) marks.add(m); }
  return marks;
};
