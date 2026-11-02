function solSaveAns() {
  PREF.set("sol.ans", JSON.stringify({week: solWeek(), ans: [...SOL_ANS]}));
}
