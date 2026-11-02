function expireHere(today) {
  const out = [];
  for (const a of leafActionsHere()) {
    const b = a.block;
    const until = dateIn(blockProp(b, "until"));
    let why = null;
    if (/^never$/i.test(trim(blockProp(b, "expire") || ""))) continue;
    if (until && until < today) why = "until";
    else if (birthdayTasksExpire()) {
      const bday = birthdayTaskDay(b);
      // A card dated after the day ("belated") is aimed past it on purpose.
      const due = dueDate(b);
      if (bday && bday < today && !(due && due > bday)) why = "birthday";
    }
    if (!why) continue;
    const before = {state: b.state, props: Object.assign({}, b.props)};
    b.state = "CANCELLED";
    setBlockProp(b, "expired", "[[" + today + "]]");
    const me = stampName();
    if (me) setBlockProp(b, "done_by", me + " " + nowStamp());
    touch(a.path);
    out.push({path: a.path, block: b, before, why});
  }
  return out;
}
