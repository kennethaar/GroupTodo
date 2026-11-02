// The line's status as the dialog offers it: a stage of its type, or its state.
const informStatusOf = block => { const ts = taskStage(block); return ts && ts.stage ? "\u0001" + ts.stage.name : block.state || ""; };
const informCore = (block, v) => v && v[0] === "\u0001"
  ? (taskStage(block)?.stages.find(s => s.name === v.slice(1))?.core || block.state) : v;
// What the status reads as: a stage in your own words, a state in the note's language.
const informStatusWord = (v, words) => !v ? "" : v[0] === "\u0001" ? v.slice(1) : words[v] || v;

/* The status lines as they read in the mail: one numbered block per line,
   its status, your word on it, and the lines under it you left ticked. A
   heading over them where it changes: the responsibility a project summary is
   under, or the project when you name the projects. */
const informHeadOf = (it, named) => it.head != null ? it.head : named ? it.project || "" : "";
const informHeadText = (h, t) => h === "\u0001other" ? t.other : h;
// A project's status is the project's, a line's is the line's or its stage.
const informWordOf = (it, t) => String(it.status || "").startsWith("P:") ? t.projects[it.status.slice(2)] || ""
  : informStatusWord(it.status, t.states);
const informLineText = (c, t) => (c.label ? t.lines[c.label] + " " : "") + c.text;
