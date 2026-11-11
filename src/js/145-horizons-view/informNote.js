function informNote(them, me, items, file, named) {
  const t = informWords(), own = askOwn() ? informOwnParts() : {};
  const first = firstNameOf(them);
  const fill = s => s.replace(/%name%/gi, first).replace(/%me%/gi, me).replace(/%file%/gi, file || "")
    .replace(/%count%/gi, String(items.length));
  const part = (key, built) => own[key] != null ? fill(own[key]) : built;
  return {
    subject: t.subject((items[0] && items[0].t) || "", items.length),
    body: [
      part("greet", t.greet(first)),
      "",
      part("intro", t.intro(items.length)),
      ...(file ? [part("sheet", t.sheet(file))] : []),
      "",
      informItemsText(items, named),
      // Your mail signs it (#353); only an ending you wrote yourself goes in.
      ...(own.bye ? ["", fill(own.bye)] : []),
    ].join("\n"),
  };
}
