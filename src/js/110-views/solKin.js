/* For "comes after": projects that share this one's responsibility, an
   organisation or a person are the ones most likely to come first. */
function solKin(r) {
  const area = inS(r, () => areaOfProject(r.path)), orgs = projectOrgs(r), ppl = projectPeople(r);
  const m = new Map();
  for (const p of solLive(r)) {
    let s = 0;
    if (area && inS(r, () => areaOfProject(p.path)) === area) s += 3;
    s += projectOrgs(p).filter(o => orgs.includes(o)).length * 2;
    s += projectPeople(p).filter(n => ppl.includes(n)).length;
    if (inS(r, () => statusDirOf(p.path)) === "1") s += 0.5;
    if (s) m.set(p.path, s);
  }
  return m;
}
