/* ▶ Present ▾ › Count down to the start… (#486): the start time, picked
   (P3). The page's own time first, marked, then the next whole and half
   hours, then Another time…, and Take it off last. A pick opens the waiting
   screen. */
function openPresentWait(path) {
  const {now, times} = presentWaitTimes(path);
  chipMenu("Count down to the start", "Slides under a (waiting) line show in turn while it counts down. → starts the talk.", lettered([
    now ? ["✓ " + now.text, "as set on this page", () => presentWaitSet(path, now.text)] : null,
    ...times.map(x => [x, null, () => presentWaitSet(path, x)]),
    ["Another time…", null, () => promptInput({title: "The talk starts at", label: "Time", placeholder: "Time", cta: "Count down",
      onSave: v => {
        const m = SLIDE_WAIT_TIME_RE.exec(trim(v));
        if (m) presentWaitSet(path, (+m[1]) + ":" + m[2]);
        else notify("That is not a time: write it as 13:00.", "warn");
      }})],
    now ? ["Take it off", "no start time on this page", () => { delete getPage(path).props.starts; touch(path); render(); }] : null,
  ]));
}
