/* The settings page, made with the default in it the first time it is asked for. */
function ensureTimerPage() {
  if (!V.pages.has(TIMER_PATH)) putPage(TIMER_PATH, {
    props: {title: "timer", minutes: "2", max: "60", style: "bar", volume: "30", created: todayStamp()},
    blocks: [newBlock({title: "The minutes above are what a click on the timer starts, 1 to the max."}),
             newBlock({title: "The max is the longest timer you can set, in whole minutes."}),
             newBlock({title: "The style is bar, a strip in the sidebar, or dial, a pie that shrinks as time runs out."}),
             newBlock({title: "The volume is how loud the alarm rings, 0 to 100."})],
  });
}
