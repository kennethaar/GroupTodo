/* The small outline the outlining lesson plays on (#468), and its four rules.
   One example for all four, so each rule is seen acting on the same lines. */
const OUTLINE_LESSON = {
  lines: [
    {text: "Kitchen renovation", d: 0, task: false, own: ["Project", "Due Fri"], key: null},
    {text: "Choose tiles", d: 1, task: true, key: "Tab"},
    {text: "Ask Anna for the tile catalog", d: 2, task: true, key: "Tab"},
    {text: "Book the plumber", d: 1, task: true, key: "Shift+Tab"},
  ],
  inherited: ["Kitchen renovation", "Due Fri"],
  rules: [
    "Tab puts a line under the one above",
    "A line under another gets what it has",
    "The top line gathers every to-do under it",
    "The deepest step comes first",
  ],
};
