function statusFact(path, code) {
  return {
    key: "status", raw: "status:: " + STATUS_LABEL[code].toLowerCase(),
    save: v => {
      const m = /::\s*([\s\S]*)$/.exec(v);
      const want = statusCodeFromValue(m ? m[1] : v);
      if (!want) { notify("Status is one of: " + STATUS_ORDER.map(c => STATUS_LABEL[c]).join(", "), "warn"); return; }
      if (want !== code) setProjectStatus(path, want);
    },
    /* A click on the status lays the other statuses out beside it, one click
       from moving the project there, with the way to that shelf's list at the
       end. Clicking the status again folds them away. */
    pills: () => {
      const cls = c => "fst s" + (c === "-" ? "x" : c);
      const open = STATUS_PILLS_OPEN === path;
      const toggle = () => { STATUS_PILLS_OPEN = open ? null : path; render(); };
      const own = factPill(STATUS_LABEL[code], cls(code), open ? "Fold the other statuses away" : "Change the status, or see the shelf", toggle);
      /* On hold is not a shelf of its own: the project keeps its status and
         is out of sight until a day, still a commitment, unlike someday. */
      const held = projectHold(path);
      const hold = held
        ? factPill(holdWords(held), "fst s2", "Change the day, or bring it back now", () => openProjectHold(path))
        : null;
      if (!open) return [own, hold].filter(Boolean);
      return [own, hold,
        ...["1", "3", "2", "0", "-"].filter(c => c !== code && STATUS_DIRS[c]).map(c => factPill("→ " + STATUS_LABEL[c], cls(c) + " fmove",
          "Move it to " + STATUS_LABEL[c], () => { STATUS_PILLS_OPEN = null; setProjectStatus(path, c); })),
        held ? null : factPill("→ On hold…", "fst s2 fmove", "Out of sight until a day, still committed to",
          () => { STATUS_PILLS_OPEN = null; openProjectHold(path); }),
        factPill("Go to " + STATUS_LABEL[code] + " ›", "fquiet", "Everything on the " + STATUS_LABEL[code] + " shelf",
          () => { STATUS_PILLS_OPEN = null; go("projects", {statusCode: code}); })].filter(Boolean);
    },
  };
}
