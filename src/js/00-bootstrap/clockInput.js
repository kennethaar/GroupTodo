/* Every time field in the app, instead of the browser's own: that one has an
   AM/PM part in some locales and a wheel on phones, and reads 0843 nowhere.
   What was typed becomes HH:MM on leaving the field or on Enter, before the
   dialog's own change handlers see it, so their split(":") keeps working. */
function clockInput(value, attrs = {}) {
  const ons = {}, rest = {};
  for (const [k, v] of Object.entries(attrs)) (k.startsWith("on") ? ons : rest)[k] = v;
  const n = el("input", Object.assign({type: "text", inputmode: "numeric", placeholder: "08:43",
    autocomplete: "off", spellcheck: "false"}, rest, {class: "clk" + (rest.class ? " " + rest.class : "")}));
  n.value = readClock(value) || trim(value || "");
  let said = "";
  const tidy = () => {
    const v = trim(n.value), c = readClock(v);
    if (c && c !== n.value) n.value = c;
    const bad = !!v && !c;
    n.classList.toggle("bad", bad);
    if (bad) n.setAttribute("aria-invalid", "true"); else n.removeAttribute("aria-invalid");
    if (bad && said !== v) notify("That is not a time I can read. Try 08:43, 0843 or 14.", "warn");
    said = bad ? v : "";
  };
  n.tidy = tidy;
  n.addEventListener("change", tidy);
  n.addEventListener("keydown", e => { if (e.key === "Enter") tidy(); });
  for (const [k, v] of Object.entries(ons)) n.addEventListener(k.slice(2), v);
  return n;
}
