/* The settings are picked, not typed: each lists the values worth having,
   with the one in use marked, and Take it off last. Another value is still
   there for anything the list leaves out. */
const TIMER_SETTINGS = {
  minutes: {name: "Usual length", values: [1, 2, 3, 5, 10, 15, 20, 25, 30, 45, 60, 90, 120],
            word: v => v + " min", about: "what a click starts"},
  max:     {name: "Max", values: [10, 15, 20, 25, 30, 45, 60, 90, 120],
            word: v => v + " min", about: "the longest you can set"},
  style:   {name: "Style", values: ["bar", "dial"], about: "how it looks in the sidebar",
            word: v => ({bar: "Bar", dial: "Dial"})[v] || v,
            detail: v => ({bar: "a strip in the sidebar", dial: "a pie that shrinks as time runs out"})[v]},
  volume:  {name: "Volume", values: [0, 10, 20, 30, 50, 70, 100],
            word: v => +v ? v + " %" : "Silent", about: "how loud the alarm rings"},
};
