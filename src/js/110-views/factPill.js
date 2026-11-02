/* ============================================================
   109b_PAGE_FACTS -- a page's own values, in the document
   ------------------------------------------------------------
   The status, the outcome, the area, the chain and every other key:: value
   used to sit in a bar of pills above the page. That bar was a second place to
   look: the values were nowhere near the words they were about, and the only
   way to correct one was to find its pill among eight others.

   They live in the document now, at the top of the outline, one line each --
   which is exactly where they sit in the markdown file. Every line is two
   things at once:

     * the pill is the control. Click it and you get the three things a value
       can offer -- go to it, change it, take it off -- the same a/b/c menu a
       pill on a todo row opens.
     * the rest of the line is text. Click beside the pill and the line turns
       into the raw "area:: [[a/Health]]" and you type it, the way you type any
       other line here. Enter saves, escape puts it back.
   ============================================================ */

/* A pill inside an editable line. contenteditable=false keeps the caret out of
   it, and refusing the mousedown keeps the click from turning the line into
   text underneath the menu that is opening. */
function factPill(text, cls, title, open) {
  return el("span", {
    class: "fpill" + (cls ? " " + cls : "") + (open ? " b" : ""),
    contenteditable: "false", title: title || "",
    onmousedown: e => { if (open) e.preventDefault(); },
    onclick: open ? (e => { e.stopPropagation(); open(); }) : null,
  }, text);
}
