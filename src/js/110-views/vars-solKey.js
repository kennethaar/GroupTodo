/* A card is a project, or -- in the actions deck -- one line on a page. A
   line has no id that outlives a reload, so it is known by its words; the
   answers are moved along when the words change (see actRekey). */
const solKey = r => r.block ? "@" + (r.space || "") + "|" + r.path + "|" + plainTitle(r.block.title)
  : (r.space || "") + "|" + r.path;
const actDeckOn = () => SOL.deck === "a";
// The answers of the deck on the table, not the other one's.
const solDeckAns = () => [...SOL_ANS].filter(([k]) => (k[0] === "@") === actDeckOn()).map(([, a]) => a);
