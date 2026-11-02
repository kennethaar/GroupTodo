function plannerSay(area, level, text) {
  PLANNER_NOTE.set(area, {level, text, when: new Date()});
}
