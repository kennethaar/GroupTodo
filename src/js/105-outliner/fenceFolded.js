/* A note box folded to one line (#392) says so on its opening fence:
   ```folded, or ```js folded. Other apps read it as a plain fence. */
const fenceFolded = l => /^\s*```.*\bfolded\b/.test(l || "");
const fenceFold = (l, on) => {
  const bare = l.replace(/\s*\bfolded\b/, "");
  return on ? bare + (/```$/.test(bare) ? "" : " ") + "folded" : bare;
};
