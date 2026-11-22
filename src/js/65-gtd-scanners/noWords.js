/* #472 a line with no words, only spaces or one letter is not an action or a
   thought yet: Weekly review and Next leave it out, quietly. It stays on its
   page. Only letters count, so a lone digit or emoji still shows. */
function noWords(b) {
  const t = trim(plainTitle(b.title || ""));
  return !t || /^\p{L}$/u.test(t);
}
