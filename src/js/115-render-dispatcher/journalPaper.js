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
    const now = $(".hnow"), sb = $("#spacesBtn"), sp = $("#spop"), hist = $(".h-hist"), theme = $("#btnTheme");
    if (!now || !sb || !sp || !hist || !theme) return;
    JOURNAL_PAPER_TOOLS = {now, sb, sp, hist, theme};
  }
  const {now, sb, sp, hist, theme} = JOURNAL_PAPER_TOOLS;
  const head = place && $("#content .todayhead:not(.weekhead) > .vhead-r");
  const on = !!head && matchMedia("(min-width:641px)").matches;
  if (place) document.body.classList.toggle("paper", on);
  // Back and Forward at the heading's left end, Light or dark at its right (#445).
  if (on) { head.prepend(now, sb, sp); head.append(theme); head.parentNode.prepend(hist); }
  else if (sb.parentNode !== top || !sp.isConnected || !now.isConnected || hist.parentNode !== top || theme.parentNode !== top) {
    cap.before(hist);
    cap.after(now);
    top.append(sb, sp);
    $("#btnSearch").after(theme);
  }
}
