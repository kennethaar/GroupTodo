function askNoteBody(them, me, items, file, k) {
  const t = ASK_NOTE[askLang()];
  const own = askOwn() ? askOwnParts() : {},
    fill = (s, n) => s.replace(/%name%/gi, them).replace(/%file%/gi, file || "").replace(/%me%/gi, me)
      .replace(/%count%/gi, String(n)).replace(/%questions%/gi, askQWords(t, k.q))
      .replace(/\{([^{}|]*)\|([^{}]*)\}/g, (_, one, more) => (n === 1 ? one : more)),
    part = (key, built, n = k.q) => own[key] != null ? fill(own[key], n) : built;
  const which = !k.q ? "w" : !k.w ? "q" : "both";
  /* No file is a plain email: the standard words for that, and your own only
     when they do not point at an attachment that is not there. */
  if (!file && /%file%/i.test(own[which] || "")) delete own[which];
  const intro = part(which, file ? t.intro(k, file, askQWords(t, k.q)) : t.mail(k, askQWords(t, k.q)),
    which === "w" ? k.w : k.q);
  return [
    part("greet", t.greet(them)),
    "",
    // A mail of only questions is answered under each one; there is nothing to add to.
    ...[intro, k.w ? part("add", t.add) : ""].filter(l => trim(l)),
    "",
    items,
    "",
    ...(own.bye != null ? [fill(own.bye, k.q)] : [t.bye, me]),
  ].join("\n");
}
