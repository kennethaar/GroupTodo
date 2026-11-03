/* opts: {path, after}: the chapter, and the line it goes after (or the end). */
function openScript({path, after = null}) {
  const chars = castEntries().filter(e => e.type === "character");
  if (!chars.length) { notify("No characters yet. Add some under Book › Cast, or name them in a scene.", "warn"); return; }
  const scene = sceneOfBlock(path, after);
  const inScene = scene ? [...namesIn(sceneProp(scene, "pov")), ...namesIn(sceneProp(scene, "with"))].map(castEntryOf).filter(Boolean) : [];
  let cast = [...new Set(inScene)].filter(e => e.type === "character");
  if (cast.length < 2) cast = [...new Set([...cast, ...chars])].slice(0, 2);
  const rows = [{who: cast[0], text: ""}];
  const list = el("div", {class: "scriptrows"}), who = el("div", {class: "fbar scriptwho"});
  const next = e => cast[(cast.indexOf(e) + 1) % cast.length] || cast[0];
  const focusRow = (i, end = true) => requestAnimationFrame(() => {
    const input = list.querySelectorAll("input")[i];
    if (input) { input.focus(); const n = end ? input.value.length : 0; input.setSelectionRange(n, n); }
  });
  const drawWho = () => {
    who.textContent = "";
    who.append(el("span", {class: "say"}, "Talking"), ...chars.map(e => {
      const on = cast.includes(e);
      return fchip(e.name, on, () => {
        if (on && cast.length > 1) cast = cast.filter(x => x !== e);
        else if (!on) cast = [...cast, e];
        drawWho();
      });
    }));
  };
  const draw = () => {
    list.textContent = "";
    rows.forEach((r, i) => {
      const input = el("input", {value: r.text, "aria-label": "What " + r.who.name + " says", placeholder: i ? "" : "What they say",
        oninput: e => { r.text = e.target.value; },
        onkeydown: e => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); e.stopPropagation(); put(); return; }
          if (e.key === "Enter") {
            e.preventDefault(); e.stopPropagation();
            rows.splice(i + 1, 0, {who: next(r.who), text: ""});
            draw(); focusRow(i + 1);
          } else if (e.key === "Tab") {
            e.preventDefault(); e.stopPropagation();
            const at = cast.indexOf(r.who);
            r.who = cast[(at + (e.shiftKey ? cast.length - 1 : 1)) % cast.length] || cast[0];
            draw(); focusRow(i);
          } else if (e.key === "Backspace" && !e.target.value && rows.length > 1) {
            e.preventDefault(); e.stopPropagation();
            rows.splice(i, 1);
            draw(); focusRow(Math.max(0, i - 1));
          } else if (e.key === "ArrowUp" && i > 0) { e.preventDefault(); focusRow(i - 1); }
          else if (e.key === "ArrowDown" && i < rows.length - 1) { e.preventDefault(); focusRow(i + 1); }
        }});
      list.append(el("div", {class: "scriptrow"},
        el("button", {class: "scriptname", tabindex: "-1", title: "Who says it. Tab in the line changes it.",
          onclick: () => { r.who = next(r.who); draw(); focusRow(i); }}, shortName(r.who)), input));
    });
  };
  const put = () => {
    const lines = scriptToProse(rows.map(r => ({who: shortName(r.who), text: r.text})));
    closeModal();
    if (!lines.length) return;
    const page = getPage(path), made = lines.map(t => newBlock({title: t}, false));
    const sibs = after ? siblingsOf(page, after) : page.blocks;
    const at = after ? sibs.indexOf(after) : sibs.length - 1;
    if (after && !trim(after.title) && !(after.children || []).length) sibs.splice(at, 1, ...made);
    else sibs.splice(at + 1, 0, ...made);
    touch(path);
    render();
    focusBlock(made[made.length - 1].id);
  };
  drawWho(); draw();
  modal({center: true, title: "Script", hint: "Enter next line · Tab who speaks · Ctrl+Enter put it in",
    body: el("div", {class: "scriptdlg"}, who, list),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
           el("button", {class: "btn primary scriptput", onclick: put}, "Put it in the chapter")]});
  focusRow(0);
}
