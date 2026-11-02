/* The line that is not a value yet. Same gesture as the rest: click it and you
   are typing "key:: value". */
function newFactLine(path) {
  const line = el("div", {class: "pfact"});
  const txt = el("div", {class: "ftxt new", contenteditable: "true", spellcheck: "false",
    title: "Type  key:: value"});
  const paint = () => { txt.textContent = ""; txt.append(el("span", {class: "fkey", contenteditable: "false"}, "+ value")); };
  paint();
  txt.addEventListener("focus", () => setHostText(txt, "", 0));
  txt.addEventListener("blur", () => {
    const val = trim(lineText(txt));
    if (!val) { paint(); return; }
    saveRawProp(path, "", val); render();
  });
  txt.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); txt.blur(); }
    else if (e.key === "Escape") { e.preventDefault(); setHostText(txt, "", 0); txt.blur(); }
  });
  line.append(txt);
  return line;
}
