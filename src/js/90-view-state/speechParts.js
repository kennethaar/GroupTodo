/* What is said in a paragraph, and the words round it. In the quote styles,
   what is between a pair of double marks. With Dash, a paragraph that starts
   with a dash is speech, all but its tag: what follows a comma or a ! or ?
   in small letters, up to the next dash, if it names somebody --
   "– Kom, sa Mira. – Nå." is Mira's "Kom, Nå." */
function speechParts(text, style) {
  const t = String(text || "");
  if (/^[–—-]\s/.test(t) && (style === "dash" || !style)) {
    const body = t.replace(/^[–—-]\s+/, ""), m = /[,!?…]\s+(\p{Ll}[^–—]*)/u.exec(body);
    if (m && castMentions(m[1]).length)
      return {said: [trim(body.slice(0, m.index + 1) + " " + body.slice(m.index + m[0].length).replace(/^[–—]\s*/, ""))], rest: m[1]};
    return {said: [body], rest: ""};
  }
  const st = DIALOGUE[style];
  const re = st && !st.line ? new RegExp(planReEsc(st.open) + "([^" + planReEsc(st.close) + "]*)" + planReEsc(st.close), "g")
    : /["“«„]([^"”»“]*)["”»“]/g;
  const said = [];
  const rest = t.replace(re, (all, words) => { said.push(words); return " "; });
  return {said, rest};
}
