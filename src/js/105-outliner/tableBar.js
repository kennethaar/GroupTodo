/* The buttons on a table you are writing in (#281): Row and Column open
   their commands, and three toggles line up the caret's column, the one
   it has pressed. They keep the caret where it is. */
const TABLE_ALIGNS = [["left", ICON_ALIGN_LEFT], ["center", ICON_ALIGN_CENTER], ["right", ICON_ALIGN_RIGHT]];
function tableBar(path, b, txt) {
  const btn = (attrs, ...kids) => el("button", {tabindex: "-1", onmousedown: e => e.preventDefault(), ...attrs}, ...kids);
  const menu = name => btn({class: "tbmenu", title: name, "aria-label": name, "aria-haspopup": "menu",
    onclick: e => { e.stopPropagation(); tableMenu(path, b, txt, name); }}, name + " ", svgIcon(ICON_CARET));
  const align = ([a, icon]) => btn({class: "tbalign", "data-al": a, title: "Align " + a, "aria-label": "Align " + a, "aria-pressed": "false",
    onclick: e => {
      e.stopPropagation();
      const at = tableAt(b, txt);
      if (at && tableCan(b, at.bi, at.col).includes("al-" + a)) tableRun(path, b, "al-" + a, at.bi, at.col);
    }}, svgIcon(icon));
  return el("span", {class: "tablebar"}, menu("Row"), menu("Column"),
    el("span", {class: "tbaligns", role: "group", "aria-label": "Alignment"}, ...TABLE_ALIGNS.map(align)));
}
