/* The name asked on both paths. A name is what makes the list legible to
   anybody it is shared with. Nothing else to register: no account, no email,
   no password, because there is nowhere to send them. */
function onboardNameField() {
  const input = el("input", {placeholder: "Kenneth Aar", value: whoAmI(), maxlength: "60"});
  const keep = () => setIdentity(input.value);          // blank is a real answer
  /* Typed, then dismissed with the X or a click outside, is still typed: this
     screen comes back next time, and it should come back already knowing. */
  input.addEventListener("change", keep);
  const field = el("div", {class: "field"},
    el("label", {}, "Who are you"),
    input,
    el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px;line-height:1.5"},
      "Full name. Two people called Kenneth is the day you wish you had typed the surname."));
  return {input, keep, field};
}
