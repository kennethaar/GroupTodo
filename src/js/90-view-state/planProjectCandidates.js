/* At most five projects the text may be about. A long word in common counts
   two, a short one one, and a person or organisation of the project named in
   the text one; it takes two to be named at all, so somebody who is on half
   the projects does not bring all of them along. Also says how many were
   looked at, open and older, so a change of window shows. */
function planProjectCandidates(text, back = "90") {
  const words = planWords(text), lower = String(text || "").toLocaleLowerCase();
  const mine = planWords(whoAmI());
  const since = back === "all" ? "" : shiftISO(todayISO(), -(+back || 0)), out = [];
  let open = 0, old = 0;
  for (const code of ["1", "3", "2", "0"]) for (const p of projectsIn(code)) {
    const props = getPage(p)?.props || {};
    if (code === "0" || code === "2") {
      if (back === "0") continue;
      if (since && !(planProjectDay(p, code) >= since)) continue;
      old++;
    } else open++;
    let score = 0;
    for (const w of planWords(pageTitle(p))) if (words.has(w) && !mine.has(w)) score += w.length >= 6 ? 2 : 1;
    for (const l of linksIn(String(props.with || "") + " " + String(props.org || ""))) {
      const n = trim(l.split("][")[0]).replace(/^[po]\//, "");
      if (n.length > 2 && !samePerson(n, whoAmI()) && lower.includes(n.toLocaleLowerCase())) score += 1;
    }
    if (score >= 2) out.push({path: p, title: pageTitle(p), score});
  }
  return {list: out.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, 5), open, old};
}
