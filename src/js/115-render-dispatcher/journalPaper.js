/* #395 the Journal is paper first. On a wide screen it has no top bar: a
   line is the one way in. What the bar holds and is still wanted moves, it
   does not go: what is on now and the areas stand in the day's heading,
   Search in the sidebar, Help under the Timer. N brings the bar back to capture, and
   so does a hidden sidebar, whose way back is in it. Other views keep it.
   With place false it parks them back in the bar: render() does so before it
   clears the page. It holds on to the three itself, so one that something
   else threw away with the page is put back, not lost. */
let JOURNAL_PAPER_TOOLS = null;
function journalPaper(place = true) {
  const top = $("header.top"), cap = top && top.querySelector(".capture");
  if (!cap) return;
  if (!JOURNAL_PAPER_TOOLS) {
    const now = $(".hnow"), hb = $("#hereBar"), ab = $("#areaBar"), sb = $("#spacesBtn"), sp = $("#spop"), theme = $("#btnTheme");
    if (!now || !hb || !ab || !sb || !sp || !theme) return;
    JOURNAL_PAPER_TOOLS = {now, hb, ab, sb, sp, theme};
    addEventListener("resize", () => journalHeadClear($("#content .todayhead:not(.weekhead)")));
  }
  const {now, hb, ab, sb, sp, theme} = JOURNAL_PAPER_TOOLS;
  const head = place && $("#content .todayhead:not(.weekhead) > .vhead-r");
  const on = !!head && matchMedia("(min-width:641px)").matches;
  if (place) document.body.classList.toggle("paper", on);
  // Light or dark at the heading's right (#445). Back and Forward stay in the
  // bar, which keeps its shape unseen, so they do not move (#446).
  if (on) { head.prepend(now, ab, sb, sp, hb); head.append(theme); }
  else if (sb.parentNode !== top || ab.parentNode !== top || hb.parentNode !== top || !sp.isConnected || !now.isConnected || theme.parentNode !== top) {
    cap.after(now);
    top.append(ab, sb, sp, hb);
    $("#btnSearch").after(theme);
  }
  if (head) journalHeadClear(head.parentNode);
}
