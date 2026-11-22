/* The Journal's heading on a wide screen (#473). Its name stands on the
   line of Back and Forward, so it starts right of them when the page is too
   narrow to clear them by itself. And it keeps the width of the widest day
   name in this language, so the ‹ date › beside it never move from one day to
   the next. head is the .todayhead, or nothing to only let go. */
let DAY_WIDE = {};
function journalHeadClear(head) {
  if (!head) return;
  const h1 = head.querySelector("h1"), name = h1 && h1.querySelector(".tlong");
  if (name) {
    const font = getComputedStyle(h1).font, year = /\d{4}/.test(name.textContent), key = font + year;
    if (!(key in DAY_WIDE)) {
      const cx = document.createElement("canvas").getContext("2d");
      cx.font = font;
      let w = 0;
      for (let m = 0; m < 12; m++) for (let d = 22; d <= 28; d++) {
        const s = capitalise(new Date(2026, m, d).toLocaleDateString(undefined,
          {weekday: "long", month: "short", day: "numeric", year: year ? "numeric" : undefined}));
        w = Math.max(w, cx.measureText(s).width);
      }
      DAY_WIDE[key] = Math.ceil(w) + 2;
    }
    head.style.setProperty("--daywide", DAY_WIDE[key] + "px");
  }
  head.style.paddingLeft = "";
  if (!document.body.classList.contains("paper") || document.body.classList.contains("capping")) return;
  const fwd = $("#btnFwd");
  if (!fwd || !fwd.getClientRects().length) return;
  const gap = fwd.getBoundingClientRect().right + 16 - head.getBoundingClientRect().left;
  if (gap > 0) head.style.paddingLeft = Math.ceil(gap) + "px";
}
