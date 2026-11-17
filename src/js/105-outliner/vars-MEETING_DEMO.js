/* The day page tip's example, played as it would be typed (#427): each step
   is what the hands do and what the app answers, and the strip under the
   example names the key. Only what the app really does: a name offered after
   two letters, [[ offering pages, Ctrl+Enter going round the states.
     {key, cap}   the caption for what comes next (key first, when there is one)
     {nl: n}      Enter, a new line n steps in
     {type: s}    typed, a letter at a time
     {q, pop, pick}  the popup offers pop for the typed q; the first is picked
     {st: s}      Ctrl+Enter, the line's state is now s */
const MEETING_DEMO = [
  {cap: "Type as it happens. Every line is saved."},
  {nl: 0}, {type: "Weekly sync · product"},
  {key: "Tab", cap: "the next line belongs under it"},
  {nl: 1}, {type: "Relaunch the website "},
  {key: "[[1/", cap: "and a name: the line becomes a project"},
  {type: "[[1/Rel"}, {q: "[[1/Rel", pop: ["1/Relaunch the website"], pick: "[[1/Relaunch the website]]"},
  {key: "Tab", cap: "again: a step under the project"},
  {nl: 2}, {type: "Draft new pricing copy [[c/comp"}, {q: "[[c/comp", pop: ["c/computer"], pick: "[[c/computer]]"},
  {key: "Ctrl+Enter", cap: "TODO, then DOING"},
  {st: "TODO"}, {st: "DOING"},
  {cap: "Start a name: the app offers the people it knows"},
  {nl: 2}, {type: "Get vector logo files from Ad"}, {q: "Ad", pop: ["Ada", "Adam"], pick: "[[p/Ada]]"},
  {key: "Ctrl+Enter", cap: "on to WAIT: you are waiting on Ada"},
  {st: "TODO"}, {st: "DOING"}, {st: "WAIT"},
  {key: "Tab", cap: "a plain line under a task is its note"},
  {nl: 3}, {type: "out until Thursday"},
  {key: "Shift+Tab", cap: "back out, for the next thing said"},
  {nl: 1}, {type: "The 3rd-floor printer is jamming again"},
  {key: "Ctrl+Enter", cap: "a task, right where it came up"},
  {nl: 2}, {type: "Order a replacement roller kit [[c/onl"}, {q: "[[c/onl", pop: ["c/online"], pick: "[[c/online]]"},
  {st: "TODO"},
];
// The run playing now, if any; a redraw of the tip carries it on (#427).
let MEETING_DEMO_RUN = null;
// Played once a session by itself; after that, Replay.
let MEETING_DEMO_PLAYED = false;
